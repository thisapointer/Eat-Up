import pytest

from app.models.users import fav_association
from app.models.rests import Rest


# ============= 성공 코드 ============
# 찜하기 성공 코드
@pytest.mark.skip(reason="검증 완료")
def test_fav_success(client, auth_headers, test_user, db):

    # GIVEN
    rest_list = [Rest(name="에이셉피자 홍대점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 마포구 서교동 403-14", "x": 0.215, "y": 4.1598}),
                Rest(name="에이셉피자 성수점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 성동구 성수동1가 22-5", "x": 0.215, "y": 4.1598}),
                Rest(name="피자스쿨 상수역점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 마포구 상수동 330-1", "x": 0.215, "y": 4.1598}),
                Rest(name="데코아발림본점", 
                      category="Cafe", 
                      addr={"addr_name": "서울 마포구 상수동 311-4", "x": 0.215, "y": 4.1598})]
    db.add_all(rest_list)
    db.commit()


    # WHEN
    params = {"rest_id": 1}
    response = client.post(f"/api/v1/fav", headers=auth_headers, params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 201

    fav = db.query(fav_association)\
            .filter(fav_association.c.user_id == test_user.id,
                    fav_association.c.rest_id == 1).all()
    assert len(fav) == 1

# 찜하기 삭제 코드
@pytest.mark.skip(reason="검증 완료")
def test_fav_delete(client, auth_headers, test_user, db):

    # GIVEN
    rest_list = [Rest(name="에이셉피자 홍대점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 마포구 서교동 403-14", "x": 0.215, "y": 4.1598}),
                Rest(name="에이셉피자 성수점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 성동구 성수동1가 22-5", "x": 0.215, "y": 4.1598}),
                Rest(name="피자스쿨 상수역점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 마포구 상수동 330-1", "x": 0.215, "y": 4.1598}),
                Rest(name="데코아발림본점", 
                      category="Cafe", 
                      addr={"addr_name": "서울 마포구 상수동 311-4", "x": 0.215, "y": 4.1598})]
    db.add_all(rest_list)
    db.commit()

    # 테이블 삽입 쿼리
    query = fav_association.insert().values(
        user_id=test_user.id,
        rest_id=1
    )

    # 쿼리 실행
    db.execute(query)
    db.commit()


    # WHEN
    params = {"rest_id": 1}
    response = client.delete(f"/api/v1/fav", headers=auth_headers, params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    fav = db.query(fav_association)\
            .filter(fav_association.c.user_id == test_user.id,
                    fav_association.c.rest_id == 1).all()
    assert len(fav) == 0


# ============= 실패 코드 ============
# 토큰 없이 찜하기
@pytest.mark.skip(reason="검증 완료")
def test_fav_without_token(client, db):

    # GIVEN
    rest_list = [Rest(name="에이셉피자 홍대점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 마포구 서교동 403-14", "x": 0.215, "y": 4.1598}),
                Rest(name="에이셉피자 성수점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 성동구 성수동1가 22-5", "x": 0.215, "y": 4.1598}),
                Rest(name="피자스쿨 상수역점", 
                      category="Restaurant", 
                      addr={"addr_name": "서울 마포구 상수동 330-1", "x": 0.215, "y": 4.1598}),
                Rest(name="데코아발림본점", 
                      category="Cafe", 
                      addr={"addr_name": "서울 마포구 상수동 311-4", "x": 0.215, "y": 4.1598})]
    db.add_all(rest_list)
    db.commit()


    # WHEN
    params = {"rest_id": 1}
    response = client.post(f"/api/v1/fav", params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 401

