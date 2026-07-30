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
    # 브레이크타임 존재할 시 에러
    if hour.breaks:
        raise HTTPException(status_code=409, detail="Breaktime already exists")
    
    # 브레이크타임 반복 등록
    for break_item in break_info:
        new_break = Break(**break_item.model_dump(), weekday=weekday)
        hour.breaks.append(new_break)

    db.commit()     # DB에 반영
    
    return hour.breaks

# 브레이크타임 수정 로직
def replace(break_info: list[BreakBase], 
           rest_id: int, weekday: str, db: Session) -> list[Break]:
    
    # 해당 영업시간
    hour = db.query(RestHour)\
            .options(selectinload(RestHour.breaks))\
            .filter(RestHour.rest_id == rest_id)\
            .filter(RestHour.weekday == weekday).first()
    # 영업시간 존재하지 않을 시 에러
    if not hour:
        raise HTTPException(status_code=404, detail="Rest or RestHour not found")

    # 전체 브레이크타임 삭제
    hour.breaks.clear()

    # 브레이크타임 반복 등록
    for break_item in break_info:
        new_break = Break(**break_item.model_dump(), weekday=weekday)
        hour.breaks.append(new_break)
    
    # DB에 반영    
    db.commit()
    
    return hour.breaks

# 브레이크 타임 삭제 로직
def delete(break_id: int, rest_id: int, weekday: str,
           db: Session) -> bool:

    # 해당 영업시간
    hour = db.query(RestHour)\
            .options(selectinload(RestHour.breaks))\
            .filter(RestHour.rest_id == rest_id)\
            .filter(RestHour.weekday == weekday).first()
    # 영업시간 존재하지 않을 시 에러
    if not hour:
        raise HTTPException(status_code=404, detail="Rest or RestHour not found")

    # 해당 브레이크 타임
    target_break = next((b for b in hour.breaks if b.id == break_id), None)
    # 삭제할 브레이크타임이 존재하지 않을 경우 에러
    if not target_break:
        raise HTTPException(status_code=404, detail="Breaktime not found")

    # 리스트에서 제거
    hour.breaks.remove(target_break)

    # DB에 반영
    db.commit()

    return True