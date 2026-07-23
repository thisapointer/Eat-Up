import { Link } from "react-router-dom";
import "../styles/FirstPage.css";
import FirstLogo from "../assets/firstlogo.svg";
import FirstText from "../assets/firsttext.svg";

// 문구, 로고 이미지, 버튼 라벨 교체
const firstPageData = {
    actions: [
        {
            label: "로그인",
            to: "/login",
            variant: "login",
        },
        {
            label: "회원가입",
            to: "/signup",
            variant: "signup",
        },
    ],
    creditLink: {
        label: "개발자 크레딧",
        to: "/dev-credit",
    },
};

function FirstPage() {
    const { logoText, title, brandName, actions, creditLink } = firstPageData;

    return (
        <main className="first-page">
            {/* 브랜드 소개 영역 */}
            <section className="first-page-hero" aria-labelledby="first-page-title">
                <img className="first-page-logo" src={FirstLogo} alt="서비스 로고" />
                <h1 id="frst-page-title" className="first-page-title">
                    <img src={FirstText} alt="맛집 도장깨기 서비스 EAT-UP" />
                </h1>
            </section>

            {/* 시작 액션 영역(로그인,회원가입,크레딧으로 이동) */}
            <section className="first-page-actions" aria-label="시작하기">
                <div className="first-page-action-list">
                {actions.map((action) => (
                    <Link
                    className={`first-page-action first-page-action--${action.variant}`}
                    key={action.to}
                    to={action.to}
                    >
                    {action.label}
                    </Link>
                ))}
                </div>

                <Link className="first-page-credit" to={creditLink.to}>
                {creditLink.label}
                </Link>
            </section>
        </main>
    );
}

export default FirstPage;
