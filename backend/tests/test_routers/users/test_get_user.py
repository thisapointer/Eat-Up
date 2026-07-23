import pytest

from app.models.users import User


# ============= 성공 코드 ===============
# 유저 전체 조회 성공 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_get_all_user_success(client, db):

    # GIVEN
    user_list = [User(user_id="reptilian", password="asdf", nickname="렙틸리언"),
                 User(user_id="qwe123", password="qwer", nickname="고민중독")]
    db.add_all(user_list)
    db.commit()


    # WHEN
    response = client.get(f"/api/v1/users")

    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")


    # THEN
    assert response.status_code == 200

    users = db.query(User).all()
    assert users is not None

# 유저 조회 성공 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_get_user_success(client, db):

    # GIVEN
    user = User(user_id="reptilian", password="asdf", nickname="렙틸리언")
    db.add(user)
    db.commit()


    # WHEN
    response = client.get(f"/api/v1/users/{user.id}")

    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")


    # THEN
    assert response.status_code == 200

    user_result = db.query(User).filter(User.id == user.id).first()
    assert user_result is not None


# ============= 유저 조회 실패 코드 ==============
# 존재하지 않는 유저 id 
@pytest.mark.skip(reason="검증 완료")
def test_get_user_fail(client, db):

    # GIVEN


    # WHEN
    response = client.get(f"/api/v1/users/3")

    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")


    # THEN
    assert response.status_code == 404

    user_result = db.query(User).filter(User.id == 3).first()
    assert user_result is None
