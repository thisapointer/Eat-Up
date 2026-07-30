from sqlalchemy import Integer, String, DateTime, Table, Column, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database.base import Base


# 찜하기 유저-식당 단순 연결용 테이블
fav_association = Table(
    "fav",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("rest_id", Integer, ForeignKey("rests.id", ondelete="CASCADE"), primary_key=True)
)

# 유저 ORM 모델
class User(Base):
    __tablename__ = "users"   # 연결 테이블 이름: users
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)  # DB 식별자
    created: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())   # 생성 시간
    updated: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())  # 수정 시간

    user_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)   # 회원 아이디
    password: Mapped[str] = mapped_column(String(255), nullable=False)      # 비밀번호
    nickname: Mapped[str] = mapped_column(String(100), nullable=False)      # 별명
    profile_img: Mapped[str | None] = mapped_column(String(100))   # 프로필 사진 경로
    spoon_xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)     # 수저 경험치
    
    provider: Mapped[str] = mapped_column(String(10), default="local", nullable=False)   # 로그인 방식

    # 찜한 식당들
    fav_rests: Mapped[list["Rest"]] = relationship("Rest", secondary="fav")

    # 인증 기록들
    certs: Mapped[list["Cert"]] = relationship("Cert", back_populates="user", cascade="all, delete-orphan")
