from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.models.breaks import Break
from app.schemas.breaks import BreakBase, BreakRead
import app.services.breaks as service
from app.database.session import get_db


# 라우터 객체
router = APIRouter(prefix = "/breaks", tags=["식당 브레이크타임"])

# GET - 브레이크타임 조회
# Request Body: 없음
# Response Body: list[BreakRead]
@router.get("/", response_model=list[BreakRead])
def get_all(rest_id: int = Query(description="식당 id"),
            weekday: str = Query(description="영업시간 id(요일)"), 
            db: Session = Depends(get_db)) -> list[Break]:
    return service.get_all(rest_id, weekday, db)

# POST - 브레이크타임 등록
# Request Body: list[BreakBase]
# Response Body: list[BreakRead]
@router.post("/bulk", response_model=list[BreakRead],
             status_code=status.HTTP_201_CREATED)
def create(break_info: list[BreakBase],
           rest_id: int = Query(description="식당 id"),
           weekday: str = Query(description="영업시간 id(요일)"),
           db: Session = Depends(get_db)) -> list[Break]:
    return service.create(break_info, rest_id, weekday, db)

# PUT - 브레이크타임 수정
# Request Body: list[BreakBase]
# Response Body: list[BreakRead]
@router.put("/bulk", response_model=list[BreakRead])
def replace(break_info: list[BreakBase],
            rest_id: int = Query(description="식당 id"),
            weekday: str = Query(description="영업시간 id(요일)"),
            db: Session = Depends(get_db)) -> list[Break]:
    return service.replace(break_info, rest_id, weekday, db)

# DELETE - 브레이크타임 삭제
# Request Body: 없음
# Response Body: true
@router.delete("/{break_id}")
def delete(break_id: int,
           rest_id: int = Query(description="식당 id"),
           weekday: str = Query(description="영업시간 id(요일)"),
           db: Session = Depends(get_db)) -> bool:
    return service.delete(break_id, rest_id, weekday, db)
