from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.models.users import User
from app.models.cert import Cert
from app.schemas.cert import CertBase, CertRead, CertListResponse
import app.services.cert as service
from app.database.session import get_db
from app.routers.dependencies import get_current_user


# 라우터 객체
router = APIRouter(prefix = "/api/v1/cert", tags=["식당 방문 인증"])

# POST - 식당인증 등록
# Request Body: CertBase
# Response Body: CertRead
@router.post("/", response_model=CertRead,
             status_code=status.HTTP_201_CREATED)
def create(cert_info: CertBase,
           rest_id: int = Query(description="식당 id"),
           current_user: User = Depends(get_current_user),
           db: Session = Depends(get_db)) -> Cert:
    return service.create(cert_info, rest_id, current_user, db)

# GET - 모든 식당인증 조회
# Request Body: 없음
# Response Body: CertListResponse
@router.get("/", response_model=CertListResponse)
def get_all(rest_id: int = Query(description="식당 id"),
            current_user: User = Depends(get_current_user),
            db: Session = Depends(get_db)) -> dict:
    return service.get_all(rest_id, current_user, db)

# GET - 인증 식당 개수 조회
# Request Body: 없음
# Response Body: "total_count"
@router.get("/count")
def get_rest_count(current_user: User = Depends(get_current_user),
            db: Session = Depends(get_db)) -> dict:
    return service.count(current_user, db)

# GET - 식당인증 조회
# Request Body: 없음
# Response Body: CertRead
@router.get("/{cert_id}", response_model=CertRead)
def get_one(cert_id: int, 
            rest_id: int = Query(description="식당 id"),
            current_user: User = Depends(get_current_user),
            db: Session = Depends(get_db)) -> Cert:
    return service.get_one(cert_id, rest_id, current_user, db)

# DELETE - 식당인증 삭제
# Request Body: 없음
# Response Body: true
@router.delete("/{cert_id}")
def delete(cert_id: int,
           current_user: User = Depends(get_current_user),
           db: Session = Depends(get_db)) -> bool:
    return service.delete(cert_id, current_user, db)
