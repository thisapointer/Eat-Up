from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


# SQL - mysql
# 이용 라이브러리 - pymysql
# 정보를 포함한 데이터베이스 URL
DB_URL = (f"mysql+pymysql://{settings.DB_USERNAME}:{settings.DB_PASSWORD}"
          f"@{settings.DB_HOST}:{settings.DB_PORT}"
          f"/{settings.DB_NAME}")

# DB와 물리적으로 연결되는 원천 통로
engine = create_engine(
    DB_URL,                 # 경로 문자열
    pool_recycle=3600       # 커넥션 유지 시간 = 1시간 (MySQL 타임아웃 방지)

    #echo=True,             # 실행되는 SQL을 터미널에 출력 (디버깅용)
)

# engine을 통해 오고 갈 장부를 생성
SessionLocal = sessionmaker(
    autocommit=False,   # 데이터 변경마다 자동 반영 금지
    autoflush=False,    # 일정 시간마다 자동 반영 금지
    bind=engine         # 이용할 통로
)

