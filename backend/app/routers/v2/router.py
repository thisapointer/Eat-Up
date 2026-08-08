from fastapi import APIRouter

from app.routers.v2.endpoints import rests


# api version 2 라우터
router = APIRouter(prefix="/api/v2")

# v2 하위 엔드포인트 등록
router.include_router(rests.router)
