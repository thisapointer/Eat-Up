import { useState } from "react";
import KakaoMap from "../components/map/KakaoMap";
import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import "../styles/MapsMain.css";
import MapFilterChips from "../components/map/MapFilterChips";

const handleFilterChange = (filters) => {
  console.log("선택된 필터:", filters);
};

function MapsMain() {
  const [currentView, setCurrentView] = useState("map");

  const handleSearch = (keyword) => {
    console.log("검색어:", keyword);
  };

  return (
    <main className="maps-main">
      <KakaoMap />

      <section className="maps-main-overlay" aria-label="지도 화면 조작">
        <MapViewToggle currentView={currentView} onChange={setCurrentView} />
        <MapSearchBar onSearch={handleSearch} />
        <MapFilterChips onChange={handleFilterChange} />
      </section>
    </main>
  );
}

export default MapsMain;