from fastapi import APIRouter

from app.routers.v1.endpoints import breaks, cert, fav, rest_hours, rests, menus, users


# api version 1 라우터
router = APIRouter(prefix="/api/v1")

# v1 하위 엔드포인트 등록
router.include_router(breaks.router)
router.include_router(cert.router)
router.include_router(fav.router)
router.include_router(rest_hours.router)
router.include_router(rests.router)
router.include_router(menus.router)
router.include_router(users.router)

