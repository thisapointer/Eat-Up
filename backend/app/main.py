from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.connection import engine
from app.routers import auth
from app.routers.v1 import router as v1_router


# 이 파일은 Eat-Up\backend에서 실행해야 함
# 명령어: poetry run uvicorn app.main:app --reload


# model 폴더 안에 정의된 모든 클래스들을 바탕으로
# sql에 테이블을 자동 생성함
Base.metadata.create_all(bind=engine)

# FastAPI 객체
app = FastAPI(
    title="EatUp API Server",
    version="0.0.1",
    docs_url="/docs"
)

# app 객체에 모든 도메인의 라우터 포함
app.include_router(auth.router)
app.include_router(v1_router.router)


# 허용할 프론트엔드 주소 목록 작성
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

# CORS(Cross-Origin Resource Sharing) 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 주소 목록
    allow_credentials=True, # 쿠키, 인증 토큰 등을 주고받을 수 있게 허용
    allow_methods=["*"],    # 모든 HTTP 메소드 허용
    allow_headers=["*"]     # 프론트엔드에서 보내는 모든 헤더 허용
)

# # 연결 테스트용
# @app.get("/")
# def read_root():
#     return {"message": "CORS 설정 완료!"}

# main파일 실행용 uvicorn 포함 실행 코드
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
