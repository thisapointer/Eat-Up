import { useEffect, useMemo, useState, useCallback } from "react";
import {getRestaurantsWithUserState, searchRestaurantsWithUserState, getFilteredRestaurants } from "../api/restaurantApi";
import { getRestaurantHours, getRestaurantBreaks } from "../api/restTimeApi";
import { checkRestaurantOpenNow, getTodayWeekday } from "../utils/restaurantTime";

async function addOpenState(restaurants) {
  const weekday = getTodayWeekday();

  return Promise.all(
    restaurants.map(async (restaurant) => {
      if (!restaurant.id) {
        return {
          ...restaurant,
          isOpen: false,
          is_open: false,
        };
      }

      try {
        const [hoursData, breaksData] = await Promise.all([
          getRestaurantHours(restaurant.id),

          getRestaurantBreaks(restaurant.id, weekday).catch(() => []),
        ]);

        const hoursList = Array.isArray(hoursData)
          ? hoursData
          : hoursData?.hours ?? [];

        const todayHours = hoursList.find(
          (hours) => hours.weekday === weekday
        );

        const isOpen = checkRestaurantOpenNow(
          todayHours,
          breaksData
        );


        return {
          ...restaurant,
          today_hours: todayHours,
          isOpen,
          is_open: isOpen,
        };
      } catch (error) {
        console.error(`${restaurant.name} 영업시간 계산 실패:`, error);

        return {
          ...restaurant,
          isOpen: false,
          is_open: false,
        };
      }
    })
  );
}

export function useRestaurantExplorer() {
  //선택된 필터 저장
  const [selectedFilters, setSelectedFilters] = useState([]);
  //API로 받은 식당 목록 저장
  const [restaurants, setRestaurants] = useState([]);
  //api 요청중인지 저장
  const [isLoading, setIsLoading] = useState(true);
  //api 실패 메세지 저장
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedRestaurant ,setSelectedRestaurant] = useState();

  const [loadingMessage, setLoadingMessage] = useState("식당 불러오는 중...");

  //전체 식당/카페 40개 불러옴
  const loadAllRestaurants = useCallback(async (message = "식당 불러오는 중...") => {
  try {
    setIsLoading(true);
    setLoadingMessage(message);
    setErrorMessage("");

    const data = await getRestaurantsWithUserState();
    setRestaurants(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("전체 식당 목록 조회 실패:", error);
    setErrorMessage("식당 정보를 불러오지 못했습니다.");
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  loadAllRestaurants();
}, [loadAllRestaurants]);

  //검색어를 입력했을 때 백엔드 검색 API를 호출
  const handleSearch = async (keyword) => {
    try {

      setIsLoading(true);
      setLoadingMessage("식당을 검색하는 중...");
      setErrorMessage("");

      const data = await searchRestaurantsWithUserState(keyword);

      //검색 응답 배열인지 확인 후 저장
      setRestaurants(Array.isArray(data) ? data : []);
      setSelectedFilters([]);
      //검색 결과 바뀌면 이전에 클릭한 식당 선택 초기화
      setSelectedRestaurant(null);
    } catch (error) {
      console.error("식당 검색 실패:", error);
      setErrorMessage("식당 검색에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setSelectedFilters([]);
    setSelectedRestaurant(null);

    await loadAllRestaurants("초기 지도를 불러오는 중...");
  };


  // 필터 버튼이 바뀔 때 선택된 필터 저장
  const handleFilterChange = async (filters) => {
    setSelectedFilters(filters);
    setSelectedRestaurant(null);
    setErrorMessage("");

    setIsLoading(true);
    setLoadingMessage(
      filters.includes("open")
        ? "현재 영업 중인 식당을 확인하는 중..."
        : "필터 결과를 불러오는 중..."
    );

    try {
      // 영업 중은 프론트에서 현재 시간과 비교하므로
      // 서버 필터 요청에서는 제외합니다.
      const serverFilters = filters.filter(
        (filter) => filter !== "open"
      );

      let data;

      if (serverFilters.length > 0) {
        data = await getFilteredRestaurants(serverFilters);
      } else {
        data = await getRestaurantsWithUserState();
      }

      let nextRestaurants = Array.isArray(data) ? data : [];

      // 찜 필터 API로 받은 식당은 모두 찜 상태입니다.
      if (filters.includes("liked")) {
        nextRestaurants = nextRestaurants.map((restaurant) => ({
          ...restaurant,
          isLiked: true,
          is_liked: true,
        }));
      }

      // 현재 컴퓨터 시간과 영업시간을 비교합니다.
      if (filters.includes("open")) {
        nextRestaurants = await addOpenState(nextRestaurants);
      }

      setRestaurants(nextRestaurants);
    } catch (error) {
      console.error("식당 필터 조회 실패:", error);
      setErrorMessage("필터링된 식당을 불러오지 못했습니다.");
    } finally { 
      setIsLoading(false);
    }
  };

  // 선택된 필터 기준으로 화면에 보여줄 식당만 걸러냄
  const restaurantList = Array.isArray(restaurants) ? restaurants : [];

  const filteredRestaurants = useMemo(() => {
    const restaurantList = Array.isArray(restaurants) ? restaurants : [];

    return restaurantList.filter((restaurant) => {
      const isLiked =
        restaurant.isLiked ?? restaurant.is_liked ?? false;

      const isVisited =
        restaurant.isVisited ?? restaurant.is_visited ?? false;

      const isOpen =
        restaurant.isOpen ?? restaurant.is_open ?? false;

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
  }, [restaurants, selectedFilters]);


  return {
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
  };

}