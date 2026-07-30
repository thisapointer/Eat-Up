function RestaurantStampBadge({ visitCount = 0 }) {
  return (
    <div className="restaurant-stamp-badge">
      {visitCount >= 100 ? "100번 방문" : "미도전"}
    </div>
  );
}

export default RestaurantStampBadge;