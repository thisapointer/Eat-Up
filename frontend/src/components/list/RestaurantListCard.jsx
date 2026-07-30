import RestaurantStampBadge from "../restaurant/RestaurantStampBadge";

function RestaurantListCard({ restaurant, onClick }) {
  const name = restaurant.name;
  const category = restaurant.category;
  const isOpen = restaurant.isOpen ?? restaurant.is_open ?? true;

  const images = getRestaurantImages(restaurant);
  const visitCount = restaurant.visitCount ?? restaurant.visit_count ?? 0;

  return (
    <article className="restaurant-list-card">
      <button
        className="restaurant-list-card-button"
        type="button"
        onClick={onClick}
      >
        <span className="restaurant-list-heart" aria-hidden="true">
          ♡
        </span>

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
      </button>
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