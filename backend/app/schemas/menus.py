from datetime import datetime
from pydantic import BaseModel, ConfigDict


# 베이스
class MenuBase(BaseModel):
    name: str       # 메뉴 이름
    price: int      # 메뉴 가격
    img: str | None = None        # 메뉴 사진 경로

# 생성용
class MenuCreate(MenuBase):
    pass

# 수정용
class MenuUpdate(BaseModel):
    name: str | None = None
    price: int | None = None
    img: str | None = None

# 단일/단순 조회용
class MenuRead(MenuBase):
    id: int
    created: datetime
    updated: datetime

    # ORM 객체(Model)를 Pydantic으로 변환 허용
    model_config = ConfigDict(from_attributes=True) 

# 다중 조회용
class MenuListResponse(BaseModel):
    total_count: int        # 전체 데이터 개수 (프론트엔드 페이지네이션 바 구현용)
    menus: list[MenuRead]   # 실제 메뉴 목록 데이터