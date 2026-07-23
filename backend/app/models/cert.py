from sqlalchemy import Integer, DateTime, ForeignKey, func
from sqlalchemy.ext.associationproxy import association_proxy, AssociationProxy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database.base import Base


# 인증하기 ORM 모델
class Cert(Base):
    __tablename__ = "certs"   # 연결 테이블 이름: certs
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)  # DB 식별자
    created: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())   # 생성 시간
    updated: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())  # 수정 시간


    # 유저 id
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # 유저 역참조 객체
    user: Mapped["User"] = relationship("User", back_populates="certs")


    # 메뉴-인증 관계
    menu_certs: Mapped[list["MenuCert"]] = relationship(
        "MenuCert",
        back_populates="cert",
        cascade="all, delete-orphan"
    )

    # 선택한 메뉴들 (association proxy)
    menus: AssociationProxy[list["Menu"]] = association_proxy(
        "menu_certs",   # 이 클래스의 menu_certs 속성
        "menu",         # MenuCert 클래스의 menu 속성
    )