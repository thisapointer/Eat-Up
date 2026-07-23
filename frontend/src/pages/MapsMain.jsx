import { useEffect, useState } from "react";
import KakaoMap from "../components/map/KakaoMap";
import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterChips from "../components/map/MapFilterChips";
import { getRestaurants, searchRestaurants } from "../api/restaurantApi";
import "../styles/MapsMain.css";

function MapsMain() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // 페이지가 처음 열렸을 때 DB에 저장된 전체 40개 식당/카페를 불러옵니다.
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("전체 식당 목록 조회 실패:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // 검색어를 입력했을 때 백엔드 검색 API를 호출합니다.
  const handleSearch = async (keyword) => {
    try {
      const data = await searchRestaurants(keyword);
      setRestaurants(data);
      setSelectedRestaurant(null);
    } catch (error) {
      console.error("식당 검색 실패:", error);
    }
  };

  // 필터 버튼이 바뀔 때 선택된 필터를 저장합니다.
  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    setSelectedRestaurant(null);
  };

  // 선택된 필터 기준으로 화면에 보여줄 식당만 걸러냅니다.
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (selectedFilters.includes("liked") && !restaurant.isLiked) {
      return false;
    }

    if (selectedFilters.includes("unvisited") && restaurant.isVisited) {
      return false;
    }

    if (selectedFilters.includes("open") && !restaurant.isOpen) {
      return false;
    }

    return true;
  });

  return (
    <main className="maps-main">
      <KakaoMap
        restaurants={filteredRestaurants}
        onMarkerClick={setSelectedRestaurant}
      />

      <section className="maps-main-overlay" aria-label="지도 화면 조작">
        <MapViewToggle />
        <MapSearchBar onSearch={handleSearch} />
        <MapFilterChips onChange={handleFilterChange} />
      </section>

      {selectedRestaurant && (
        <div className="restaurant-bottom-sheet">
          {selectedRestaurant.name}
        </div>
      )}
    </main>
  );
}

export default MapsMain;