import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import BackButton from "../components/BackButton";
import "../styles/ProfileEditPage.css";
import ProfilePhoto from "../assets/profile_photo.svg";
import { getUserInfo } from "../api/mypageApi";


function ProfileEditPage() {
  const navigate = useNavigate();


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
  
  const profile = {
    nickname: userInfo?.nickname ?? "닉네임",
    userId: userInfo?.user_id ?? "",
    profileImage: userInfo?.profile_img ?? "",
  };

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
          <img
            src={ProfilePhoto}
            alt="기본 프로필"
          />
        </div>

        <button className="profile-edit-name-button" type="button">
          <strong>{profile.nickname}</strong>
          <span aria-hidden="true">›</span>
        </button>

        <p>{profile.userId}</p>
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

        <Link to="/mypage/delete" className="profile-edit-menu-item" type="button">
          회원탈퇴
        </Link>
      </section>
    </main>
  );
}

export default ProfileEditPage;