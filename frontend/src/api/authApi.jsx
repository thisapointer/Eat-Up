// 백엔드 API 기본 주소
// .env 파일로 분리하면 환경마다 쉽게 바꾸기 가능
const BASE_URL = "https://eat-up-96sa.onrender.com/api/v1"; //백엔드 port num

// 아이디 중복 확인 API 요청 함수
export async function checkUserId(userId) {
    // userId에 특수문자나 공백이 들어갈 수 있으므로 encodeURIComponent로 변환
    const encodedUserId = encodeURIComponent(userId);

    //아이디 중복 확인 API로 GET 요청 보냄
    const response = await fetch(
        `${BASE_URL}/users/check?user_id=${encodedUserId}`,
        {
            method: "GET",
        }
    );

    //응답 상태가 200번대가 아니면 에러
    if (!response.ok) {
        throw new Error("아이디 중복 확인에 실패했습니다.");
    }

    // 백엔드가 보내준 JSON 응답을 JS 객체로 변환해서 반환
    return response.json(); 
}

// 회원가입 API 요청 함수
// signUpData - signUp.jsx에서 만든 requestBody
export async function signUpUser(signUpData) {
    // 회원가입 API에 POST 요청 보냄
    const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",

        // JSON 데이터 보냄
        headers: {
            "Content-Type": "application/json",
        },

        // JS 객체를 JSON 문자열로 변환 -> request body에 담음
        body: JSON.stringify(signUpData),
    });

    // 응답 state false -> error를 만들어서 signUp.jsx로 넘김
    if (!response.ok) {
        // 백엔드가 JSON 형태의 에러 메시지를 줄 가능성 있기 때문에 읽음
        // JSON이 없거나 파싱에 실패하면 null 처리
        const errorData = await response.json().catch(() => null);

        // Error 객체 - message에 넣음
        const error = new Error(
            errorData?.message || "회원가입에 실패했습니다."
        );

        // signUp.jsx에서 status 값으로 400, 409 등을 구분할 수 있게 붙여둠
        error.status = response.status;

        // 백엔드가 code를 내려주는 경우를 대비해 code도 붙임
        error.code = errorData?.code;

        // catch문에서 처리할 수 있도록 에러
        throw error;
    }

    // 성공 응답을 JSON으로 변환해 반환
    return response.json();
}