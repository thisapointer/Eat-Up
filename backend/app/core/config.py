from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


# config.py(현재) -> core -> app -> backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE_PATH = BASE_DIR / ".env"   # .env(환경 변수 파일)의 절대 경로

# 환경 설정 클래스
class Settings(BaseSettings):

    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        extra="ignore"  # .env에 다른 변수가 있어도 에러 내지 않고 무시
    )

settings = Settings() # type: ignore