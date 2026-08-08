import React from 'react';
import visitStampSvg from '../../assets/visit-stamp-5.svg';
import '../../styles/certmotion/RestaurantInfoCard.css';

// 매장 방문 정보 및 도장 표시 카드 컴포넌트
export default function RestaurantInfoCard({ date, storeName, category, totalVisitCount }) {
  return (
    <div className="card restaurant-card">
      {/* 방문 날짜 및 매장 기본 정보 */}
      <div className="store-info">
        <span className="store-date">{date}</span>
        <div className="store-title-wrap">
          <h1 className="store-name">{storeName}</h1>
          <span className="store-category">{category}</span>
        </div>
      </div>

      {/* 방문 횟수 도장 영역 */}
      <div className="stamp-box main-stamp">
        <img src={visitStampSvg} alt="방문 도장" className="stamp-image" />
        <div className="stamp-text-content">
          <span className="stamp-main-text">{totalVisitCount}</span>
        </div>
      </div>
    </div>
  );
}