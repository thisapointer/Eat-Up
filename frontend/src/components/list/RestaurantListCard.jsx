import RestaurantStampBadge from "../restaurant/RestaurantStampBadge";

import HeartOnIcon from "../../assets/fav_btn_selected.svg";
import HeartOffIcon from "../../assets/fav_btn.svg";

function RestaurantListCard({ restaurant, onClick, onLikeToggle }) {
  const name = restaurant.name;
  const category = restaurant.category;
  const isOpen = restaurant.isOpen ?? restaurant.is_open ?? true;

  const images = getRestaurantImages(restaurant);
  const visitCount = restaurant.visitCount ?? restaurant.visit_count ?? 0;
  const isLiked = restaurant.isLiked ?? restaurant.is_liked ?? false;

  return (
    <article
      className="restaurant-list-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* 하트는 카드 안에 있지만, 카드 클릭과 별도로 동작합니다. */}
      <button
        className="restaurant-list-card-like"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onLikeToggle?.(restaurant);
        }}
        aria-label={isLiked ? "찜 해제" : "찜하기"}
      >
        <img
          src={isLiked ? HeartOnIcon : HeartOffIcon}
          alt=""
          aria-hidden="true"
        />
      </button>

      <div className="restaurant-list-card-info">
        <h2>{name}</h2>
        <span>{category}</span>
        <p>{isOpen ? "영업 중" : "영업 종료"}</p>
      </div>

      <RestaurantStampBadge visitCount={visitCount} />

      <div className="restaurant-list-images" aria-hidden="true">
        {images.map((imageSrc, index) => (
          <img
            key={`${restaurant.id}-${imageSrc}-${index}`}
            src={imageSrc}
            alt=""
          />
        ))}
      </div>
    </article>
  );
}

function getRestaurantImages(restaurant) {
  if (Array.isArray(restaurant.images)) {
    return restaurant.images.slice(0, 3);
  }

  if (restaurant.img) {
    return [restaurant.img, restaurant.img, restaurant.img];
  }

  return [];
}

export default RestaurantListCard;