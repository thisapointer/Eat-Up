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

//하단 시트 내 기록 탭
export async function getRestaurantMyRecord(restId) {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/cert?rest_id=${restId}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await parseJsonOrNull(response);

    if(!response.ok) {
        throw new Error("식당 인증 기록을 불러오지 못했습니다.");
    }

    if(response.status === 404) {
        return [];
    }

    return data;
}

//인증 등록하기 
export async function postCertRecord(restId, certRecordData) {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${BASE_URL}/cert?rest_id=${restId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(CertRecordData),
    });

    const data = await parseJsonOrNull(response);

    if(!response.ok) {
        const errorData = await response.json().catch(() => null);

        const error = new Error(
            errorData?.message || "인증기록 등록에 실패했습니다."
        );

        error.status = response.status;
        error.code = data?.code;
        error.data = data;
        throw error;
    }

    return data;
}