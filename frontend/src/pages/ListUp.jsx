import MapViewToggle from "../components/map/MapViewToggle";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterChips from "../components/map/MapFilterChips";
import BottomNav from "../components/BottomNav";
import "../styles/ListUp.css";

function ListUp() {
  // 검색어 입력 후 엔터 / 검색 이벤트가 발생했을 때 실행
  const handleSearch = (keyword) => {
    console.log("검색어:", keyword);
  };

  // 필터 버튼이 선택/해제될 때 실행
  const handleFilterChange = (filters) => {
    console.log("선택된 필터:", filters);
  };

  return (
    <main className="list-page">
      {/* 목록 페이지 상단 공통 조작 영역 */}
      <section className="list-page-controls" aria-label="맛집 목록 조작">
        <MapViewToggle />
        <MapSearchBar onSearch={handleSearch} />
        <MapFilterChips onChange={handleFilterChange} />
      </section>

      <BottomNav />
    </main>
  );
}

export default ListUp;