import { API_V1_URL } from "./apiConfig";

const BASE_URL = API_V1_URL;

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

export async function getMenuList(restId) {
  const response = await fetch(`${BASE_URL}/menus/?rest_id=${restId}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  const data = await parseJsonOrNull(response);


  if (!response.ok) {
    const error = new Error(
      data?.message || "메뉴 목록을 불러오지 못했습니다."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

   // 백엔드 응답이 배열이면 그대로 사용
  if (Array.isArray(data)) {
    return data;
  }

  // 혹시 { menus: [...] } 형태로 오면 이것도 대응
  return Array.isArray(data?.menus) ? data.menus : [];
}


