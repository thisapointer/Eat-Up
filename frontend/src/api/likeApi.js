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

//찜하기 등록 api 
export async function createRestaurantLike(restId) {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${BASE_URL}/fav/?rest_id=${restId}`, {
        method: "POST",
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });

  const data = await parseJsonOrNull(response);

  if (!response.ok) {
    throw new Error(data?.message || "찜하기에 실패했습니다.");
  }

  return data;
}

//찜하기 해제 api 
export async function deleteRestaurantLike(restId) {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${BASE_URL}/fav/?rest_id=${restId}`, {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });

  const data = await parseJsonOrNull(response);

  if (!response.ok) {
    throw new Error(data?.message || "찜 해제에 실패했습니다.");
  }

  return data;
}