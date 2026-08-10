import { useState } from "react";
import "../../styles/MapSearchBar.css";

function MapSearchBar({ onSearch, onClear }) {
  const [keyword, setKeyword] = useState("");

  const handleChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    onSearch?.(trimmedKeyword);
  };


  // X 버튼을 눌렀을 때 검색어를 비웁니다.
  const handleClear = () => {
    setKeyword("");
    onClear?.();
  };

  return (
    <form className="map-search-bar" role="search" onSubmit={handleSubmit}>
      <span className="map-search-icon" aria-hidden="true" />

      <input
        type="search"
        value={keyword}
        onChange={handleChange}
        placeholder="맛집 검색"
        aria-label="맛집 검색"
      />

      {/* 검색어가 있을 때만 X 버튼 */}
      {keyword && (
        <button
          className="map-search-clear"
          type="button"
          onClick={handleClear}
          aria-label="검색어 지우기"
        >
          <span aria-hidden="true" />
        </button>
      )}
    </form>
  );
}

export default MapSearchBar;