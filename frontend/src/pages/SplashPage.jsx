import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplashLogo from "../assets/splashlogo.svg";
import SplashText from "../assets/splashtext.svg";
import "../styles/SplashPage.css";

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 스플래쉬 애니메이션이 끝난 뒤 시작 페이지로 이동
    const timer = setTimeout(() => {
      navigate("/start");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash-page">
      <img
        className="splash-logo"
        src={SplashLogo}
        alt="EAT-UP 로고"
      />

      <img
        className="splash-text"
        src={SplashText}
        alt="맛집 도장깨기 서비스 EAT-UP"
      />
    </main>
  );
}

export default SplashPage;