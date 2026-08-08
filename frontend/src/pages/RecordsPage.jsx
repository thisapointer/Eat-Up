import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import RestaurantStampBadge from "../components/restaurant/RestaurantStampBadge";
import { getRestList } from "../api/mypageApi";
import CallIcon from "../assets/call.svg";
import LocationIcon from "../assets/location.svg";
import "../styles/RecordsPage.css";

function RecordsPage() {
  const [restList, setRestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRestList = async () => {
      try {
        const data = await getRestList();
        setRestList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("맛집 도장 순위 전체 조회 실패:", error);
        setErrorMessage("맛집 도장 순위를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestList();
  }, []);

  return (
    <main className="records-page">
      <header className="records-header">
        <BackButton />
        <h1>맛집 도장 순위</h1>
      </header>

      {isLoading && <p className="records-message">불러오는 중...</p>}
      {errorMessage && <p className="records-message">{errorMessage}</p>}

      {!isLoading && !errorMessage && restList.length === 0 && (
        <p className="records-message">아직 가 본 맛집이 없습니다.</p>
      )}

      <section className="records-list" aria-label="맛집 도장 순위 전체 목록">
        {restList.map((restaurant) => (
          <article 
            className="records-card" 
            key={restaurant.id}
            onClick={() =>
              navigate("/map", {
                state: {
                  selectedRestaurant: restaurant.restInfo ?? restaurant,
                  sheetMode: "expanded",
                },
              })
            }
          >
            <div className="records-card-info">
              <strong>
                {restaurant.name} <span>{restaurant.category}</span>
              </strong>

              <p>{restaurant.info}</p>

              {restaurant.phone && (
                <p className="records-info-row">
                  <img src={CallIcon} alt="" aria-hidden="true" />
                  <span>{restaurant.phone}</span>
                </p>
              )}

              {restaurant.address && (
                <p className="records-info-row">
                  <img src={LocationIcon} alt="" aria-hidden="true" />
                  <span>{restaurant.address}</span>
                </p>
              )}
            </div>

            <RestaurantStampBadge visitCount={restaurant.visitCount} />
          </article>
        ))}
      </section>
    </main>
  );
}

export default RecordsPage;