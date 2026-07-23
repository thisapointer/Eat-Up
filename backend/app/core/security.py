from datetime import datetime, timedelta, timezone
import jwt
import bcrypt

from app.core.config import settings


# 비밀번호 암호화
def get_password_hash(password: str) -> str:

    password_bytes = password.encode("utf-8")   # 비밀번호 바이트로 변환
    salt = bcrypt.gensalt()     # 솔트 생성
    hashed = bcrypt.hashpw(password_bytes, salt)    # 비밀번호 암호화

    # DB 저장용 문자열로 변환해서 반환
    return hashed.decode("utf-8")

# 비밀번호 검증
def verify_password(plain_password: str, hashed_password: str) -> bool:
    
    password_bytes = plain_password.encode("utf-8")     # 원문 바이트로 변환
    hashed_bytes = hashed_password.encode("utf-8")      # 암호문 바이트로 변환

    # 검증 여부 반환
    return bcrypt.checkpw(password_bytes, hashed_bytes)

# JWT 토큰 발행
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:

    # 기한 미경과 시
    if expires_delta:
        # 만료 기한 유지
        expire = datetime.now(timezone.utc) + expires_delta
    # 기한 만료 시
    else:
        # 만료 기한 갱신
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    # 데이터 복제
    to_encode = data.copy()
    # 토큰 만료 시간 추가
    to_encode.update({"exp": expire})

    # 비밀키로 암호화해서 문자열로 토큰 반환
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
    