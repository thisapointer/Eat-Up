import "../styles/SplashPage.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/backbutton.png"; //로고 이미지 여기에 

// 스플래시 문구/로고 해당 부분 수정
const splashPageData = {
  logoImage,
  logoAlt: "EAT-UP 로고",
  title: "맛집 도장깨기 서비스",
  brandName: "EAT-UP",
  duration: 2000,
  nextPath: "/start",
};

function SplashPage() {
  const navigate = useNavigate();
  const { logoImage, logoAlt, title, brandName, duration, nextPath } = splashPageData;

  useEffect(() => {
    const timerId = setTimeout(() => {
      navigate(nextPath);
    }, duration);

    return () => {
      clearTimeout(timerId);
    };
  }, [navigate, duration, nextPath]);

  return (
    <main className="splash-page">
      <div className="splash-page-logo splash-logo-pop" aria-label={logoAlt}>
        <img src={logoImage} alt={logoAlt} />
      </div>

      <h1 className="splash-page-title">
        <span>{title}</span>
        <strong>{brandName}</strong>
      </h1>
    </main>
  );
}

export default SplashPage;