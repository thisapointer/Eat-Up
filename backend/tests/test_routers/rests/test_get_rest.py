import pytest

from app.models.users import fav_association
from app.models.rests import Rest
from app.models.menus import Menu
from app.models.cert import Cert
from app.models.rest_hours import RestHour


# ============= 성공 코드 ============
# 식당 전체 조회
@pytest.mark.skip(reason="검증 완료")
def test_get_all_rest_success(client, db):

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


    # WHEN
    response = client.get(f"/api/v1/rests")


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")
    assert response.status_code == 200

    rest_list = db.query(Rest).all()
    assert rest_list is not None

# 식당 조회
@pytest.mark.skip(reason="검증 완료")
def test_get_rest_success(client, db):

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


    # WHEN
    response = client.get(f"/api/v1/rests/1")


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    rest = db.query(Rest).filter(Rest.id == 1).first()
    assert rest.name == "에이셉피자 홍대점"

# 식당 조회 (필터링 기능)
@pytest.mark.skip(reason="검증 완료")
def test_get_all_rests_with_filter_success(client, auth_headers, test_user, db):

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
                              open_time= "11:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "TUE",
                              is_closed= False,
                              open_time= "11:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "WED",
                              is_closed= False,
                              open_time= "11:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "THU",
                              is_closed= False,
                              open_time= "11:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "FRI",
                              is_closed= False,
                              open_time= "10:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "SAT",
                              is_closed= False,
                              open_time= "11:00",
                              close_time= "20:00"),
                    RestHour(rest_id=1, weekday= "SUN",
                              is_closed= True)]
    db.add_all(rest_hour_list)
    db.commit()

    # 테이블 삽입 쿼리
    query = fav_association.insert().values(
        user_id=test_user.id,
        rest_id=1
    )

    # 쿼리 실행
    db.execute(query)
    db.commit()

    menu7=Menu(rest_id=3, name="ASAP PIZZA S/L", price=23900, img="")
    menu8=Menu(rest_id=3, name="Korean flavor S/L", price=25900, img="")
    menu9=Menu(rest_id=3, name="Pepperoni S/L", price=24900, img="")
    db.add_all([menu7, menu8, menu9])
    db.commit()

    cert4 = Cert(user_id=test_user.id, 
                    created="2026-07-30",
                    menus=[menu7, menu8, menu9])
    db.add(cert4)
    db.commit()


    params1 = {"fav": True}
    params2 = {"not_visited": True}
    params3 = {"oper": True}
    params4 = {"fav": True, "not_visited": True}


    # WHEN
    response1 = client.get(f"/api/v2/rests", headers=auth_headers)
    response2 = client.get(f"/api/v2/rests", headers=auth_headers, params=params1)
    response3 = client.get(f"/api/v2/rests", headers=auth_headers, params=params2)
    response4 = client.get(f"/api/v2/rests", headers=auth_headers, params=params3)
    response5 = client.get(f"/api/v2/rests", headers=auth_headers, params=params4)      



    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response1.status_code)
    print("Response JSON:", response1.json())
    print("=============================================\n")

    assert response1.status_code == 200


    print("\n================ [응답 결과] ================")
    print("Status Code :", response2.status_code)
    print("Response JSON:", response2.json())
    print("=============================================\n")

    assert response2.status_code == 200


    print("\n================ [응답 결과] ================")
    print("Status Code :", response3.status_code)
    print("Response JSON:", response3.json())
    print("=============================================\n")

    assert response3.status_code == 200


    print("\n================ [응답 결과] ================")
    print("Status Code :", response4.status_code)
    print("Response JSON:", response4.json())
    print("=============================================\n")

    assert response4.status_code == 200


    print("\n================ [응답 결과] ================")
    print("Status Code :", response5.status_code)
    print("Response JSON:", response5.json())
    print("=============================================\n")

    assert response5.status_code == 200

    # rest = db.query(Rest).filter(Rest.id == 1).all()
    # assert rest.name == "에이셉피자 홍대점"

# ============= 실패 코드 ============
# 존재하지 않는 식당 id
@pytest.mark.skip(reason="검증 완료")
def test_get_rest_fail(client, db):

    # GIVEN


    # WHEN
    response = client.get(f"/api/v1/rests/3")


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 404

    rest = db.query(Rest).filter(Rest.id == 3).first()
    assert rest is None


