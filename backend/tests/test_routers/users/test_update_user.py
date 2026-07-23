import pytest

from app.core.security import verify_password


# ============= 성공 코드 ===============
# 유저 정보 수정 성공 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_update_user_success(client, auth_headers, test_user, db):

    # GIVEN
    request_data = {
        "password": "qwer", 
        "nickname": "고민중독"
    }


    # WHEN
    response = client.patch(f"/api/v1/users/me", headers=auth_headers, json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200
    assert response.json()["nickname"] == "고민중독"

    db.refresh(test_user)    

    assert test_user.nickname == "고민중독"
    assert verify_password("qwer", test_user.password) is True


# ============= 실패 코드 ==============
# 토큰 없는 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_update_user_without_token(client, test_user, db):

    # GIVEN
    request_data = {
        "password": "qwer", 
        "nickname": "고민중독"
    }


    # WHEN
    response = client.patch(f"/api/v1/users/me", json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

    db.refresh(test_user)

    assert test_user.nickname is not "고민중독"

# 유효하지 않은 토큰 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_update_user_with_wrong_token(client, test_user, db):

    # GIVEN
    request_data = {
        "password": "qwer", 
        "nickname": "고민중독"
    }
    headers = {"Authorization": "Bearer invalid_secret_token_xyz"}


    # WHEN
    response = client.patch(f"/api/v1/users/me", json=request_data, headers=headers)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 401
    assert response.json()["detail"] == "인증 정보가 유효하지 않습니다."

    db.refresh(test_user)

    assert test_user.nickname is not "고민중독"



