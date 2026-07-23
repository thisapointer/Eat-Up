import pytest

from app.models.rests import Rest


# ============= 성공 코드 ===============
# 식당 등록 성공 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_create_rest_success(client, db):

    # GIVEN
    request_data = {
        "name": "에이셉피자 홍대점", 
        "category": "Restaurant", 
        "addr": {
            "addr_name": "서울시 마포구 서교동",
            "x": 0.215,
            "y": 4.1598
        }
    }


    # WHEN
    response = client.post(f"/api/v1/rests", json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 201
    assert response.json()["id"] == 1

    created_rest = db.query(Rest).filter(Rest.id == response.json()["id"]).first()
    assert created_rest is not None

# ============= 실패 코드 ===============
# 필수 값 누락
@pytest.mark.skip(reason="검증 완료")
def test_create_rest_without_field(client):

    # GIVEN
    request_data = {
        "name": "에이셉피자 홍대점", 
        "category": "Restaurant"
    }


    # WHEN
    response = client.post(f"/api/v1/rests", json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 422

# 식당 이름 중복 등록
@pytest.mark.skip(reason="검증 완료")
def test_create_rest_existing_name(client, db):

    # GIVEN
    rest = Rest(name="에이셉피자 홍대점", category="Restaurant", addr="서울 마포구 서교동 403-14")
    db.add(rest)
    db.commit()

    request_data = {
        "name": "에이셉피자 홍대점", 
        "category": "Cafe", 
        "addr": {
            "addr_name": "서울시 마포구 서교동",
            "x": 0.215,
            "y": 4.1598
        }
    }


    # WHEN
    response = client.post(f"/api/v1/rests", json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 409
    assert response.json()["detail"] == "식당 이름이 이미 존재합니다."

    rest_check = db.query(Rest).filter(Rest.name == rest.name).count()
    assert rest_check == 1





