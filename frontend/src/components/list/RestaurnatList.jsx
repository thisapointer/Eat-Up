import RestaurantListCard from "./RestaurantListCard";
import "../../styles/RestaurantListCard.css";

function RestaurantList({ restaurants, onRestaurantClick, onLikeToggle }) {
  if (!restaurants.length) {
    return (
      <p className="restaurant-list-empty">
        표시할 식당이 없습니다.
      </p>
    );
  }

  return (
    <section className="restaurant-list" aria-label="맛집 목록">
      {restaurants.map((restaurant) => (
        <RestaurantListCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={() => onRestaurantClick(restaurant)}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </section>
  );
}

export default RestaurantList;