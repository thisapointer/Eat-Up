import RestaurantImageList from "./RestaurantImageList";
import RestaurantStampBadge from "./RestaurantStampBadge";
import "../../styles/RestaurantSummary.css";

import HeartOnIcon from "../../assets/fav_btn_selected.svg";
import HeartOffIcon from "../../assets/fav_btn.svg";
import CallIcon from "../../assets/call.svg";
import LocationIcon from "../../assets/location.svg";
import HoursArrow from "../../assets/keyboard_arrow_down.svg";

import { useEffect, useMemo, useState } from 'react';
import { Link } from "react-router-dom";

import { getRestaurantHours } from "../../api/restTimeApi";
import { getRestaurantOpenText, getTodayWeekday } from "../../utils/restaurantTime";

//api 요일값을 화면에 보여줄 한글 요일로 바꿈
const weekdayLabels = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

function formatTime(timeText) {
  if(!timeText) {
    return "";
  }

  return String(timeText).slice(0,5);
}

function RestaurantSummary({ restaurant, onLikeToggle }) {
  const name = restaurant.name;
  const category = restaurant.category;
  const info = getRestaurantOpenText(
    restaurant.today_hours ?? restaurant.restInfo?.today_hours,
    restaurant.today_breaks ?? restaurant.restInfo?.today_breaks
  );
  const phone = restaurant.phone ?? "";
  const address = restaurant.addr?.addr_name ?? restaurant.address ?? "";
  const visitCount = restaurant.visitCount ?? restaurant.visit_count ?? 0;
  const isLiked = restaurant.isLiked ?? restaurant.is_liked ?? false;

  //영업시간 전체 목록
  const [hoursList, setHoursList] = useState([]);
  
  //영업시간 목록 펼쳤는지 저장
  const [isHoursOpen, setIsHoursOpen] = useState(false);

  //오늘 요일
  const todayWeekday = getTodayWeekday();

  //식당 바뀔 때마다 해당 시간의 영업시간 불러옴
  useEffect(() => {
    const fetchHours = async () => {
      if (!restaurant.id) {
        return;
      }

      try {
        const data = await getRestaurantHours(restaurant.id);

        if (Array.isArray(data)) {
          setHoursList(data);
          return;
        }

        setHoursList(Array.isArray(data?.hours) ? data.hours : []);
      } catch (error) {
        console.error("영업시간 조회 실패:", error);
        setHoursList([]);
      }
    };

    fetchHours();
  }, [restaurant.id]);

  //오늘 요일에 해당하는 영업시간 
  const todayHours = useMemo(() => {
    return hoursList.find((hours) => hours.weekday === todayWeekday) ?? null;
  }, [hoursList, todayWeekday]);

  return (
    <section className="restaurant-summary" aria-label="식당 요약 정보">
      <div className="restaurant-summary-top">
        <button
          className="restaurant-summary-like"
          type="button"
          onClick={onLikeToggle}
          aria-label={restaurant.isLiked ? "찜 해제" : "찜하기"}
        >
          <img
            src={restaurant.isLiked ? HeartOnIcon : HeartOffIcon}
            alt=""
            aria-hidden="true"
          />
        </button>

        
        <Link className="restaurant-summary-cert" to={`/rests/${restaurant.id}/cert`} state={{ restaurant }}>
          인증하기
        </Link>
      </div>

      <div className="restaurant-summary-main">
        <div className="restaurant-summary-info">
          <h2>
            {name}
            <span>{category}</span>
          </h2>

          {/* 영업시간 요약 + 전체 영업시간 펼치기 버튼 */}
          <div className="restaurant-hours">
            <button className="restaurant-hours-toggle" type="button" onClick={() => setIsHoursOpen((prev) => !prev)} >
              <span>{info}</span>
              <img className={isHoursOpen ? "restaurant-hours-arrow--open" : ""}src={HoursArrow} alt="" aria-label="true" />
            </button>

            {isHoursOpen && (
              <div className="restaurant-hours-list">
                {hoursList.map((hours) => (
                  <p
                    className={
                      hours.weekday === todayWeekday
                        ? "restaurant-hours-row restaurant-hours-row--today"
                        : "restaurant-hours-row"
                    }
                    key={hours.weekday}
                  >
                    <strong>{weekdayLabels[hours.weekday]}</strong>
                    <span>
                      {hours.is_closed
                        ? "정기휴무"
                        : `${formatTime(hours.open_time)} - ${formatTime(
                            hours.close_time
                          )}`}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {phone && (
            <p className="restaurant-info-row">
              <img src={CallIcon} alt="" aria-hidden="true" />
              <span>{phone}</span>
            </p>
          )}
          {address && (
            <p className="restaurant-info-row">
              <img src={LocationIcon} alt="" aria-hidden="true" />
              <span>{address}</span>
            </p>
          )}
        </div>

        <RestaurantStampBadge visitCount={visitCount} />
      </div>

      <RestaurantImageList restaurant={restaurant} />
    </section>
  );
}

export default RestaurantSummary;