from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.models.users import User
from app.schemas.users import UserCreate, UserRead, UserListResponse, UserUpdate
import app.services.users as service
from app.database.session import get_db
from app.routers.dependencies import get_current_user


# 라우터 객체
router = APIRouter(prefix = "/api/v1/users", tags=["유저"])

# POST - 회원 가입
# Request Body: UserCreate
# Response Body: UserRead
@router.post("/", response_model=UserRead,
             status_code=status.HTTP_201_CREATED)
def create(user_info: UserCreate, 
           db: Session = Depends(get_db)) -> User:
    return service.create(user_info, db)

# GET - 모든 유저 목록
# Request Body: 없음
# Response Body: UserListResponse
@router.get("/", response_model=UserListResponse)
def get_all(db: Session = Depends(get_db)) -> dict:
    return service.get_all(db)

# GET - 아이디 중복 검사  
# Request Body: 없음
# Response Body: true
@router.get("/check")
def check_id(user_id: str = Query(description="아이디 검색어"), 
             db: Session = Depends(get_db)) -> bool:
    return service.check_id(user_id, db)

# PATCH - 유저 정보 수정
# Request Body: UserUpdate
# Response Body: UserRead
@router.patch("/me", response_model=UserRead)
def modify(user_info: UserUpdate,
           current_user: User = Depends(get_current_user),
           db: Session = Depends(get_db)) -> User:
    return service.modify(user_info, current_user, db)

# DELETE - 회원 탈퇴
# Request Body: 없음
# Response Body: true
@router.delete("/me")
def delete(current_user: User = Depends(get_current_user),
           db: Session = Depends(get_db)) -> bool:
    return service.delete(current_user, db)

# GET - 유저 조회
# Request Body: 없음
# Response Body: UserRead
@router.get("/{user_id}", response_model=UserRead)
def get_one(user_id: int, db: Session = Depends(get_db)) -> User:
    return service.get_one(user_id, db)


# # PUT - 유저 덮어쓰기
# # Request Body: UserReplace
# # Response Body: UserRead
# @router.put("/me", response_model=UserRead)
# def replace(user_info: UserReplace,
#             current_user: User = Depends(get_current_user),
#             db: Session = Depends(get_db)) -> User:
#     return service.replace(user_info, current_user, db)

