import { useState } from "react";
import "../../styles/MapFilterChips.css";

import FavIcon from "../../assets/fav.svg";
import FavActiveIcon from "../../assets/fav-active.svg";
import UnvisitedIcon from "../../assets/unvisited.svg";
import UnvisitedActiveIcon from "../../assets/unvisited-active.svg";
import OpenIcon from "../../assets/open.svg";
import OpenActiveIcon from "../../assets/open-active.svg";

// 필터 버튼 데이터
// icon: 선택 안 됐을 때 SVG
// activeIcon: 선택됐을 때 SVG
const filterItems = [
  {
    label: "찜한 맛집",
    value: "liked",
    icon: FavIcon,
    activeIcon: FavActiveIcon,
  },
  {
    label: "미방문",
    value: "unvisited",
    icon: UnvisitedIcon,
    activeIcon: UnvisitedActiveIcon,
  },
  {
    label: "영업 중",
    value: "open",
    icon: OpenIcon,
    activeIcon: OpenActiveIcon,
  },
];

function MapFilterChips({ onChange }) {
  // 현재 선택된 필터 값을 배열로 저장
  const [selectedFilters, setSelectedFilters] = useState([]);

  // 필터 버튼을 눌렀을 때 선택/해제를 처리
  const handleToggleFilter = (filterValue) => {
    const isAlreadySelected = selectedFilters.includes(filterValue);

    // 선택된 버튼이면 배열에서 제거, 선택 안 된 버튼이면 배열에 추가
    const nextFilters = isAlreadySelected
      ? selectedFilters.filter((value) => value !== filterValue)
      : [...selectedFilters, filterValue];

    // 내 컴포넌트 상태 변경
    setSelectedFilters(nextFilters);

    // 부모 컴포넌트(MapsMain)에도 변경된 필터 배열 전달
    onChange?.(nextFilters);
  };

  return (
    <div className="map-filter-chips" aria-label="맛집 필터">
      {filterItems.map((filter) => {
        const isSelected = selectedFilters.includes(filter.value);

        return (
          <button
            className={`map-filter-chip ${
              isSelected ? "map-filter-chip--selected" : ""
            }`}
            type="button"
            key={filter.value}
            onClick={() => handleToggleFilter(filter.value)}
            aria-pressed={isSelected}
          >
            <img
              className="map-filter-chip-icon"
              src={isSelected ? filter.activeIcon : filter.icon}
              alt=""
              aria-hidden="true"
            />

            <span className="map-filter-chip-label">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default MapFilterChips;