import pytest

from app.models.rests import Rest
from app.models.rest_hours import RestHour


# ============ 성공 코드 ============
# 식당 검색
@pytest.mark.skip(reason="검증 완료")
def test_search_rest_success(client, db):

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

    rest_hour_list = [RestHour(rest_id=1, weekday= "MON",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "TUE",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "WED",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "THU",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "FRI",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "SAT",
                              is_closed= True),
                    RestHour(rest_id=1, weekday= "SUN",
                              is_closed= True)]
    db.add_all(rest_hour_list)
    db.commit()

    params = {"name": "에이셉피자"}


    # WHEN
    response = client.get(f"/api/v1/rests/search", params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200
    assert response.json()["total_count"] == 2

# 식당 검색 - 식당 카테고리
@pytest.mark.skip(reason="검증 완료")
def test_search_rest_restaurant(client, db):

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

    rest_hour_list = [RestHour(rest_id=1, weekday= "MON",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "TUE",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "WED",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "THU",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "FRI",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "SAT",
                              is_closed= True),
                    RestHour(rest_id=1, weekday= "SUN",
                              is_closed= True)]
    db.add_all(rest_hour_list)
    db.commit()

    params = {"name": "식당"}


    # WHEN
    response = client.get(f"/api/v1/rests/search", params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200
    assert response.json()["total_count"] == 3

# 식당 검색 - 카페 카테고리
@pytest.mark.skip(reason="검증 완료")
def test_search_rest_cafe(client, db):

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

    params = {"name": "카페"}


    # WHEN
    response = client.get(f"/api/v1/rests/search", params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200
    assert response.json()["total_count"] == 1


