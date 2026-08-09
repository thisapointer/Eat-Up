from fastapi import HTTPException, status
from sqlalchemy import select, not_, exists, func
from sqlalchemy.orm import Session, selectinload
from datetime import datetime

from app.models.users import User, fav_association
from app.models.rests import Rest
from app.models.menus import Menu
from app.models.cert import Cert
from app.models.menu_certs import MenuCert
from app.schemas.rests import RestCreate, RestUpdate, RestReplace


# 식당 등록 로직
def create(rest_info: RestCreate, db: Session) -> Rest:

    # 같은 이름의 식당이 있는지 검사
    rest = db.query(Rest).filter(Rest.name == rest_info.name).first()
    # 존재한다면 중복이므로 에러
    if rest:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail="식당 이름이 이미 존재합니다.")

    # 입력 받은 정보로 객체 생성
    new_rest = Rest(**rest_info.model_dump())

    # DB에 추가
    db.add(new_rest)
    db.commit()             # DB에 반영
    db.refresh(new_rest)    # 파이썬 객체에 동기화

    return new_rest

# 전체 식당 조회 로직
def get_all(db: Session) -> tuple[int, list[Rest]]:

    # DB에서 전체 식당 리스트 조회
    rests = db.query(Rest)\
                .options(selectinload(Rest.rest_hours))\
                .all()

    return len(rests), rests

# 식당 조회 로직
def get_one(rest_id: int, db: Session) -> Rest:

    # DB에서 식당 조회
    rest = db.query(Rest)\
            .options(selectinload(Rest.rest_hours))\
            .filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")
 
    return rest

# 식당 정보 수정 로직
def modify(rest_id: int, rest_info: RestUpdate, db: Session) -> Rest:

    # DB에서 식당 조회
    rest = db.query(Rest).filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")

    # 요청에 포함된 필드만 추출
    update_dict = rest_info.model_dump(exclude_unset=True)

    # 변경된 필드만 업데이트
    for key, value in update_dict.items():
        setattr(rest, key, value)     # 이미 존재하는 속성의 값을 변경하거나, 없는 속성을 새로 만들어 값을 할당

    db.commit()         # DB에 반영
    db.refresh(rest)    # 파이썬 객체에 동기화

    return rest

# 식당 덮어쓰기 로직
def replace(rest_id: int, rest_info: RestReplace, db: Session) -> Rest:

    # DB에서 식당 조회
    rest = db.query(Rest).filter(Rest.id == rest_id).first()

    if not rest:
        # 식당이 없을 시 생성
        new_rest = Rest(id = rest_id, **rest_info.model_dump()) # type: ignore
        db.add(new_rest)
        rest = new_rest
    else:
        # 식당 존재 시 업데이트
        for key, value in rest_info.model_dump().items():
            setattr(rest, key, value)   # 이미 존재하는 속성의 값을 변경하거나, 없는 속성을 새로 만들어 값을 할당

    db.commit()         # DB에 반영
    db.refresh(rest)    # 파이썬 객체에 동기화

    return rest

# 식당 삭제 로직
def delete(rest_id: int, db: Session) -> bool:

    # 식당 삭제
    db.query(Rest).filter(Rest.id == rest_id).delete()
    db.commit()

    return True

# 식당 검색 로직
def search(name: str, db: Session) -> dict:

    if name == "식당": 
        rests = db.query(Rest)\
                    .options(selectinload(Rest.rest_hours))\
                    .filter(Rest.category == "Restaurant").all()
        return {
            "total_count": len(rests),
            "rests": rests
        }
    elif name == "카페":
        rests = db.query(Rest)\
                    .options(selectinload(Rest.rest_hours))\
                    .filter(Rest.category == "Cafe").all()
        return {
            "total_count": len(rests),
            "rests": rests
        }


    # name 포함 검색 문자열
    search_query = f"%{name}%"

    # DB에서 검색어를 포함한 식당 조회
    rests = db.query(Rest)\
                .options(selectinload(Rest.rest_hours))\
                .filter(Rest.name.ilike(search_query))\
                .all()                      # 식당 리스트

    return {
        "total_count": len(rests),
        "rests": rests
    }

# 전체 식당 조회 로직 (필터링 포함)
def get_all_with_filter(current_user: User, 
                        db: Session, 
                        fav: bool | None = False, 
                        not_visited: bool | None = False, 
                        oper: bool | None = False):

    # 기본 쿼리 생성 (RestHour 관계를 미리 로딩하여 N+1 방지)
    query = select(Rest).options(selectinload(Rest.rest_hours))

    # [필터 1] 찜한 식당만 보기
    if fav:
        query = query.join(fav_association, Rest.id == fav_association.c.rest_id)\
                     .where(fav_association.c.user_id == current_user.id)

    # [필터 2] 안 가본(미방문) 식당만 보기 (EXISTS 서브쿼리로 효율적 처리)
    if not_visited:
        # 해당 유저가 인증(Cert)한 적 있는 Rest ID 서브쿼리
        visited_subquery = (
            select(1)
            .select_from(Cert)
            .join(Cert.menu_certs)
            .join(MenuCert.menu)
            .where(Cert.user_id == current_user.id)
            .where(Menu.rest_id == Rest.id)
        )
        query = query.where(not_(exists(visited_subquery)))

    # DB에서 조건에 맞는 식당 목록 1차 조회
    rests = db.scalars(query).all()


    # [필터 3] 현재 영업 중인 식당 필터링 (영업시간 판단 로직 정리)
    if oper:
        current_time = datetime.now().time()
        filtered_rests = []

        for rest in rests:
            # 오늘 요일에 해당하는 RestHour 찾기
            today_hour = rest.today_hours

            # 휴무이거나 영업시간 정보가 없으면 스킵
            if not today_hour or today_hour.is_closed or not today_hour.open_time or not today_hour.close_time:
                continue

            open_t = today_hour.open_time
            close_t = today_hour.close_time

            # 영업시간 판단 (야간 영업 고려)
            is_open = False
            if open_t <= close_t:
                # 일반 영업 (예: 09:00 ~ 21:00)
                is_open = open_t <= current_time <= close_t
            else:
                # 야간 영업 (예: 18:00 ~ 02:00 - 자정을 넘어가는 경우)
                is_open = current_time >= open_t or current_time <= close_t

            if is_open:
                filtered_rests.append(rest)
        
        rests = filtered_rests


    # is_liked, is_visited 값 일괄 매핑 로직
    # 현재 유저가 찜한 식당 ID 집합(Set) 구하기
    fav_rest_ids = set(
        db.scalars(
            select(fav_association.c.rest_id)
            .where(fav_association.c.user_id == current_user.id)
        ).all()
    )

    # 현재 유저가 방문(인증)한 식당 ID 집합(Set) 구하기
    visited_rest_ids = set(
        db.scalars(
            select(Menu.rest_id)
            .select_from(Cert)
            .join(Cert.menu_certs)
            .join(MenuCert.menu)
            .where(Cert.user_id == current_user.id)
        ).all()
    )

    # 조회된 식당 객체들에 is_liked, is_visited 동적 속성 할당
    for rest in rests:
        rest.is_liked = rest.id in fav_rest_ids
        rest.is_visited = rest.id in visited_rest_ids

    return {
        "total_count": len(rests),
        "rests": rests
    }