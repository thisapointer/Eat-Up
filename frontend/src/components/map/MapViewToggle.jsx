import { NavLink } from "react-router-dom";
import "../../styles/MapViewToggle.css";

const viewTabs = [
  {
    label: "지도",
    to: "/map",
    iconClass: "map",
  },
  {
    label: "목록",
    to: "/list",
    iconClass: "list",
  },
];

function MapViewToggle() {
  return (
    <div className="map-view-toggle" role="navigation" aria-label="보기 전환">
      {viewTabs.map((tab) => (
        <NavLink
          className={({ isActive }) =>
            `map-view-toggle-button ${
              isActive ? "map-view-toggle-button--active" : ""
            }`
          }
          key={tab.to}
          to={tab.to}
          aria-label={`${tab.label} 보기`}
        >
          <span
            className={`map-view-toggle-icon map-view-toggle-icon--${tab.iconClass}`}
            aria-hidden="true"
          />
          <span className="sr-only">{tab.label}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default MapViewToggle;