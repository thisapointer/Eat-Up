from app.database.connection import SessionLocal


# 의존성 주입용 함수
def get_db():

    # 파이썬-DB 연결 통로(세션)
    db = SessionLocal()

    try:
        # 생성한 세션을 요청한 계층에 잠시 빌려줌
        yield db
    finally:
        # api 요청 처리가 끝나면 세션 닫기
        db.close()