import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../styles/ProfileEditPage.css";

// 아직 API 연동 전이므로 화면에 보여줄 기본값입니다.
// 나중에 getUserInfo API 응답으로 교체하면 됩니다.
const profileFallbackData = {
  nickname: "이서준",
  userId: "sin390is0.5",
  profileImage: "",
};

function ProfileEditPage() {
  const navigate = useNavigate();

  // 로그아웃 버튼을 눌렀을 때 실행됩니다.
  const handleLogout = () => {
    // 로그인할 때 저장했던 토큰과 유저 정보를 삭제합니다.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  

    // 로그아웃 후 시작 페이지로 이동합니다.
    navigate("/start");
  };

  return (
    <main className="profile-edit-page">
      {/* 상단 헤더 영역입니다. */}
      <header className="profile-edit-header">
        <BackButton />
        <h1>내 정보</h1>
        <span aria-hidden="true" />
      </header>

      {/* 프로필 요약 영역입니다. */}
      <section className="profile-edit-profile" aria-label="프로필 정보">
        <div className="profile-edit-avatar" aria-hidden="true">
          {profileFallbackData.profileImage ? (
            <img src={profileFallbackData.profileImage} alt="" />
          ) : (
            <span />
          )}
        </div>

        <button className="profile-edit-name-button" type="button">
          <strong>{profileFallbackData.nickname}</strong>
          <span aria-hidden="true">›</span>
        </button>

        <p>{profileFallbackData.userId}</p>
      </section>

      {/* 설정 메뉴 영역입니다. */}
      <section className="profile-edit-menu" aria-label="내 정보 메뉴">
        <button className="profile-edit-menu-item" type="button">
          비밀번호 변경
        </button>

        <button
          className="profile-edit-menu-item"
          type="button"
          onClick={handleLogout}
        >
          로그아웃
        </button>

        <button className="profile-edit-menu-item" type="button">
          회원탈퇴
        </button>
      </section>
    </main>
  );
}

export default ProfileEditPage;