import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";
import { deleteMyAccount, getUserInfo } from "../api/mypageApi";

import "../styles/DeleteAccountPage.css";

function DeleteAccountPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsUserLoading(true);
        setErrorMessage("");

        const data = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error("내 정보 조회 실패:", error);
        setErrorMessage("사용자 정보를 불러오지 못했습니다.");
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // 백엔드가 비밀번호를 요구한다면 password도 API에 전달해야 합니다.
      await deleteMyAccount(password);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("userId");

      navigate("/start", { replace: true });
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <main className="delete-account-page">
      <header className="delete-account-header">
        <BackButton />
        <h1>회원탈퇴</h1>
      </header>

      <div className="delete-account-form">
        <label htmlFor="delete-user-id">아이디</label>
        <input
          id="delete-user-id"
          value={
            isUserLoading
              ? "불러오는 중..."
              : userInfo?.user_id ?? ""
          }
          disabled
        />

        <label htmlFor="delete-password">비밀번호</label>
        <input
          id="delete-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호 확인"
          autoComplete="current-password"
        />

        {errorMessage && (
          <p className="delete-account-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          className="delete-account-submit"
          disabled={!password || isUserLoading || !userInfo ||isSubmitting}
          onClick={() => setIsConfirmOpen(true)}
        >
          {isSubmitting ? "처리 중..." : "회원탈퇴"}
        </button>
      </div>

      {isConfirmOpen && (
        <div
          className="delete-account-backdrop"
          role="presentation"
          onClick={() => setIsConfirmOpen(false)}
        >
          <section
            className="delete-account-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p id="delete-modal-title">
              정말 탈퇴하시겠습니까?
            </p>

            <div>
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
              >
                닫기
              </button>

              <button
                type="button"
                onClick={handleDelete}
              >
                확인
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default DeleteAccountPage;