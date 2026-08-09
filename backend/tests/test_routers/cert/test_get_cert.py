import pytest
from sqlalchemy import func
from sqlalchemy.orm import selectinload

from app.models.rests import Rest
from app.models.rest_hours import RestHour
from app.models.menus import Menu
from app.models.cert import Cert
from app.models.menu_certs import MenuCert


# ============ 성공 코드 ============
# 인증 전체 조회
@pytest.mark.skip(reason="검증 완료")
def test_get_all_cert_success(client, auth_headers, test_user, db):

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

    menu1=Menu(rest_id=1, name="ASAP PIZZA S/L", price=23900, img="")
    menu2=Menu(rest_id=1, name="Korean flavor S/L", price=25900, img="")
    menu3=Menu(rest_id=1, name="Pepperoni S/L", price=24900, img="")
    menu4=Menu(rest_id=2, name="ASAP PIZZA S/L", price=23900, img="")
    menu5=Menu(rest_id=2, name="Korean flavor S/L", price=25900, img="")
    menu6=Menu(rest_id=2, name="Pepperoni S/L", price=24900, img="")
    menu7=Menu(rest_id=3, name="ASAP PIZZA S/L", price=23900, img="")
    menu8=Menu(rest_id=3, name="Korean flavor S/L", price=25900, img="")
    menu9=Menu(rest_id=3, name="Pepperoni S/L", price=24900, img="")
    db.add_all([menu1, menu2, menu3, menu4, menu5, menu6, menu7, menu8, menu9])
    db.commit()

    cert1 = Cert(user_id=test_user.id, 
                 created="2026-07-29",
                 menus=[menu1, menu2])
    cert2 = Cert(user_id=test_user.id, 
                 created="2026-07-30",
                 menus=[menu1, menu3])
    cert3 = Cert(user_id=test_user.id, 
                     created="2026-07-30",
                     menus=[menu4])
    cert4 = Cert(user_id=test_user.id, 
                     created="2026-07-30",
                     menus=[menu7, menu8, menu9])
    db.add_all([cert1, cert2, cert3, cert4])
    db.commit()


    # WHEN
    params = {"rest_id": 1}
    response = client.get(f"/api/v1/cert", headers=auth_headers, params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    cert_query = db.query(Cert).filter(Cert.user_id == test_user.id).all()
    assert len(cert_query) == 4
    assert cert_query[0].visit_count == 2

# 식당인증 조회
@pytest.mark.skip(reason="검증 완료")
def test_get_cert_success(client, auth_headers, test_user, db):

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

    menu1=Menu(rest_id=1, name="ASAP PIZZA S/L", price=23900, img="")
    menu2=Menu(rest_id=1, name="Korean flavor S/L", price=25900, img="")
    menu3=Menu(rest_id=1, name="Pepperoni S/L", price=24900, img="")
    db.add_all([menu1, menu2, menu3])
    db.commit()

    cert1 = Cert(user_id=test_user.id, 
                 created="2026-07-29",
                 menus=[menu1, menu2])
    cert2 = Cert(user_id=test_user.id, 
                 created="2026-07-30",
                 menus=[menu1, menu3])
    db.add_all([cert1, cert2])
    db.commit()


    # WHEN
    params = {"rest_id": 1}
    response = client.get(f"/api/v1/cert/1", headers=auth_headers, params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    cert_query = db.query(Cert)\
                    .options(selectinload(Cert.menu_certs).selectinload(MenuCert.menu))\
                    .filter(Cert.user_id == test_user.id,
                            Cert.id == 1).first()
    assert len(cert_query.menus) == 2

# 인증한 식당 개수 조회
@pytest.mark.skip(reason="검증 완료")
def test_get_rest_count_success(client, auth_headers, test_user, db):

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

    menu1=Menu(rest_id=1, name="ASAP PIZZA S/L", price=23900, img="")
    menu2=Menu(rest_id=1, name="Korean flavor S/L", price=25900, img="")
    menu3=Menu(rest_id=1, name="Pepperoni S/L", price=24900, img="")
    menu4=Menu(rest_id=2, name="ASAP PIZZA S/L", price=23900, img="")
    menu5=Menu(rest_id=2, name="Korean flavor S/L", price=25900, img="")
    menu6=Menu(rest_id=2, name="Pepperoni S/L", price=24900, img="")
    menu7=Menu(rest_id=3, name="ASAP PIZZA S/L", price=23900, img="")
    menu8=Menu(rest_id=3, name="Korean flavor S/L", price=25900, img="")
    menu9=Menu(rest_id=3, name="Pepperoni S/L", price=24900, img="")
    db.add_all([menu1, menu2, menu3, menu4, menu5, menu6, menu7, menu8, menu9])
    db.commit()

    cert1 = Cert(user_id=test_user.id, 
                 created="2026-07-29",
                 menus=[menu1, menu2])
    cert2 = Cert(user_id=test_user.id, 
                 created="2026-07-30",
                 menus=[menu1, menu3])
    cert3 = Cert(user_id=test_user.id, 
                     created="2026-07-30",
                     menus=[menu4])
    cert4 = Cert(user_id=test_user.id, 
                     created="2026-07-30",
                     menus=[menu7, menu8, menu9])
    db.add_all([cert1, cert2, cert3, cert4])
    db.commit()


    # WHEN
    response = client.get(f"/api/v1/cert/count", headers=auth_headers)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    # 인증 식당 개수
    count = db.query(func.count(func.distinct(Menu.rest_id)))\
                .select_from(Cert)\
                .join(Cert.menu_certs)\
                .join(MenuCert.menu)\
                .filter(Cert.user_id == test_user.id)\
                .scalar()
    assert count == 3

# 인증 식당별 횟수 조회
@pytest.mark.skip(reason="검증 완료")
def test_get_all_rest_count_success(client, auth_headers, test_user, db):

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

    menu1=Menu(rest_id=1, name="ASAP PIZZA S/L", price=23900, img="")
    menu2=Menu(rest_id=1, name="Korean flavor S/L", price=25900, img="")
    menu3=Menu(rest_id=1, name="Pepperoni S/L", price=24900, img="")
    menu4=Menu(rest_id=2, name="ASAP PIZZA S/L", price=23900, img="")
    menu5=Menu(rest_id=2, name="Korean flavor S/L", price=25900, img="")
    menu6=Menu(rest_id=2, name="Pepperoni S/L", price=24900, img="")
    menu7=Menu(rest_id=3, name="ASAP PIZZA S/L", price=23900, img="")
    menu8=Menu(rest_id=3, name="Korean flavor S/L", price=25900, img="")
    menu9=Menu(rest_id=3, name="Pepperoni S/L", price=24900, img="")
    db.add_all([menu1, menu2, menu3, menu4, menu5, menu6, menu7, menu8, menu9])
    db.commit()

    cert1 = Cert(user_id=test_user.id, 
                 created="2026-07-29",
                 menus=[menu1, menu2])
    cert2 = Cert(user_id=test_user.id, 
                 created="2026-07-30",
                 menus=[menu1, menu3])
    cert3 = Cert(user_id=test_user.id, 
                     created="2026-07-30",
                     menus=[menu4])
    cert4 = Cert(user_id=test_user.id, 
                     created="2026-07-30",
                     menus=[menu7, menu8, menu9])
    db.add_all([cert1, cert2, cert3, cert4])
    db.commit()

    
    # WHEN
    response = client.get(f"/api/v1/cert/all", headers=auth_headers)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    # 인증 식당 개수
    results = db.query(Rest, func.count(func.distinct(Cert.id)).label("visit_count"))\
                .join(Menu, Menu.rest_id == Rest.id)\
                .join(MenuCert, MenuCert.menu_id == Menu.id)\
                .join(Cert, Cert.id == MenuCert.cert_id)\
                .options(selectinload(Rest.rest_hours))\
                .filter(Cert.user_id == test_user.id)\
                .group_by(Rest)\
                .all()
    assert len(results) == 3
    assert results[0].visit_count == 2


