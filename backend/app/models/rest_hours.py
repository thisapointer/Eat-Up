from sqlalchemy import Integer, Boolean, DateTime, Time, ForeignKey, func, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, time
from enum import Enum

from app.database.base import Base

# 요일 Enum
class Weekday(str, Enum):
    MON = "MON"
    TUE = "TUE"
    WED = "WED"
    THU = "THU"
    FRI = "FRI"
    SAT = "SAT"
    SUN = "SUN"

# 식당 영업정보 ORM 모델
class RestHour(Base):
    __tablename__ = "rest_hours"   # 연결 테이블 이름: rest_hours

    # 식당 id (외래키)
    rest_id: Mapped[int] = mapped_column(Integer, ForeignKey("rests.id", ondelete="CASCADE"), nullable=False, primary_key=True)
    
    weekday: Mapped[Weekday] = mapped_column(SQLEnum(Weekday, native_enum=False), primary_key=True, nullable=False)     # 요일 (DB 식별자)
    created: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())      # 생성 시간
    updated: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())  # 수정 시간

    is_closed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)  # 휴무 여부
    open_time: Mapped[time | None] = mapped_column(Time)       # 영업 시작 시간
    close_time: Mapped[time | None] = mapped_column(Time)      # 영업 종료 시간

    # 식당 역참조 설정
    rest: Mapped["Rest"] = relationship("Rest", back_populates="rest_hours")

    # 브레이크 타임 리스트
    breaks: Mapped[list["Break"]] = relationship("Break", back_populates="rest_hour", cascade="all, delete-orphan")

    
