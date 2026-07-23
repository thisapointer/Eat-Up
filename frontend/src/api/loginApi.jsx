const BASE_URL = "http://localhost:8000";

async function parseJsonOrNull(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

//로그인 API POST 요청 함수
export async function loginUser(loginData) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  //응답 상태가 200번대가 아니면 에러
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    const error = new Error(
      errorData?.message || "로그인에 실패했습니다."
    );

    error.status = response.status;
    error.code = errorData?.code;

    throw error;
  }

  return parseJsonOrNull(response);
}