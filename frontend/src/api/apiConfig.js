const API_ORIGIN = import.meta.env.VITE_API_BASE_URL;

if (!API_ORIGIN) {
  throw new Error(
    "VITE_API_BASE_URL 환경변수가 설정되지 않았습니다."
  );
}

export const API_V1_URL = `${API_ORIGIN}/api/v1`;
export const API_V2_URL = `${API_ORIGIN}/api/v2`;