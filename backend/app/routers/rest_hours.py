from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.models.rest_hours import RestHour
from app.schemas.rest_hours import HourBase, HourRead
import app.services.rest_hours as service
from app.database.session import get_db


# 라우터 객체
router = APIRouter(prefix = "/api/v1/hours", tags=["식당 영업시간"])

# GET - 영업시간 조회
# Request Body: 없음
# Response Body: list[HourRead]
@router.get("/", response_model=list[HourRead])
def get_all(rest_id: int = Query(description="식당 id"), 
            db: Session = Depends(get_db)) -> list[RestHour]:
    return service.get_all(rest_id, db)

# POST - 영업시간 등록
# Request Body: list[HourBase]
# Response Body: list[HourRead]
@router.post("/bulk", response_model=list[HourRead],
             status_code=status.HTTP_201_CREATED)
def create(hour_info: list[HourBase],
           rest_id: int = Query(description="식당 id"), 
           db: Session = Depends(get_db)) -> list[RestHour]:
    return service.create(hour_info, rest_id, db)

# PUT - 영업시간 수정
# Request Body: list[HourBase]
# Response Body: list[HourRead]
@router.put("/bulk", response_model=list[HourRead])
def replace(hour_info: list[HourBase],
            rest_id: int = Query(description="식당 id"), 
            db: Session = Depends(get_db)) -> list[RestHour]:
    return service.replace(hour_info, rest_id, db)

# DELETE - 영업시간 삭제
# Request Body: 없음
# Response Body: true
@router.delete("/{weekday}")
def delete(weekday: str,
           rest_id: int = Query(description="식당 id"), 
           db: Session = Depends(get_db)) -> bool:
    return service.delete(weekday, rest_id, db)
