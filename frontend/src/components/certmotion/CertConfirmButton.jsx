import React from "react";
import "../../styles/certmotion/CertConfirmButton.css";

/* 인증 확인 버튼 컴포넌트 */
export default function CertConfirmButton({ onClick }) {
  return (
    <button
      type="button"
      className="cert-confirm-button"
      onClick={onClick}
    >
      확인
    </button>
  );
}