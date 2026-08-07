import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterChips from "../components/map/MapFilterChips";
import BottomNav from "../components/BottomNav";

import { getRestaurants, searchRestaurants } from "../api/restaurantApi";
import { createRestaurantLike, deleteRestaurantLike } from "../api/likeApi";


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
    navigate(`/rests/${restaurant.id}`);
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

  //찜 상태 변경
  const handleLikeToggle = async (targetRestaurant) => {
    const restId = targetRestaurant.id;

    // 백엔드 필드명이 isLiked / is_liked 둘 중 무엇이 와도 대응합니다.
    const currentIsLiked =
      targetRestaurant.isLiked ?? targetRestaurant.is_liked ?? false;

    const nextIsLiked = !currentIsLiked;

    try {
      // 먼저 화면 상태를 바꿔서 사용자가 바로 반응을 느끼게 합니다.
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === restId
            ? {
                ...restaurant,
                isLiked: nextIsLiked,
                is_liked: nextIsLiked,
              }
            : restaurant
        )
      );

      // 바뀐 상태에 따라 찜 등록 또는 찜 해제 API를 호출합니다.
      if (nextIsLiked) {
        await createRestaurantLike(restId);
      } else {
        await deleteRestaurantLike(restId);
      }
    } catch (error) {
      console.error("찜 상태 변경 실패:", error);

      // API가 실패하면 화면 상태를 원래대로 되돌립니다.
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === restId
            ? {
                ...restaurant,
                isLiked: currentIsLiked,
                is_liked: currentIsLiked,
              }
            : restaurant
        )
      );
    }
  };

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
        onLikeToggle={handleLikeToggle}
      />
    </main>
  );
}

export default ListUp;