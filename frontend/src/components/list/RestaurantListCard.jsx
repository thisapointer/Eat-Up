import RestaurantStampBadge from "../restaurant/RestaurantStampBadge";

import HeartOnIcon from "../../assets/fav_btn_selected.svg";
import HeartOffIcon from "../../assets/fav_btn.svg";

import { getRestaurantOpenText } from "../../utils/restaurantTime";

import { useNavigate } from "react-router-dom";

function RestaurantListCard({ restaurant, onClick, onLikeToggle }) {
  const name = restaurant.name;
  const category = restaurant.category;
  const openText = getRestaurantOpenText(
    restaurant.today_hours ?? restaurant.restInfo?.today_hours,
    restaurant.today_breaks ?? restaurant.restInfo?.today_breaks
  );
  const images = getRestaurantImages(restaurant);
  const visitCount = restaurant.visitCount ?? restaurant.visit_count ?? 0;
  const isLiked = restaurant.isLiked ?? restaurant.is_liked ?? false;
  const navigate = useNavigate();

  return (
    <article
      className="restaurant-list-card"
      onClick={() =>
        navigate("/map", {
          state: {
            selectedRestaurant: restaurant.restInfo ?? restaurant,
            sheetMode: "expanded",
          },
        })
      }
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
        <p>{openText}</p>
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