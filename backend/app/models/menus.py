from sqlalchemy import Integer, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database.base import Base


# 메뉴 ORM 모델
class Menu(Base):
    __tablename__ = "menus"   # 연결 테이블 이름: menus
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)  # DB 식별자
    created: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())   # 생성 시간
    updated: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())  # 수정 시간

    name: Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False)    # 이름
    price: Mapped[int] = mapped_column(INTEGER(unsigned=True), nullable=False)          # 가격
    img: Mapped[str] = mapped_column(String(100))       # 사진 경로

    # 식당 id (외래키)
    rest_id: Mapped[int] = mapped_column(Integer, ForeignKey("rests.id", ondelete="CASCADE"), nullable=False)
    # 식당 역참조 설정
    rest: Mapped["Rest"] = relationship("Rest", back_populates="menus")


    # 메뉴-인증 관계
    menu_certs: Mapped[list["MenuCert"]] = relationship(
        "MenuCert",
        back_populates="menu",
        cascade="all, delete-orphan"
    )

    
