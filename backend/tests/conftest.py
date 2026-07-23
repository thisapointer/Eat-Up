import pytest, os
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.security import create_access_token, get_password_hash
from app.database.session import get_db
from app.database.base import Base
from app.models.users import User


load_dotenv()

DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
TEST_DB_NAME = os.getenv("TEST_DB_NAME", "eat_up_test")

# 테스트 전용 mysql 데이터베이스
TEST_DB_URL = (f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}"
          f"@{DB_HOST}:{DB_PORT}"
          f"/{TEST_DB_NAME}")

# 테스트 DB 연결 통로
engine = create_engine(TEST_DB_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)      # 통로 통하는 장부

# 테스트 때 DB 테이블을 만들고, 끝나면 모두 삭제
@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

# FastAPI 의존성 주입(get_db)을 테스트용 DB 세션으로 교체(Override)
@pytest.fixture(scope="function")
def client(db):
    def _override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = _override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

# 테스트용 유저 DB 생성, 객체 반환
@pytest.fixture
def test_user(db):

    # 테스트 유저 생성
    user = User(user_id="testuser", password=get_password_hash("asdf"), nickname="테스터")
    db.add(user)
    db.commit()
    db.refresh(user) # 생성된 user.id 확인
    return user

# 테스트용 유저를 DB에 만들고, 유효한 JWT 인증 헤더를 반환하는 픽스처
@pytest.fixture
def auth_headers(test_user):

    # 유효한 토큰 발행
    access_token = create_access_token(data={"sub": str(test_user.id)})
    
    # HTTP Header 형태 딕셔너리 리턴
    return {"Authorization": f"Bearer {access_token}"}