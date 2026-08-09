from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.users import User
from app.schemas.rests import RestListResponseWithFavVisited
import app.services.rests as service
from app.database.session import get_db
from app.routers.dependencies import get_current_user


# 라우터 객체
router = APIRouter(prefix = "/rests", tags=["식당 - v2"])

# GET - 모든 식당 목록 (필터링 포함)
# Request Body: 없음
# Response Body: RestListResponseWithFavVisited
@router.get("/", response_model=RestListResponseWithFavVisited)
def get_all(current_user: User = Depends(get_current_user),
            db: Session = Depends(get_db),
            fav: bool | None = Query(default=None, description="찜하기 필터"),
            not_visited: bool | None = Query(default=None, description="미방문 필터"),
            oper: bool | None = Query(default=None, description="영업중 필터")) -> dict:
    return service.get_all_with_filter(current_user, db, fav, not_visited, oper)



