from fastapi import HTTPException
from sqlalchemy.orm import Session, selectinload

from app.models.rests import Rest
from app.models.rest_hours import RestHour
from app.models.breaks import Break
from app.schemas.breaks import BreakBase


# 브레이크타임 조회 로직
def get_all(rest_id: int, weekday: str, db: Session) -> list[Break]:

    # 해당 영업시간
    hour = db.query(RestHour)\
            .options(selectinload(RestHour.breaks))\
            .filter(RestHour.rest_id == rest_id)\
            .filter(RestHour.weekday == weekday).first()
    # 영업시간 존재하지 않을 시 에러
    if not hour:
        raise HTTPException(status_code=404, detail="Rest or RestHour not found")
    
    return hour.breaks

# 브레이크타임 등록 로직
def create(break_info: list[BreakBase], 
           rest_id: int, weekday: str, db: Session) -> list[Break]:
    
    # 해당 영업시간
    hour = db.query(RestHour)\
            .options(selectinload(RestHour.breaks))\
            .filter(RestHour.rest_id == rest_id)\
            .filter(RestHour.weekday == weekday).first()
    # 영업시간 존재하지 않을 시 에러
    if not hour:
        raise HTTPException(status_code=404, detail="Rest or RestHour not found")
    
    # 브레이크타임 반복 등록
    for break_item in break_info:
        new_break = Break(**break_item.model_dump(), rest_id=rest_id, weekday=weekday)
        hour.breaks.append(new_break)

    db.commit()     # DB에 반영
    
    return hour.breaks

# 브레이크타임 수정 로직
def replace(break_info: list[BreakBase], 
           rest_id: int, weekday: str, db: Session) -> list[Break]:
    
    # DB에서 식당 조회
    rest = db.query(Rest).filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")

    # 전체 브레이크타임 삭제
    db.query(Break)\
        .filter(Break.rest_id == rest_id)\
        .filter(Break.weekday == weekday).delete()

    # 브레이크타임 반복 등록
    new_breaks = []
    for break_item in break_info:
        new_break = Break(**break_item.model_dump(), rest_id=rest_id, weekday=weekday)
        db.add(new_break)
        new_breaks.append(new_break)    # 리턴용 리스트에 보관

    db.commit()     # DB에 반영
    
    return new_breaks

# 브레이크 타임 삭제 로직
def delete(break_id: int, rest_id: int, weekday: str,
           db: Session) -> bool:
    
    # 브레이크타임 삭제
    db.query(Break)\
        .filter(Break.rest_id == rest_id)\
        .filter(Break.weekday == weekday)\
        .filter(Break.id == break_id).delete()
    
    # DB에 반영
    db.commit()

    return True