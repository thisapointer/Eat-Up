from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.models.users import User
import app.services.fav as service
from app.database.session import get_db
from app.routers.dependencies import get_current_user



# 라우터 객체
router = APIRouter(prefix = "/fav", tags=["찜하기"])

# POST - 찜 등록
@router.post("/", status_code=status.HTTP_201_CREATED)
def create(rest_id: int = Query(description="식당 id"),
           current_user: User = Depends(get_current_user), 
           db: Session = Depends(get_db)) -> bool:
    return service.create(rest_id, current_user, db)

# DELETE - 찜 삭제
@router.delete("/")
def delete(rest_id: int = Query(description="식당 id"),
           current_user: User = Depends(get_current_user),
           db: Session = Depends(get_db)) -> bool:
    return service.delete(rest_id, current_user, db)