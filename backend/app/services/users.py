from fastapi import HTTPException, status
from sqlalchemy import select, exists
from sqlalchemy.orm import Session

from app.models.users import User
from app.schemas.users import UserCreate, UserUpdate
from app.core.security import get_password_hash


# 회원 생성 로직
def create(user_info: UserCreate, db: Session) -> User:

    # 중복 아이디 검사
    check_id(user_info.user_id, db)

    # 입력 받은 정보로 객체 생성
    new_user = User(**user_info.model_dump())

    # 비밀번호 해시
    new_user.password = get_password_hash(user_info.password)

    # DB에 추가
    db.add(new_user)
    db.commit()             # DB에 반영

    return new_user

# 전체 유저 조회 로직
def get_all(db: Session) -> dict:

    # DB에서 전체 조회
    total_count = db.query(User).count()    # 전체 유저 수
    users = db.query(User).all()            # 유저 리스트

    return {
        "total_count": total_count,
        "users": users
    }

# 개인 유저 조회 로직
def get_one(user_db_id: int, db: Session) -> User:

    # DB에서 유저 조회
    user = db.query(User).filter(User.id == user_db_id).first()
    # 유저 존재하지 않을 시 에러
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="존재하지 않는 유저입니다.")
    
    return user
    
# 유저 정보 수정 로직
def modify(user_info: UserUpdate, current_user: User, db: Session) -> User:

    # 요청에 포함된 필드만 추출
    update_dict = user_info.model_dump(exclude_unset=True)

    # 변경된 필드만 업데이트
    for key, value in update_dict.items():
        if key == "password":
            # 비밀번호 해시
            password = get_password_hash(value)
            setattr(current_user, key, password)     # 속성의 값을 변경
            continue

        setattr(current_user, key, value)     # 속성의 값을 변경
    


    db.commit()                 # DB에 반영
    db.refresh(current_user)    # 파이썬 객체에 동기화

    return current_user

# 유저 삭제 로직
def delete(current_user: User, db: Session) -> bool:

    # DB에서 삭제
    db.delete(current_user)
    db.commit()

    return True

# 아이디 중복 검사 로직
def check_id(user_id: str, db: Session) -> bool:

    # 유저 아이디로 DB에서 찾아봄
    stmt = select(exists())\
            .select_from(User)\
            .where(User.user_id == user_id)
    is_exists = db.scalar(stmt)

    # 존재한다면 중복 아이디므로 에러
    if is_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail="중복 아이디입니다.")
    # 존재하지 않다면 True 반환
    else:
        return True

# 유저 프로필 조회 로직
def profile(current_user: User, db: Session) -> User:

    # DB에서 유저 조회
    user = db.query(User).filter(User.id == current_user.id).first()
    # 유저 존재하지 않을 시 에러
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="존재하지 않는 유저입니다.")

    return current_user
    

# # 회원 덮어쓰기 로직
# def replace(UserId: int, User_info: UserReplace, db: Session) -> User:
    
#     # 회원 조회
#     User = db.query(User).filter(User.id == UserId).first()

#     if not User:
#         # 회원이 없을 시 생성
#         new_User = User(id = UserId, **User_info.model_dump())
#         db.add(new_User)  # DB에 추가
#         User = new_User
#     else:
#         # 회원 존재 시 업데이트

#         #
#         # 요청한 회원이 본인인지 확인하는 코드 필요!!!!
#         #

#         for key, value in User_info.model_dump().items():
#             setattr(User, key, value)     # 이미 존재하는 속성의 값을 변경하거나, 없는 속성을 새로 만들어 값을 할당

#     db.commit()     # DB에 반영
#     db.refresh(User)  # DB에 올린 값 반대로 다시 반영

#     return User

