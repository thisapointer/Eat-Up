//식당 목록 API 요청
const BASE_URL = "https://eat-up-96sa.onrender.com/api/v1";

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
  console.log("식당 API 응답:", data);

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