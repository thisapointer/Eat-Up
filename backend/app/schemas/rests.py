from datetime import datetime, date
from pydantic import BaseModel, ConfigDict

from app.models.rests import Category


# 주소 클래스
class AddrSchema(BaseModel):
    addr_name: str
    x: float
    y: float

# 베이스
class RestBase(BaseModel):
    name: str               # 식당 이름
    category: Category      # 카테고리
    addr: AddrSchema        # 주소
    info: str | None = None                   # 설명
    except_close_start: date | None = None    # 임시휴무 시작일
    except_close_end: date | None = None      # 임시휴무 종료일
    phone: str | None = None                  # 전화번호
    url_link: str | None = None               # 식당 url 링크
    etc_info: str | None = None               # 식당 기타 정보
    img: str | None = None               # 식당 사진 경로

# 생성용
class RestCreate(RestBase):
    pass

# 수정용
class RestUpdate(BaseModel):
    category: Category | None = None
    addr: AddrSchema | None = None
    info: str | None = None
    except_close_start: date | None = None
    except_close_end: date | None = None
    phone: str | None = None
    url_link: str | None = None
    etc_info: str | None = None
    img: str | None = None

# 단일/단순 조회용
class RestRead(RestBase):
    id: int
    created: datetime
    updated: datetime

    # ORM 객체(Model)를 Pydantic으로 변환 허용
    model_config = ConfigDict(from_attributes=True) 

# 다중 조회용
class RestListResponse(BaseModel):
    total_count: int        # 전체 데이터 개수 (프론트엔드 페이지네이션 바 구현용)
    rests: list[RestRead]   # 실제 식당 목록 데이터

# 덮어쓰기용
class RestReplace(RestCreate):
    pass