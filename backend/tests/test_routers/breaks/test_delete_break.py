import pytest
from datetime import time

from app.models.rests import Rest
from app.models.rest_hours import RestHour
from app.models.breaks import Break


# ============ 성공 코드 ============
# 식당 브레이크타임 삭제 성공 코드
@pytest.mark.skip(reason="검증 완료")
def test_delete_break_success(client, db):

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

    break_list = [
        Break(weekday=rest_hour_list[0].weekday, 
            break_start_time=time(15, 0),
            break_end_time=time(18, 0)),
        Break(weekday=rest_hour_list[0].weekday, 
            break_start_time=time(1, 0),
            break_end_time=time(4, 0))
    ]
    db.add_all(break_list)
    db.commit()   


    # WHEN
    params = {"rest_id": 1,
              "weekday": "MON"}
    response = client.delete(f"/api/v1/breaks/2", params=params)


    # THEN
    print("\n================ [응답 결과] ================")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    print("=============================================\n")

    assert response.status_code == 200

    break_query = db.query(Break)\
                    .join(RestHour, Break.weekday == RestHour.weekday)\
                    .filter(RestHour.rest_id == 1,
                            Break.weekday == "MON").all()
    assert len(break_query) == 1


    