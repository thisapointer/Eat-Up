import { getRestaurantOpenText } from "../utils/restaurantTime";

const BASE_URL = "https://eat-up-96sa.onrender.com/api/v1";

// 응답 body가 비어 있거나 JSON이 아닐 수 있으므로 
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

// 마이페이지 정보 조회
// 닉네임, 아이디, 프로필 사진, 수저 등급, XP
export async function getUserInfo() {
  const accessToken = localStorage.getItem("accessToken");


  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await parseJsonOrNull(response);

  console.log("getUserInfo status:", response.status); //오류 수정용 (console 은 오류 수정 후 삭제 예정)
  console.log("getUserInfo response:", data);

  if (!response.ok) {
    const error = new Error(
      data?.message || "내 정보를 불러오지 못했습니다."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

//로그인 한 유저의 가 본 맛집 갯수 조회
export async function getVisitedRestCount() {
  const accessToken = localStorage.getItem("accessToken");


  const response = await fetch(`${BASE_URL}/cert/count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await parseJsonOrNull(response);

  console.log("getVisitedRestCount status:", response.status);
  console.log("getVisitedRestCount response:", data);

  if (!response.ok) {
    const error = new Error(
      data?.message || "가본 맛집 개수를 불러오지 못했습니다."
    );

    error.status = response.status;
    //error.code = data?.code;
    error.data = data;

    throw error;
  }

  if(typeof data === "number") {
    return data;
  }

  return data?.count ?? data?.total_count ?? data?.visitedRestCount ?? 0;
}

//유저가 인증한 식당 목록들을 전부 가져옴 (내림차순정리할 예정)
export async function getRestList() {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/cert/all`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await parseJsonOrNull(response);

  if (!response.ok) {
    const error = new Error(
      data?.message || "맛집 도장 순위를 불러오지 못했습니다."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  //응답이 배열이면 그대로 사용
  //배열 X -> map 오류 방지 위해 빈 배열 사용
  const certs = Array.isArray(data) ? data : [];

  return certs
    .map((cert) => {
      const restInfo = cert.rest_info ?? {};
      const todayHours = restInfo.today_hours;

      return {
        id: restInfo.id,
        name: restInfo.name ?? "식당 이름 없음",
        category: restInfo.category ?? "",
        info: getRestaurantOpenText(restInfo.today_hours),
        phone: restInfo.phone ?? "",
        address: restInfo.addr?.addr_name ?? "",
        img: restInfo.img ?? "",
        visitCount: cert.visit_count ?? 0,
        restInfo,
      };
    })
    .sort((a, b) => b.visitCount - a.visitCount);
}

