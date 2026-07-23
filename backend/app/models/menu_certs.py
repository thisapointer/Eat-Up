from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


# 메뉴-인증 연결용 테이블
class MenuCert(Base):
    __tablename__ = "menu_certs"   # 연결 테이블 이름: menu_certs
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, autoincrement=True)  # DB 식별자

    # 인증 id
    cert_id: Mapped[int] = mapped_column(Integer, ForeignKey("certs.id", ondelete="CASCADE"), nullable=False)
    # 인증 역참조 객체
    cert: Mapped["Cert"] = relationship("Cert", back_populates="menu_certs")

    # 메뉴 id
    menu_id: Mapped[int] = mapped_column(Integer, ForeignKey("menus.id", ondelete="CASCADE"), nullable=False)
    # 메뉴 역참조 객체
    menu: Mapped["Menu"] = relationship("Menu", back_populates="menu_certs")

