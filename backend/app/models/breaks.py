from sqlalchemy import Integer, DateTime, Time, ForeignKeyConstraint, func, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, time

from app.database.base import Base
from app.models.rest_hours import Weekday


# 브레이크타임 ORM 모델
class Break(Base):
    __tablename__ = "breaks"   # 연결 테이블 이름: breaks
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)  # DB 식별자
    created: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())   # 생성 시간
    updated: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())  # 수정 시간

    break_start_time: Mapped[time] = mapped_column(Time)    # 브레이크 시작 시간
    break_end_time: Mapped[time] = mapped_column(Time)      # 브레이크 종료 시간

    # 식당 id (외래키)
    rest_id: Mapped[int] = mapped_column(Integer, nullable=False)
    # 식당 영업시간 id (외래키)
    weekday: Mapped[Weekday] = mapped_column(SQLEnum(Weekday, native_enum=False), nullable=False)
    # 식당 영업시간 역참조 설정
    rest_hour: Mapped["RestHour"] = relationship("RestHour", back_populates="breaks")

    # 복합 외래키(ForeignKeyConstraint) 제약조건 설정
    __table_args__ = (
        ForeignKeyConstraint(
            ["rest_id", "weekday"],                         # Break 테이블의 컬럼들
            ["rest_hours.rest_id", "rest_hours.weekday"],   # 참조할 RestHour 테이블의 컬럼들
            ondelete="CASCADE"
        ),
    )
    
