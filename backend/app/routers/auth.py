from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.models.users import User
from app.database.session import get_db
from app.core.security import verify_password, create_access_token


router = APIRouter(prefix="/auth", tags=["유저 인증 관련"])

# POST - 로그인
# Request Body: username, password
# Response Body: access_token, token_type
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),   # FastAPI가 제공하는 폼 규격(username, password 포함)
    db: Session = Depends(get_db)):
    
    # DB에서 유저 조회
    user = db.query(User).filter(User.user_id == form_data.username).first()

    # 유저가 없거나 비밀번호가 틀렸을 시
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 올바르지 않습니다."
        )
    
    # 유저 id를 페이로드에 담아 JWT 발행
    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }