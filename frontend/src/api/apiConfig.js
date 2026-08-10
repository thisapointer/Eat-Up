const apiOrigin = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

if (!apiOrigin) {
  throw new Error("VITE_API_BASE_URL 환경변수가 설정되지 않았습니다.");
}

export const API_ORIGIN = apiOrigin;
export const API_V1_URL = `${apiOrigin}/api/v1`;
export const API_V2_URL = `${apiOrigin}/api/v2`;