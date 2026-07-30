const BASE_URL = "http://localhost:8000/api/v1";

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

  console.log("유저 가본맛집 URL:", `${BASE_URL}/cert/count`);
  console.log("getVisitedRestCount token:", accessToken);


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
    error.code = data?.code;
    error.data = data;

    throw error;
  }

  return data;
}

//유저가 인증한 식당 목록들을 전부 가져옴 (내림차순정리할 예정)
/*export async function getRestList() {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/users/${user_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await parseJsonOrNull(response);

  if (!response.ok) {
    const error = new Error(
      data?.message || "마이페이지 정보를 불러오지 못했습니다."
    );

    error.status = response.status;
    error.code = data?.code;
    error.data = data;

    throw error;
  }

  return data;
}*/