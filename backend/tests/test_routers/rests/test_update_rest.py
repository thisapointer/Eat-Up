import pytest
from datetime import date

from app.models.rests import Rest


# ============= 성공 코드 ===============
# 식당 정보 수정 성공 테스트 코드
@pytest.mark.skip(reason="검증 완료")
def test_update_rest_success(client, db):

    # GIVEN
    rest_list = [Rest(name="에이셉피자 홍대점", category="Restaurant", addr="서울 마포구 서교동 403-14"),
                 Rest(name="에이셉피자 성수점", category="Restaurant", addr="서울 성동구 성수동1가 22-5"),
                 Rest(name="피자스쿨 상수역점", category="Restaurant", addr="서울 마포구 상수동 330-1"),
                 Rest(name="데코아발림본점", category="Cafe", addr="서울 마포구 상수동 311-4")]
    db.add_all(rest_list)
    db.commit()

    request_data = {
        "info": "ASAP PIZZA(에이셉 피자) 홍대점입니다!\n"
                "각종 스포츠경기 중계 하고있습니다~!\n"
                "\\(빨간 계단과 ,네온 조명, 포토존을 찾아오세요~\\)\n"
                "홍대,합정,상수 골목 사이를 걷다 보면 유난히 눈에 띄는 네온 간판 하나가 있습니다. ASAP PIZZA 에이셉 피자 이름처럼 빠르게 하지만 대충이 아닌 진짜 제대로 만든 피자를 즐길 수 있는 공간입니다.",
        "except_close_start": "2026-07-22",
        "except_close_end": "2026-07-23"
    }


    # WHEN
    response = client.patch(f"/api/v1/rests/1", json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200
    assert response.json()["except_close_start"] == "2026-07-22"

    test_rest = db.query(Rest).filter(Rest.id == 1).first()

    assert test_rest.except_close_start == date(2026, 7, 22)


# ============= 실패 코드 ==============
# 잘못된 카테고리
@pytest.mark.skip(reason="검증 완료")
def test_update_rest_wrong_category(client, db):

    # GIVEN
    rest_list = [Rest(name="에이셉피자 홍대점", category="Restaurant", addr="서울 마포구 서교동 403-14"),
                 Rest(name="에이셉피자 성수점", category="Restaurant", addr="서울 성동구 성수동1가 22-5"),
                 Rest(name="피자스쿨 상수역점", category="Restaurant", addr="서울 마포구 상수동 330-1"),
                 Rest(name="데코아발림본점", category="Cafe", addr="서울 마포구 상수동 311-4")]
    db.add_all(rest_list)
    db.commit()

    request_data = {
        "category": "Bar"
    }


    # WHEN
    response = client.patch(f"/api/v1/rests/4", json=request_data)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code :", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 422






