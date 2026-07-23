import pytest

from app.models.users import User


# ============= 성공 코드 ============
# 회원탈퇴 성공 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_delete_user_success(client, auth_headers, test_user, db):

    # GIVEN
    test_user_id = test_user.id


    # WHEN
    response = client.delete(f"/api/v1/users/me", headers=auth_headers)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    user = db.query(User).filter(User.id == test_user_id).first()

    assert user is None

# ============= 실패 코드 ============
# 토큰 없이 회원탈퇴 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_delete_user_without_token(client, test_user, db):

    # GIVEN
    test_user_id = test_user.id


    # WHEN
    response = client.delete(f"/api/v1/users/me")


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

    user = db.query(User).filter(User.id == test_user_id).first()

    assert user is not None

# 유효하지 않은 토큰 회원탈퇴 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_delete_user_with_wrong_token(client, test_user, db):

    # GIVEN
    test_user_id = test_user.id
    headers = {"Authorization": "Bearer invalid_secret_token_xyz"}


    # WHEN
    response = client.delete(f"/api/v1/users/me", headers=headers)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 401
    assert response.json()["detail"] == "인증 정보가 유효하지 않습니다."

    user = db.query(User).filter(User.id == test_user_id).first()

    assert user is not None


