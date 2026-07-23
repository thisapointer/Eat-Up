from fastapi import HTTPException
from sqlalchemy import select, exists
from sqlalchemy.orm import Session, selectinload

from app.models.users import User
from app.models.rests import Rest
from app.models.menus import Menu
from app.models.cert import Cert
from app.models.menu_certs import MenuCert
from app.schemas.cert import CertBase


# 인증 생성 로직
def create(cert_info: CertBase, rest_id: int,
           current_user: User, db: Session) -> Cert:
    
    # DB에서 식당 조회
    rest = db.query(Rest)\
            .options(selectinload(Rest.menus))\
            .filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")

    # 메뉴 존재하지 않는지 검사
    menu_map = {menu.id: menu for menu in rest.menus}   # 전체 메뉴 딕셔너리
    target_menus = []                                   # 목표 메뉴 목록
    for menu_id in cert_info.menu_ids:
        if menu_id not in menu_map:
            raise HTTPException(status_code=404, detail=f"Menu {menu_id} not found")
        target_menus.append(menu_map[menu_id])
    

    # =====수저 경험치 계산=====
    exp = 0

    # 카테고리 점수
    if rest.category == "Restaurant": exp += 500
    elif rest.category == "Cafe": exp += 300
    # 메뉴 수
    exp += 100 * len(target_menus)
    # 신규 개척 보너스
    stmt = select(exists())\
            .select_from(Cert)\
            .join(Cert.menu_certs)\
            .join(MenuCert.menu)\
            .join(Menu.rest)\
            .where(Rest.id == rest_id)
    is_exists = db.scalar(stmt)
    if not is_exists: exp += 1000

    # 유저의 수저 경험치에 반영
    current_user.spoon_xp += exp


    # 인증 생성
    new_cert = Cert(user_id=current_user.id, created=cert_info.created)
    new_cert.menus = target_menus

    # DB에 추가
    db.add(new_cert)
    db.commit()

    return new_cert

# 전체 식당인증 조회 로직
def get_all(rest_id: int, current_user: User, db: Session) -> dict:

    # DB에서 전체 식당인증 조회
    certs = db.query(Cert)\
            .join(Cert.menus)\
            .options(selectinload(Cert.menu_certs).selectinload(MenuCert.menu))\
            .filter(
                Cert.user_id == current_user.id,
                Menu.rest_id == rest_id
            ).distinct().all()

    return {
        "total_count": len(certs),
        "certs": certs
    }

# 식당인증 조회 로직
def get_one(cert_id: int, rest_id: int,
            current_user: User, db: Session) -> Cert:
    
    # DB에서 식당인증 조회
    cert = db.query(Cert)\
            .join(Cert.menus)\
            .options(selectinload(Cert.menu_certs).selectinload(MenuCert.menu))\
            .filter(
                Cert.user_id == current_user.id,
                Menu.rest_id == rest_id,
                Cert.id == cert_id
            ).first()
    
    return cert

# 인증 삭제 로직
def delete(cert_id: int, current_user: User, db: Session) -> bool:
    
    # 인증 삭제
    db.query(Cert)\
        .filter(Cert.user_id == current_user.id)\
        .filter(Cert.id == cert_id).delete()
    db.commit()

    return True