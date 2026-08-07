import { useEffect, useState } from "react";

import KakaoMap from "../components/map/KakaoMap";
import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterChips from "../components/map/MapFilterChips";
import MapRestaurantSheet from "../components/map/MapRestaurantSheet";

import { getRestaurants, searchRestaurants } from "../api/restaurantApi";
import { createRestaurantLike, deleteRestaurantLike } from "../api/likeApi";
import { getRestaurantHours, getRestaurantBreaks } from "../api/restTimeApi"

import { checkRestaurantOpenNow, getTodayWeekday } from "../utils/restaurantTime";

import "../styles/MapsMain.css";

function MapsMain() {
  //지도/목록 탭 상태
  const [currentView, setCurrentView] = useState("map");

  //API로 받은 식당 목록 저장
  const [restaurants, setRestaurants] = useState([]);

  //선택된 식당 저장 - 마커 클릭시 하단 바텀시트에 보여줄 식당
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  //바텀시트 모드 3가지(closed, preview, expanded)
  const [sheetMode, setSheetMode] = useState("closed");

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

  //선택된 필터 저장
  const [selectedFilters, setSelectedFilters] = useState([]);

  //api 요청중인지 저장
  const [isLoading, setIsLoading] = useState(true);

  //api 실패 메세지 저장
  const [errorMessage, setErrorMessage] = useState("");

  // 페이지가 처음 열렸을 때 DB에 저장된 전체 40개 식당/카페를 불러옵니다.
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        console.log("식당 API 응답: ", data);

        //필터 오류 방지 위해 배열인지 확인 후 저장
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("전체 식당 목록 조회 실패:", error);
        setErrorMessage("식당 정보를 불러오지 못했씁니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // 검색어를 입력했을 때 백엔드 검색 API를 호출
  const handleSearch = async (keyword) => {
    try {
      const data = await searchRestaurants(keyword);
      console.log("식당검색완료", data);

      //검색 응답 배열인지 확인 후 저장
      setRestaurants(Array.isArray(data) ? data : []);
      setSelectedFilters([]);
      //검색 결과 바뀌면 이전에 클릭한 식당 선택 초기화
      setSelectedRestaurant(null);
    } catch (error) {
      console.error("식당 검색 실패:", error);
      setErrorMessage("식당 검색에 실패했습니다.");
    }
  };


  // 필터 버튼이 바뀔 때 선택된 필터를 저장합니다.
  const handleFilterChange = async (filters) => {
    setSelectedFilters(filters);
    setSelectedRestaurant(null);

    //영업중 필터 선택 X -> api 조회 X
    if(!filters.includes("open")) {
      return;
    }

    try{
      const weekday = getTodayWeekday();

      const restaurantsWithOpenState = await Promise.all(
        restaurants.map(async (restaurant) => {
          if(!restaurant.id) {
            return {
              ...restaurant,
              isOpen: false,
              is_open: false,
            };
          }

          const hoursData = await getRestaurantHours(restaurant.id);

          let breaksData = await getRestaurantBreaks(restaurant.id, weekday);

          try {
            breaksData = await getRestaurantBreaks(restaurant.id, weekday);
          } catch (error) {
            // 브레이크 시간이 없거나 API가 실패하면 일단 브레이크 없음으로 처리
            breaksData = [];
          }

          const todayHours = Array.isArray(hoursData)
            ? hoursData.find((hours) => hours.weekday === weekday)
            : hoursData;

          const isOpen = checkRestaurantOpenNow(todayHours, breaksData);

          return {
            ...restaurant,
            isOpen,
            is_open: isOpen,
          };
        })
      );


      setRestaurants(restaurantsWithOpenState);
    } catch(error) {
      console.error("영업중 필터 계산 실패: ", error);
      setErrorMessage("영업 정보를 불러오지 못했습니다.");
    }
  };

  // 선택된 필터 기준으로 화면에 보여줄 식당만 걸러냅니다.
  const restaurantList = Array.isArray(restaurants) ? restaurants : [];

  const filteredRestaurants = restaurantList.filter((restaurant) => {
    const isLiked = restaurant.isLiked ?? restaurant.is_liked ?? false;
    const isVisited = restaurant.isVisited ?? restaurant.is_visited ?? false;
    const isOpen = restaurant.isOpen ?? restaurant.is_open ?? false;

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
      />

      <section className="maps-main-overlay" aria-label="지도 화면 조작">
        <MapViewToggle currentView={currentView} onChange={setCurrentView} />
        <MapSearchBar onSearch={handleSearch} />
        <MapFilterChips onChange={handleFilterChange} />

        {isLoading && <p className="maps-main-message">식당 불러오는 중...</p>}
        {errorMessage && <p className="maps-main-message">{errorMessage}</p>}
      </section>

      {selectedRestaurant && (
        <MapRestaurantSheet
          restaurant={selectedRestaurant}
          sheetMode={sheetMode}
          onSheetModeChange={setSheetMode}
          onClose={() => {setSelectedRestaurant(null)}}
          onLikeToggle={handleLikeToggle}
        />
      )}
    </main>
  );
}

export default MapsMain;