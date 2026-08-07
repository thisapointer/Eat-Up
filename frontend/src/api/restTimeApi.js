const BASE_URL = "https://eat-up-96sa.onrender.com/api/v1";

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

// 식당 영업시간 조회
export async function getRestaurantHours(restId) {
  const response = await fetch(`${BASE_URL}/hours?rest_id=${restId}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  const data = await parseJsonOrNull(response);

  if (!response.ok) {
    throw new Error("영업시간을 불러오지 못했습니다.");
  }

  return data;
}

// 식당 브레이크시간 조회
export async function getRestaurantBreaks(restId, weekday) {
  try{
    const response = await fetch(
    `${BASE_URL}/breaks?rest_id=${restId}&weekday=${weekday}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  );

  //브레이크 타임이 없을 경우 - 404
  if(response.status === 404) {
    return [];
  }

  const data = await parseJsonOrNull(response);

  if (!response.ok) {
      return [];
    }

    return Array.isArray(data) ? data : data ? [data] : [];
  } catch (error) {
    // 서버 500/CORS/네트워크 실패도 브레이크 없음으로 처리
    return [];
  }
}