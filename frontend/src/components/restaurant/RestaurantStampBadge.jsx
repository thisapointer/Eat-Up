import { getStampGradeByVisitCount } from "../../data/stampGradeData";
import "../../styles/RestaurantStampBadge.css";

function RestaurantStampBadge({ visitCount = 0 }) {
  const stampGrade = getStampGradeByVisitCount(visitCount);
  const isNotStarted = visitCount === 0;

  return (
    <div className="restaurant-stamp-badge">
      <img src={stampGrade.image} alt={stampGrade.name} />

      {!isNotStarted && (
        <span className="restaurant-stamp-count" style={{color: stampGrade.labelColor}}>
          {visitCount}번 방문
        </span>
      )}
    </div>
  );
}

export default RestaurantStampBadge;