import { useState } from "react";
import RestaurantRecordPanel from "./RestaurantRecordPanel";
import RestaurantMenuPanel from "./RestaurantMenuPanel";
import "../../styles/RestaurantDetailTabs.css";

function RestaurantDetailTabs({ restaurant }) {
  // 현재 선택된 탭입니다. "records"면 내 기록, "menu"면 메뉴를 보여줍니다.
  const [activeTab, setActiveTab] = useState("records");

  return (
    <section className="restaurant-detail-tabs" aria-label="식당 상세 정보">
      {/* 내 기록 / 메뉴 탭 버튼 영역입니다. */}
      <div className="restaurant-detail-tab-list" role="tablist">
        <button
          className={`restaurant-detail-tab ${
            activeTab === "records" ? "restaurant-detail-tab--active" : ""
          }`}
          type="button"
          onClick={() => setActiveTab("records")}
        >
          내 기록
        </button>

        <button
          className={`restaurant-detail-tab ${
            activeTab === "menu" ? "restaurant-detail-tab--active" : ""
          }`}
          type="button"
          onClick={() => setActiveTab("menu")}
        >
          메뉴
        </button>
      </div>

      {/* 선택된 탭에 따라 아래 내용을 바꿉니다. */}
      {activeTab === "records" ? (
        <RestaurantRecordPanel restaurant={restaurant} />
      ) : (
        <RestaurantMenuPanel restaurant={restaurant} />
      )}
    </section>
  );
}

export default RestaurantDetailTabs;