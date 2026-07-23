import { NavLink } from "react-router-dom";
import "../styles/BottomNav.css";

const bottomNavItems = [
  {
    label: "맛집 탐색",
    to: "/map",
    icon: "spoon",
  },
  {
    label: "마이페이지",
    to: "/mypage",
    icon: "person",
  },
];

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="하단 주요 메뉴">
      {bottomNavItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "bottom-nav-item--active" : ""}`
          }
          key={item.to}
          to={item.to}
        >
          <span
            className={`bottom-nav-icon bottom-nav-icon--${item.icon}`}
            aria-hidden="true"
          />
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
