import pytest
from sqlalchemy.orm import selectinload

from app.models.rests import Rest
from app.models.menus import Menu
from app.models.cert import Cert
from app.models.menu_certs import MenuCert


# ============ 성공 코드 ============
# 인증 생성 성공 코드
@pytest.mark.skip(reason="검증 완료")
def test_create_cert_success(client, auth_headers, test_user, db):

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

    menu_list = [
        Menu(rest_id=1, name="ASAP PIZZA S/L", price=23900, img=""),
        Menu(rest_id=1, name="Korean flavor S/L", price=25900, img=""),
        Menu(rest_id=1, name="Pepperoni S/L", price=24900, img="")
    ]
    db.add_all(menu_list)
    db.commit()


    # WHEN
    params = {"rest_id": 1}
    request_body = {
        "menu_ids": [1, 2],
        "created": "2026-07-28"
    }
    response = client.post(f"/api/v1/cert", headers=auth_headers, params=params, json=request_body)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 201

    cert_query = db.query(Cert)\
                    .options(selectinload(Cert.menu_certs).selectinload(MenuCert.menu))\
                    .filter(Cert.user_id == test_user.id,
                            Cert.id == 1).first()
    assert len(cert_query.menus) == 2
    assert test_user.spoon_xp == 1700


# ============ 실패 코드 ============
# 토큰 없이 인증 생성
@pytest.mark.skip(reason="검증 완료")
def test_create_cert_without_token(client, db):

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

    menu_list = [
        Menu(rest_id=1, name="ASAP PIZZA S/L", price=23900, img=""),
        Menu(rest_id=1, name="Korean flavor S/L", price=25900, img=""),
        Menu(rest_id=1, name="Pepperoni S/L", price=24900, img="")
    ]
    db.add_all(menu_list)
    db.commit()


    # WHEN
    params = {"rest_id": 1}
    request_body = {
        "menu_ids": [1, 2],
        "created": "2026-07-28"
    }
    response = client.post(f"/api/v1/cert", params=params, json=request_body)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 401

# 없는 식당 id로 인증
@pytest.mark.skip(reason="검증 완료")
def test_create_cert_with_wrong_rest_id(client, auth_headers, db):

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

    menu_list = [
        Menu(rest_id=1, name="ASAP PIZZA S/L", price=23900, img=""),
        Menu(rest_id=1, name="Korean flavor S/L", price=25900, img=""),
        Menu(rest_id=1, name="Pepperoni S/L", price=24900, img="")
    ]
    db.add_all(menu_list)
    db.commit()


    # WHEN
    params = {"rest_id": 10}
    request_body = {
        "menu_ids": [1, 2],
        "created": "2026-07-28"
    }
    response = client.post(f"/api/v1/cert", headers=auth_headers, params=params, json=request_body)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 404

