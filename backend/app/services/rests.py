from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.rests import Rest
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

    # DB에서 전체 조회
    total_count = db.query(Rest).count()    # 전체 식당 수
    rests = db.query(Rest).all()            # 식당 리스트

    return total_count, rests

# 식당 조회 로직
def get_one(rest_id: int, db: Session) -> Rest:

    # DB에서 식당 조회
    rest = db.query(Rest).filter(Rest.id == rest_id).first()
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
        rests = db.query(Rest).filter(Rest.category == "Restaurant").all()
        return {
            "total_count": len(rests),
            "rests": rests
        }
    elif name == "카페":
        rests = db.query(Rest).filter(Rest.category == "Cafe").all()
        return {
            "total_count": len(rests),
            "rests": rests
        }


    # name 포함 검색 문자열
    search_query = f"%{name}%"

    # DB에서 검색어를 포함한 식당 조회
    rests = db.query(Rest)\
                .filter(Rest.name.ilike(search_query))\
                .all()                      # 식당 리스트

    return {
        "total_count": len(rests),
        "rests": rests
    }