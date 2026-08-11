import React from "react";
import { getStampGradeByVisitCount } from "../../data/stampGradeData";
import "../../styles/certmotion/RestaurantInfoCard.css";

export default function RestaurantInfoCard({
  date,
  storeName,
  category,
  visitCount = 0,
}) {
  const stampGrade = getStampGradeByVisitCount(visitCount);

  return (
    <div className="card restaurant-card">
      <div className="store-info">
        <span className="store-date">{date}</span>

        <div className="store-title-wrap">
          <h1 className="store-name">{storeName}</h1>
          <span className="store-category">{category}</span>
        </div>
      </div>

      <div className="stamp-box main-stamp">
        <img
          src={stampGrade.image}
          alt={stampGrade.name}
          className="stamp-image"
        />

        {visitCount > 0 && (
          <div className="stamp-text-content">
            <span
              className="stamp-main-text"
              style={{ color: stampGrade.labelColor }}
            >
              {stampGrade.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}