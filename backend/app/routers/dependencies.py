from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt

from app.database.session import get_db
from app.models.users import User
from app.core.config import settings


# 요청 헤더의 Authorization: Bearer 부분
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# 현재 이용자를 반환하는 의존성 주입용 함수
def get_current_user(
        token: str = Depends(oauth2_scheme), 
        db: Session = Depends(get_db)) -> User:
    
    # 함수 내 반환용 에러 정의
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="인증 정보가 유효하지 않습니다.",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        # 토큰 해독하여 찾은 원문
        payload = jwt.decode(token, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")    # 원문에서의 id 부분

        # id 없을 시 에러
        if user_id is None:
            raise credentials_exception
        
    # JWT 관련 에러 발생 시
    except jwt.PyJWTError:
        raise credentials_exception
    
    # DB에서 해당 회원 조회
    user = db.query(User).filter(User.id == int(user_id)).first()
    # 없을 시 에러
    if user is None:
        raise credentials_exception
    
    return user
