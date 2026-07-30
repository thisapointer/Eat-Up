import pytest

from app.models.rests import Rest
from app.models.menus import Menu
from app.models.cert import Cert


# ============ 성공 코드 ============
# 인증 삭제
@pytest.mark.skip(reason="검증 완료")
def test_delete_cert_success(client, auth_headers, test_user, db):

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
    response = client.delete(f"/api/v1/cert/4", headers=auth_headers)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    count = db.query(Cert).filter(Cert.user_id == test_user.id).count()
    assert count == 3