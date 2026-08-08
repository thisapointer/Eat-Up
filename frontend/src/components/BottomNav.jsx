import { NavLink, useLocation } from "react-router-dom";
import "../styles/BottomNav.css";

// 하단 탭 정보
// activePaths는 이 탭이 선택 상태가 되어야 하는 URL 목록
const bottomNavItems = [
  {
    label: "맛집 탐색",
    to: "/map",
    activePaths: ["/map", "/list"],
    icon: "spoon",
  },
  {
    label: "마이페이지",
    to: "/mypage",
    activePaths: ["/mypage"],
    icon: "person",
  },
];

function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="하단 주요 메뉴">
      {bottomNavItems.map((item) => {
        // 현재 URL이 activePaths 중 하나로 시작하면 선택 상태로 처리합니다.
        const isActive = item.activePaths.some((path) =>
          location.pathname.startsWith(path)
        );

        return (
          <NavLink
            className={`bottom-nav-item ${
              isActive ? "bottom-nav-item--active" : ""
            }`}
            key={item.to}
            to={item.to}
          >
            <span
              className={`bottom-nav-icon bottom-nav-icon--${item.icon}`}
              aria-hidden="true"
            />
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomNav;