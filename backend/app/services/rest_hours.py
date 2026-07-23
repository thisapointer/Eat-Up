from fastapi import HTTPException
from sqlalchemy.orm import Session, selectinload

from app.models.rests import Rest
from app.models.rest_hours import RestHour
from app.schemas.rest_hours import HourBase


# 영업시간 등록 로직
def create(hour_info: list[HourBase], 
           rest_id: int, 
           db: Session) -> list[RestHour]:

    # DB에서 식당 조회
    rest = db.query(Rest)\
            .options(selectinload(Rest.rest_hours))\
            .filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")

    # 등록할 요일들
    existing_weekdays = {h.weekday for h in rest.rest_hours}

    # 영업시간 반복 등록
    for hour_item in hour_info:
        if hour_item.weekday in existing_weekdays:
            raise HTTPException(status_code=409, 
                                detail=f"이미 등록된 요일({hour_item.weekday})입니다")

        new_hour = RestHour(**hour_item.model_dump(), rest_id=rest_id)
        rest.rest_hours.append(new_hour)

    db.commit()             # DB에 반영

    return rest.rest_hours

# 영업시간 조회 로직
def get_all(rest_id: int, db: Session) ->  list[RestHour]:

    # DB에서 식당 조회
    rest = db.query(Rest)\
            .options(selectinload(Rest.rest_hours))\
            .filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")

    return rest.rest_hours

# 영업시간 수정 로직
def replace(hour_info: list[HourBase], rest_id: int, db: Session) -> list[RestHour]:

    # DB에서 식당 조회
    rest = db.query(Rest)\
            .options(selectinload(Rest.rest_hours))\
            .filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")

    # 전체 영업시간 딕셔너리
    oper_time_map = {oper_time.weekday: oper_time for oper_time in rest.rest_hours}

    # 영업시간 반복 등록
    for item in hour_info:

        # 해당 영업시간 
        oper_time = oper_time_map.get(item.weekday)

        if not oper_time:
            # 영업시간이 없을 시 생성
            new_hour = RestHour(**item.model_dump(), rest_id=rest_id)
            rest.rest_hours.append(new_hour)
        else:
            # 영업시간 존재 시 업데이트
            for key, value in item.model_dump().items():
                setattr(oper_time, key, value)   # 이미 존재하는 속성의 값을 변경하거나, 없는 속성을 새로 만들어 값을 할당

    db.commit()         # DB에 반영

    return rest.rest_hours

# 영업시간 삭제 로직
def delete(weekday: str, rest_id: int, db: Session) -> bool:

    # 영업시간 삭제
    db.query(RestHour)\
        .filter(RestHour.rest_id == rest_id)\
        .filter(RestHour.weekday == weekday).delete()
    db.commit()

    return True