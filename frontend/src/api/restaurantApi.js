const BASE_URL = "http://localhost:8000/api/v1";

// 전체 식당/카페 목록 조회
export async function getRestaurants() {
  const response = await fetch(`${BASE_URL}/rests`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("식당 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

// 검색어 기준 식당/카페 검색
export async function searchRestaurants(name) {
  const encodedKeyword = encodeURIComponent(name);

  const response = await fetch(
    `${BASE_URL}/rests/search?name=${encodedKeyword}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("식당 검색에 실패했습니다.");
  }

  return response.json();
}