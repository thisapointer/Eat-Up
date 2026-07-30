from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.schemas.rests import RestRead


# 베이스
class CertBase(BaseModel):
    menu_ids: list[int]     # 메뉴 id 목록
    created: datetime       # 생성시간

# 단일/단순 조회용
class CertRead(CertBase):
    id: int
    updated: datetime

    rest_info: RestRead
    visit_count: int

    # ORM 객체(Model)를 Pydantic으로 변환 허용
    model_config = ConfigDict(from_attributes=True) 

# 다중 조회용
class CertListResponse(BaseModel):
    total_count: int        # 전체 데이터 개수 (프론트엔드 페이지네이션 바 구현용)
    certs: list[CertRead]   # 실제 인증 목록 데이터