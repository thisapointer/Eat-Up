import pytest

from app.models.users import User


# ============= 성공 코드 ===============
# 회원가입 성공 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_create_user_success(client, db):

    # GIVEN
    request_data = {
        "user_id": "reptilian", 
        "password": "asdf", 
        "nickname": "렙틸리언"
    }


    # WHEN
    response = client.post(f"/api/v1/users", json=request_data)


    # THEN
    assert response.status_code == 201
    assert response.json()["id"] == 1

    created_user = db.query(User).filter(User.id == response.json()["id"]).first()
    assert created_user is not None

# ==========회원가입 실패 테스트 코드============

# 필수 값 누락
@pytest.mark.skip(reason="검증 완료")
def test_create_user_without_field(client):

    # GIVEN
    # password가 누락된 데이터
    request_data = {
        "user_id": "reptilian",
        "nickname": "렙틸리언"
    }


    # WHEN
    response = client.post(f"/api/v1/users", json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 422

# 유저 아이디 중복
@pytest.mark.skip(reason="검증 완료")
def test_create_user_existing_user_id(client, db):

    # GIVEN
    user = User(user_id="reptilian", 
            password="asdf", 
            nickname="렙틸리언")
    db.add(user)
    db.commit()
    
    # user_id 겹침
    request_data = {
        "user_id": "reptilian",
        "password": "asdf",
        "nickname": "렙틸리언"
    }


    # WHEN
    response = client.post(f"/api/v1/users", json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code != 201



    