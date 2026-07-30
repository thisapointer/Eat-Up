import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterChips from "../components/map/MapFilterChips";
import BottomNav from "../components/BottomNav";

import { getRestaurants, searchRestaurants } from "../api/restaurantApi";

import RestaurantList from "../components/list/RestaurnatList";

import "../styles/ListUp.css";

function ListUp() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRestaurants = async() => {
      try {
        const data = await getRestaurants();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("리스트 식당 조회 실패:", error);
        setErrorMessage("식당 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();

  }, []);

  // 검색어 입력 후 엔터 / 검색 이벤트가 발생했을 때 실행
  const handleSearch = async (keyword) => {
    try {
      const data = await searchRestaurants(keyword);

      //검색 응답 배열인지 확인 후 저장
      setRestaurants(Array.isArray(data) ? data : []);
      setSelectedFilters([]);
    } catch (error) {
      console.error("식당 검색 실패:", error);
      setErrorMessage("식당 검색에 실패했습니다.");
    }
  };

  // 필터 버튼이 선택/해제될 때 실행
  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  //리스트 카드 클릭시 식당 상세 페이지로 이동 -- 경로 수정 가능성 있음
  const handleRestaurantClick = (restaurant) => {
    navigate(`/rests/${rest_id}`);
  };

  //지도 화면으로 이동
  const handleViewChange = (nextView) => {
    if (nextView === "map") {
      navigate("/map");
      return;
    }
  };

  // 필터 조건에 맞는 식당만 보여줌
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const isLiked = restaurant.isLiked ?? restaurant.is_liked ?? false;
    const isVisited = restaurant.isVisited ?? restaurant.is_visited ?? false;
    const isOpen = restaurant.isOpen ?? restaurant.is_open ?? true;

    if (selectedFilters.includes("liked") && !isLiked) {
      return false;
    }

    if (selectedFilters.includes("unvisited") && isVisited) {
      return false;
    }

    if (selectedFilters.includes("open") && !isOpen) {
      return false;
    }

    return true;
  });

  return (
    <main className="list-up-page">
      <section className="list-up-controls" aria-label="맛집 리스트 검색과 필터">
        <MapViewToggle currentView="list" onChange={handleViewChange} />
        <MapSearchBar onSearch={handleSearch} />
        <MapFilterChips onChange={handleFilterChange} />
      </section>

      {isLoading && <p className="list-up-message">식당 불러오는 중...</p>}
      {errorMessage && <p className="list-up-message">{errorMessage}</p>}

      <RestaurantList
        restaurants={filteredRestaurants}
        onRestaurantClick={handleRestaurantClick}
      />
    </main>
  );
}

export default ListUp;