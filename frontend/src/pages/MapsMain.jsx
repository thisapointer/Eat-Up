import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import KakaoMap from "../components/map/KakaoMap";
import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterChips from "../components/map/MapFilterChips";
import MapRestaurantSheet from "../components/map/MapRestaurantSheet";

import { getRestaurants, searchRestaurants, getRestaurantsWithUserState, searchRestaurantsWithUserState } from "../api/restaurantApi";
import { createRestaurantLike, deleteRestaurantLike } from "../api/likeApi";
import { getRestaurantHours, getRestaurantBreaks } from "../api/restTimeApi"

import { useRestaurantExplorer } from "../hooks/useRestaurantExplorer";

import "../styles/MapsMain.css";

function MapsMain() {

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

  const handleMapClick = () => {
    setSelectedRestaurant(null);
    setSheetMode("closed");
  }

  //지도/목록 탭 상태
  const [currentView, setCurrentView] = useState("map");

  //바텀시트 모드 3가지(closed, preview, expanded)
  const [sheetMode, setSheetMode] = useState("closed");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stateRestaurant =
      location.state?.selectedRestaurant;

    if (!stateRestaurant) {
      return;
    }

    setSelectedRestaurant(stateRestaurant);
    setSheetMode(
      location.state?.sheetMode ?? "preview"
    );

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [
    location.state,
    location.pathname,
    navigate,
  ]);


  //선택된 마커 다시 클릭시 상태 해제
  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant((prevRestaurant) => {
      const isSameRestaurant = prevRestaurant?.id === restaurant.id;

      if (isSameRestaurant) {
        setSheetMode("closed");
        return null;
      }

      setSheetMode("preview");
      return restaurant;
    });
  };

  useEffect(() => {
    const stateRestaurant = location.state?.selectedRestaurant;

    if (!stateRestaurant) {
      return;
    }

    setSelectedRestaurant(stateRestaurant);
    setSheetMode(location.state?.sheetMode ?? "preview");
  }, [location.state]);


  //찜 상태 변경
  const handleLikeToggle = async () => {
    if (!selectedRestaurant) {
      return;
    }

    const restId = selectedRestaurant.id;
     const currentIsLiked = selectedRestaurant.isLiked ?? selectedRestaurant.is_liked ?? false;
    const nextIsLiked = !currentIsLiked;

    try {
      // 먼저 화면 상태를 바꿔서 사용자가 바로 반응을 느끼게 함
      setSelectedRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        isLiked: nextIsLiked,
        is_liked: nextIsLiked,
      }));

      // 지도 마커/필터에 쓰는 전체 식당 목록도 같이 수정
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === restId
            ? { ...restaurant, isLiked: nextIsLiked, is_liked: nextIsLiked, }
            : restaurant
        )
      );

      if(nextIsLiked) {
        await createRestaurantLike(restId);
      } else {
        await deleteRestaurantLike(restId);
      }
    } catch(error) {
      console.error("찜 상태 변경 실패: ", error);

      //api 실패시 원래대로 되돌림
      setSelectedRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        isLiked: currentIsLiked,
        is_liked: currentIsLiked,
      }));

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
    <main className="maps-main">
      <KakaoMap
        restaurants={filteredRestaurants}
        selectedRestaurantId={selectedRestaurant?.id}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />

      <section className="maps-main-overlay" aria-label="지도 화면 조작">
        <MapViewToggle currentView={currentView} onChange={setCurrentView} />
        <MapSearchBar 
          onSearch={handleSearch} 
          onClear={() => {setSheetMode("closed"); handleReset();}} />
        <MapFilterChips selectedFilters={selectedFilters} onChange={handleFilterChange} />

        {isLoading && <p className="maps-main-message" role="status">{loadingMessage}</p>}
        {errorMessage && <p className="maps-main-message">{errorMessage}</p>}
      </section>

      {selectedRestaurant && sheetMode !== "closed" && (
        <MapRestaurantSheet
          restaurant={selectedRestaurant}
          sheetMode={sheetMode}
          onSheetModeChange={setSheetMode}
          onClose={() => {setSelectedRestaurant(null); setSheetMode("closed");}}
          onLikeToggle={handleLikeToggle}
        />
      )}
    </main>
  );
}

export default MapsMain;