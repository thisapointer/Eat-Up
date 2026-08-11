import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterChips from "../components/map/MapFilterChips";
import RestaurantList from "../components/list/RestaurnatList";
import BottomNav from "../components/BottomNav";
import MapRestaurantSheet from "../components/map/MapRestaurantSheet";

import { useRestaurantExplorer } from "../hooks/useRestaurantExplorer";

import  { createRestaurantLike, deleteRestaurantLike } from "../api/likeApi";

import "../styles/ListUp.css";

function ListUp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sheetMode, setSheetMode] = useState("closed");

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

  useEffect(() => {
    const returnedRestaurant = location.state?.selectedRestaurant;

    if (
      !returnedRestaurant ||
      location.state?.sheetMode !== "expanded"
    ) {
      return;
    }

    setSelectedRestaurant(returnedRestaurant);
    setSheetMode("expanded");

    // 새로고침했을 때 계속 열리는 현상 방지
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.state, location.pathname, navigate, setSelectedRestaurant]);

  // 리스트 카드를 누르면 현재 페이지에서 하단시트를 펼침
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setSheetMode("expanded");
  };


  //찜 상태 변경
  const handleLikeToggle = async (targetRestaurant) => {
    const restId = targetRestaurant.id;

    // 백엔드 필드명이 isLiked / is_liked 둘 중 무엇이 와도 대응합니다.
    const currentIsLiked =
      targetRestaurant.isLiked ?? targetRestaurant.is_liked ?? false;

    const nextIsLiked = !currentIsLiked;

    try {
      // 먼저 화면 상태를 바꿔서 사용자가 바로 반응 볼 수 있게 함
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

      setSelectedRestaurant((prevRestaurant) => 
        prevRestaurant?.id === restId
          ? {
            ...prevRestaurant,
            isLiked: nextIsLiked,
            is_liked: nextIsLiked,
            }
          : prevRestaurant
      );


      // 바뀐 상태에 따라 찜 등록 또는 찜 해제 API를 호출합니다.
      if (nextIsLiked) {
        await createRestaurantLike(restId);
      } else {
        await deleteRestaurantLike(restId);
      }
    } catch (error) {
      console.error("찜 상태 변경 실패:", error);

      // API가 실패하면 화면 상태를 원래대로 되돌림(전체식당목록복구)
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

      //현재 하단 시트의 상태 복구
      setSelectedRestaurant((prevRestaurant) =>
        prevRestaurant?.id === restId
          ? {
              ...prevRestaurant,
              isLiked: currentIsLiked,
              is_liked: currentIsLiked,
            }
          : prevRestaurant
      );
    }
  };

  const handleViewChange = (nextView) => {
    if (nextView === "map") {
      navigate("/map");
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

      {selectedRestaurant && sheetMode !== "closed" && (
        <MapRestaurantSheet
          restaurant={selectedRestaurant}
          sheetMode={sheetMode}
          onSheetModeChange={setSheetMode}
          onLikeToggle={() => handleLikeToggle(selectedRestaurant)}
          showBackButton
          onClose={() => {setSelectedRestaurant(null); setSheetMode("closed");}}
        />
      )}
    </main>
  );
}

export default ListUp;