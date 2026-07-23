from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.users import User, fav_association
from app.models.rests import Rest


# 찜하기 생성 로직
def create(rest_id: int, current_user: User,  db: Session) -> bool:

    # DB에서 식당 조회
    rest = db.query(Rest).filter(Rest.id == rest_id).first()
    # 식당 존재하지 않을 시 에러
    if not rest:
        raise HTTPException(status_code=404, detail="Rest not found")
    
    # 테이블 삽입 쿼리
    query = fav_association.insert().values(
        user_id=current_user.id,
        rest_id=rest_id
    )

    # 쿼리 실행
    db.execute(query)
    db.commit()

    return True

# 찜하기 삭제 로직
def delete(rest_id: int, current_user: User, db: Session) -> bool:

    # 삭제 쿼리
    query = fav_association.delete().where(
        fav_association.c.user_id==current_user.id,
        fav_association.c.rest_id==rest_id
    )

    # 쿼리 실행
    db.execute(query)
    db.commit()

    return True