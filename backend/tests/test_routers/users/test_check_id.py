import pytest

from app.models.users import User


# 아이디 중복 케이스 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_check_id_hit(client, db):

    # GIVEN
    user = User(user_id="reptilian", 
            password="asdf", 
            nickname="렙틸리언")
    db.add(user)
    db.commit()

    params = {"user_id": "reptilian"}


    # WHEN
    response = client.get(f"/api/v1/users/check", params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 409


# 아이디 미중복 케이스 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_check_id_miss(client, db):

    # GIVEN
    user = User(user_id="reptilian", 
            password="asdf", 
            nickname="렙틸리언")
    db.add(user)
    db.commit()


    # WHEN
    response = client.get(f"/api/v1/users/check", params={"user_id": "iconic"})


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200
