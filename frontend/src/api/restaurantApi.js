import { getRestList } from "./mypageApi";

//식당 목록 API 요청
import {
  API_V1_URL,
  API_V2_URL,
} from "./apiConfig";

const BASE_URL = API_V1_URL;
const BASE_URL2 = API_V2_URL;

// 응답이 JSON이 아닐 수도 있으니 안전하게 처리
async function parseJsonOrNull(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// 전체 식당/카페 목록 조회
export async function getRestaurants() {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/rests/`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      //찜, 방문 표시
      //Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await parseJsonOrNull(response);
  
  if (!response.ok) {
    const error = new Error(
      data?.message || "식당 목록을 불러오지 못했습니다."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  //백엔드 응답 형태가 배열이면 그대로 반환
  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.rests) ? data.rests : [];
}


// 검색어 기준 식당/카페 검색
export async function searchRestaurants(name) {
  const accessToken = localStorage.getItem("accessToken");
  const encodedKeyword = encodeURIComponent(name);

  const response = await fetch(
    `${BASE_URL}/rests/search?name=${encodedKeyword}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await parseJsonOrNull(response);

  if (!response.ok) {
    throw new Error("식당 검색에 실패했습니다.");
  }

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.rests) ? data.rests : [];
}

//식당목록 + 인증 기록
export async function getRestaurantsWithUserState() {
  // 전체 식당, 방문 식당, 찜 식당을 동시에 조회합니다.
  const [restaurants, visitedRestaurants, likedRestaurants] =
    await Promise.all([
      getRestaurants(),
      getRestList(),
      getFilteredRestaurants(["liked"]),
    ]);

  const visitedMap = new Map(
    visitedRestaurants.map((restaurant) => [
      Number(restaurant.id),
      restaurant,
    ])
  );

  const likedIdSet = new Set(
    likedRestaurants.map((restaurant) => Number(restaurant.id))
  );

  return restaurants.map((restaurant) => {
    const restaurantId = Number(restaurant.id);
    const visitedRestaurant = visitedMap.get(restaurantId);
    const visitCount = visitedRestaurant?.visitCount ?? 0;
    const isLiked = likedIdSet.has(restaurantId);

    return {
      ...restaurant,

      visitCount,
      visit_count: visitCount,

      isVisited: visitCount > 0,
      is_visited: visitCount > 0,

      isLiked,
      is_liked: isLiked,
    };
  });
}

//검색 후 식당목록 + 인증 기록
export async function searchRestaurantsWithUserState(keyword) {
  const [restaurants, visitedRestaurants, likedRestaurants] =
    await Promise.all([
      searchRestaurants(keyword),
      getRestList(),
      getFilteredRestaurants(["liked"]),
    ]);

  const visitedMap = new Map(
    visitedRestaurants.map((restaurant) => [
      Number(restaurant.id),
      restaurant,
    ])
  );

  const likedIdSet = new Set(
    likedRestaurants.map((restaurant) => Number(restaurant.id))
  );

  return restaurants.map((restaurant) => {
    const restaurantId = Number(restaurant.id);
    const visitedRestaurant = visitedMap.get(restaurantId);
    const visitCount = visitedRestaurant?.visitCount ?? 0;
    const isLiked = likedIdSet.has(restaurantId);

    return {
      ...restaurant,
      visitCount,
      visit_count: visitCount,
      isVisited: visitCount > 0,
      is_visited: visitCount > 0,
      isLiked,
      is_liked: isLiked,
    };
  });
}

// 선택한 필터 조건에 맞는 식당 목록 조회
export async function getFilteredRestaurants(filters = []) {
  const accessToken = localStorage.getItem("accessToken");
  const params = new URLSearchParams();

  if (filters.includes("liked")) {
    params.set("fav", "true");
  }

  if (filters.includes("unvisited")) {
    params.set("not_visited", "true");
  }

  if (filters.includes("open")) {
    params.set("oper", "true");
  }

  const queryString = params.toString();

  const response = await fetch(
    `${BASE_URL2}/rests${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await parseJsonOrNull(response);

  if (!response.ok) {
    const error = new Error(
      data?.message || "필터링된 식당을 불러오지 못했습니다."
    );

    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.rests) ? data.rests : [];
}