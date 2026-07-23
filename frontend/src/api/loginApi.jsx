const BASE_URL = "http://localhost:8000";

// 로그인 API POST 요청 함수
export async function loginUser(loginData) {
  const formData = new FormData();

  formData.append("username", loginData.username);
  formData.append("password", loginData.password);

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",

    // FormData를 보낼 때는 Content-Type을 직접 쓰지 X
    body: formData,
  });

  const data = await parseJsonOrNull(response);


  //응답 상태가 200번대가 아니면 에러
  if (!response.ok) {
    const error = new Error(
      errorData?.message || "로그인에 실패했습니다."
    );

    error.status = response.status;
    error.code = data?.code;

    throw error;
  }

  return data;