from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.models.menus import Menu
from app.schemas.menus import MenuCreate, MenuRead, MenuListResponse, MenuUpdate
import app.services.menus as service
from app.database.session import get_db


# 라우터 객체
router = APIRouter(prefix = "/menus", tags=["메뉴"])

# POST - 메뉴 등록
# Request Body: MenuCreate
# Response Body: MenuRead
@router.post("/", response_model=MenuRead,
             status_code=status.HTTP_201_CREATED)
def create(menu_info: MenuCreate,
           rest_id: int = Query(description="식당 id"),
           db: Session = Depends(get_db)) -> Menu:
    return service.create(menu_info, rest_id, db)

# GET - 모든 메뉴 조회
# Request Body: 없음
# Response Body: MenuListResponse
@router.get("/", response_model=MenuListResponse)
def get_all(rest_id: int = Query(description="식당 id"), 
            db: Session = Depends(get_db)) -> dict:
    return service.get_all(rest_id, db)

# PATCH - 메뉴 수정
# Request Body: MenuUpdate
# Response Body: MenuRead
@router.patch("/{menu_id}", response_model=MenuRead)
def modify(menu_id: int,
           menu_info: MenuUpdate,
           rest_id: int = Query(description="식당 id"),
           db: Session = Depends(get_db)) -> Menu:
    return service.modify(menu_id, menu_info, rest_id, db)

# DELETE - 메뉴 삭제
# Request Body: 없음
# Response Body: true
@router.delete("/{menu_id}")
def delete(menu_id: int,
           rest_id: int = Query(description="식당 id"),
           db: Session = Depends(get_db)) -> bool:
    return service.delete(menu_id, rest_id, db)
