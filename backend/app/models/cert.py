from sqlalchemy import Integer, DateTime, ForeignKey, func
from sqlalchemy.ext.associationproxy import association_proxy, AssociationProxy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database.base import Base
from app.models.menu_certs import MenuCert

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
        creator=lambda m: MenuCert(menu=m)
    )

    # 식당 정보
    @property
    def rest_info(self):
        if self.menus and len(self.menus) > 0:
            return self.menus[0].rest
        return None

    # 식당 방문 횟수
    @property
    def visit_count(self) -> int:
        # 관계가 설정되어 있다면 파이썬 객체 수준에서 계산 가능
        if hasattr(self, "user") and self.user and self.rest_info:
            return sum(1 for c in self.user.certs if c.rest_info and c.rest_info.id == self.rest_info.id)
        return 1

    # 메뉴 id 리스트
    @property
    def menu_ids(self) -> list[int]:
        # association_proxy인 self.menus 또는 self.menu_certs 이용
        if hasattr(self, "menus") and self.menus:
            return [m.id for m in self.menus]
        return []