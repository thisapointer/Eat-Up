import pytest

from app.models.rests import Rest
from app.models.menus import Menu


# ============ 성공 코드 ============
# 메뉴 삭제 성공 코드
@pytest.mark.skip(reason="검증 완료")
def test_delete_menu_success(client, db):

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
    response = client.delete(f"/api/v1/menus/1", params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    menu_list = db.query(Menu).filter(Menu.rest_id == 1).all()
    assert len(menu_list) == 2



