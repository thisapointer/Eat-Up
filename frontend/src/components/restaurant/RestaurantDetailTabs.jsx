import { useState } from "react";
import "../../styles/RestaurantDetailTabs.css";

function RestaurantDetailTabs({ restaurant }) {
  const [activeTab, setActiveTab] = useState("records");

  return (
    <section className="restaurant-detail-tabs">
      <div className="restaurant-detail-tab-list" role="tablist">
        <button
          className={activeTab === "records" ? "is-active" : ""}
          type="button"
          onClick={() => setActiveTab("records")}
        >
          내 기록
        </button>

        <button
          className={activeTab === "menu" ? "is-active" : ""}
          type="button"
          onClick={() => setActiveTab("menu")}
        >
          메뉴
        </button>
      </div>

      {activeTab === "records" ? (
        <div className="restaurant-record-panel">
          <div className="restaurant-total-card">
            <strong>총 지출</strong>
            <p>1,000,000원</p>
          </div>

          <h3>2026년 6월</h3>
          <article className="restaurant-record-card">
            <strong>6월 5일</strong>
            <span>15,000원</span>
            <ul>
              <li>닭쌈밥 정식 9,000원</li>
              <li>튀김 4,000원</li>
              <li>콜라 2,000원</li>
            </ul>
          </article>
        </div>
      ) : (
        <div className="restaurant-menu-panel">
          <h3>메인 메뉴</h3>
          <article className="restaurant-menu-card">
            <strong>닭쌈밥 정식</strong>
            <span>9,000원</span>
          </article>

          <article className="restaurant-menu-card">
            <strong>양념 닭쌈밥 정식</strong>
            <span>9,000원</span>
          </article>
        </div>
      )}
    </section>
  );
}

export default RestaurantDetailTabs;