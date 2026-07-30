function RestaurantImageList({ restaurant }) {
  const images = getImages(restaurant);

  if (!images.length) {
    return null;
  }

  return (
    <div className="restaurant-image-list" aria-label="식당 사진">
      {images.map((imageSrc, index) => (
        <img
          key={`${restaurant.id}-${imageSrc}-${index}`}
          src={imageSrc}
          alt=""
        />
      ))}
    </div>
  );
}

function getImages(restaurant) {
  if (Array.isArray(restaurant.images)) {
    return restaurant.images.slice(0, 3);
  }

  if (restaurant.img) {
    return [restaurant.img, restaurant.img, restaurant.img];
  }

  return [];
}

export default RestaurantImageList;