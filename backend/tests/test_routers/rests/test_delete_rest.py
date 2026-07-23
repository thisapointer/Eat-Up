import pytest

from app.models.rests import Rest


# ============= 성공 코드 ===============
# 식당 삭제 성공 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_delete_rest_success(client, db):

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
    response = client.delete(f"/api/v1/rests/2")


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    deleted_rest = db.query(Rest).filter(Rest.id == 2).first()

    assert deleted_rest is None





