from sqlalchemy import Integer, String, DateTime, Date, func, Enum as SQLEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, datetime
from enum import Enum

from app.database.base import Base


# 카테고리 Enum
class Category(str, Enum):
    Restaurant = "Restaurant"
    Cafe = "Cafe"

# 식당 ORM 모델
class Rest(Base):
    __tablename__ = "rests"   # 연결 테이블 이름: rests
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)  # DB 식별자
    created: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())   # 생성 시간
    updated: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())  # 수정 시간

    name: Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False, unique=True)    # 이름
    category: Mapped[Category] = mapped_column(SQLEnum(Category, native_enum=False), nullable=False)   # 카테고리
    addr: Mapped[dict] = mapped_column(JSON, nullable=False)      # 주소
    info: Mapped[str | None] = mapped_column(String(1000))     # 설명
    phone: Mapped[str | None] = mapped_column(String(15))      # 전화번호
    url_link: Mapped[str | None] = mapped_column(String(300))  # 링크
    etc_info: Mapped[str | None] = mapped_column(String(100))  # 기타 정보
    img: Mapped[str | None] = mapped_column(String(100))       # 사진 경로
    except_close_start: Mapped[date | None] = mapped_column(Date)  # 임시 휴무 시작일
    except_close_end: Mapped[date | None] = mapped_column(Date)    # 임시 휴무 종료일

    # 영업시간 리스트
    rest_hours: Mapped[list["RestHour"]] = relationship("RestHour", back_populates="rest")

    # 메뉴 리스트
    menus: Mapped[list["Menu"]] = relationship("Menu", back_populates="rest")