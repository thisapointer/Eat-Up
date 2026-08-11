import React from 'react';
import menuStampSvg from '../../assets/menu-stamp-1.svg';
import '../../styles/certmotion/MenuListCard.css';


// 메뉴 항목 카드 컴포넌트
export default function MenuListCard({ title, price, count, imgUrl, index }) {
  return (
    <div 
      className="menu-list-card-item" 
      style={{ '--index': index }}
    >
      {/* 왼쪽: 메뉴 이미지 및 기본 정보 */}
      <div className="menu-left">
        <img 
          src={imgUrl || DEFAULT_IMAGE} 
          alt={title} 
          className="menu-image" 
        />
        <div className="menu-text">
          <h3 className="menu-title">{title}</h3>
          <p className="menu-price">{price}</p>
        </div>
      </div>

      {/* 오른쪽: 주문 횟수 도장 영역 */}
      <div className="stamp-box menu-stamp">
        <img src={menuStampSvg} alt="메뉴 도장" className="stamp-image" />
        <div className="stamp-text-content">
          <span className="stamp-count">{count}</span>
        </div>
      </div>
    </div>
  );
}