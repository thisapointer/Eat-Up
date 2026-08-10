import { useNavigate } from "react-router-dom";

import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterChips from "../components/map/MapFilterChips";
import RestaurantList from "../components/list/RestaurnatList";
import BottomNav from "../components/BottomNav";

import { useRestaurantExplorer } from "../hooks/useRestaurantExplorer";

import  { createRestaurantLike, deleteRestaurantLike } from "../api/likeApi";

import "../styles/ListUp.css";

function ListUp() {
  const navigate = useNavigate();

  const {
    restaurants,
    setRestaurants,
    filteredRestaurants,
    selectedFilters,
    setSelectedFilters,
    isLoading,
    errorMessage,
    handleSearch,
    handleFilterChange,
    selectedRestaurant,
    setSelectedRestaurant,
    loadingMessage,
    handleReset,
  } = useRestaurantExplorer();

  //지도 화면으로 이동
  const handleViewChange = (nextView) => {
    if (nextView === "map") {
      navigate("/map");
    }
  };


  //카드 누르면 지도에서 해당 식당의 시트를 펼침
  const handleRestaurantClick = (restaurant) => {
    navigate("/map", {
      state: {
        selectedRestaurant: restaurant,
        sheetMode: "expanded",
      },
    });
  };

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
        <MapSearchBar onSearch={handleSearch} onClear={handleReset} />
        <MapFilterChips onChange={handleFilterChange} />
      </section>

      {isLoading && <p className="list-up-message" role="status">{loadingMessage}</p>}
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