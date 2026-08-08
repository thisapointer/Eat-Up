from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.models.rests import Rest
from app.schemas.rests import RestCreate, RestRead, RestListResponse, RestUpdate
import app.services.rests as service
from app.database.session import get_db


# 라우터 객체
router = APIRouter(prefix = "/rests", tags=["식당 - v1"])

# POST - 식당 등록
# Request Body: RestCreate
# Response Body: RestRead
@router.post("/", response_model=RestRead,
             status_code=status.HTTP_201_CREATED)
def create(rest_info: RestCreate, 
           db: Session = Depends(get_db)) -> Rest:
    return service.create(rest_info, db)

# GET - 모든 식당 목록
# Request Body: 없음
# Response Body: RestListResponse
@router.get("/", response_model=RestListResponse)
def get_all(db: Session = Depends(get_db)) -> dict:
    total_count, rests = service.get_all(db)
    return {
        "total_count": total_count,
        "rests": rests
    }

# GET - 식당 검색
# Request Body: 없음
# Response Body: RestListResponse
@router.get("/search", response_model=RestListResponse)
def search(name: str = Query(description="식당 검색어"), 
           db: Session = Depends(get_db)) -> dict:
    return service.search(name, db)

# GET - 식당 조회
# Request Body: 없음
# Response Body: RestRead
@router.get("/{rest_id}", response_model=RestRead)
def get_one(rest_id: int, db: Session = Depends(get_db)) -> Rest:
    return service.get_one(rest_id, db)

# PATCH - 식당 정보 수정
# Request Body: RestUpdate
# Response Body: RestRead
@router.patch("/{rest_id}", response_model=RestRead)
def modify(rest_id: int, 
           rest_info: RestUpdate, 
           db: Session = Depends(get_db)) -> Rest:
    return service.modify(rest_id, rest_info, db)

# DELETE - 식당 삭제
# Request Body: 없음
# Response Body: true
@router.delete("/{rest_id}")
def delete(rest_id: int, db: Session = Depends(get_db)) -> bool:
    return service.delete(rest_id, db)

# # PUT - 식당 덮어쓰기
# # Request Body: RestReplace
# # Response Body: RestRead
# @router.put("/{rest_id}", response_model=RestRead)
# def replace(rest_id: int, 
#             rest_info: RestReplace, 
#             db: Session = Depends(get_db)) -> Rest:
#     return service.replace(rest_id, rest_info, db)


