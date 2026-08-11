import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../styles/AccountEdit.css";
import { updateMyUserInfo, getUserInfo } from "../api/mypageApi";

function NicknameEditPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo();
        setNickname(userData?.nickname ?? "");
      } catch (error) {
        console.error("유저 정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname || trimmedNickname.length > 20) return;

    try {
      setIsSubmitting(true);
      await updateMyUserInfo({
        nickname: trimmedNickname,
      });

      navigate("/mypage/profile", { replace: true });
    } catch(error) {
      console.error("닉네임 변경 실패: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="account-edit-page">
      <header className="account-edit-header">
        <BackButton />
        <h1>닉네임 변경</h1>
      </header>

      <form className="account-edit-form" onSubmit={handleSubmit}>
        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          value={nickname}
          maxLength={20}
          placeholder="새 닉네임"
          onChange={(event) => setNickname(event.target.value)}
        />

        <p className="account-edit-rule">
          최대 20자까지 입력할 수 있습니다.
        </p>

        <button disabled={!nickname.trim() || isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "변경 중..." : "닉네임 변경"}
        </button>
      </form>
    </main>
  );
}

export default NicknameEditPage;