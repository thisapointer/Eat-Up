from fastapi import HTTPException
from sqlalchemy.orm import Session, selectinload

from app.models.rests import Rest
from app.models.menus import Menu
from app.schemas.menus import MenuCreate, MenuUpdate


# 메뉴 생성 로직
def create(menu_info: MenuCreate, rest_id: int, db: Session) -> Menu:

    # DB에서 식당 조회
    rest = db.query(Rest)\
            .options(selectinload(Rest.menus))\
            .filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")
    
    # 입력 받은 정보로 객체 생성
    new_menu = Menu(**menu_info.model_dump(), rest_id=rest_id)
    rest.menus.append(new_menu)

    db.commit()             # DB에 반영

    return new_menu

# 메뉴 조회 로직
def get_all(rest_id: int, db: Session) -> dict:

    # DB에서 식당 조회
    rest = db.query(Rest)\
            .options(selectinload(Rest.menus))\
            .filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")

    return {
        "total_count": len(rest.menus),
        "menus": rest.menus
    }

# 메뉴 수정 로직
def modify(menu_id: int, menu_info: MenuUpdate, 
           rest_id: int, db: Session) -> Menu:
    
    # DB에서 메뉴 조회
    menu = db.query(Menu)\
            .filter(Menu.rest_id == rest_id)\
            .filter(Menu.id == menu_id).first()
    # 메뉴 존재하지 않을 시 에러
    if not menu:
        raise HTTPException(status_code=404, detail="Rest or Menu not found")
    
    # 요청에 포함된 필드만 추출
    update_dict = menu_info.model_dump(exclude_unset=True)

    # 변경된 필드만 업데이트
    for key, value in update_dict.items():
        setattr(menu, key, value)     # 이미 존재하는 속성의 값을 변경하거나, 없는 속성을 새로 만들어 값을 할당

    db.commit()         # DB에 반영

    return menu

# 메뉴 삭제 로직
def delete(menu_id: int, rest_id: int, db: Session) -> bool:

    # 메뉴 삭제
    db.query(Menu)\
        .filter(Menu.rest_id == rest_id)\
        .filter(Menu.id == menu_id).delete()  
    db.commit()

    return True