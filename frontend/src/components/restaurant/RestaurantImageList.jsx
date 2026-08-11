import { useEffect, useState } from "react";
import { getMenuList } from "../../api/menuApi";

function RestaurantImageList({ restaurant, className="restaurant-image-list", }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchMenuImages = async () => {
      try {
        setIsLoading(true);

        const menuData = await getMenuList(restaurant.id);
        const menus = Array.isArray(menuData) ? menuData : [];

        // 이미지가 등록된 메뉴 중 앞의 3개만 사용
        const menuImages = menus
          .map((menu) => menu.img)
          .filter(Boolean)
          .slice(0, 3);

        if (!isCancelled) {
          setImages(menuImages);
        }
      } catch (error) {
        console.error("대표 메뉴 이미지 조회 실패:", error);

        if (!isCancelled) {
          setImages(restaurant.img ? [restaurant.img] : []);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    if (restaurant?.id) {
      fetchMenuImages();
    }

    return () => {
      isCancelled = true;
    };
  }, [restaurant?.id, restaurant?.img]);

  if (isLoading) {
    return (
      <p className={`${className} restaurant-image-message`}>
        대표 메뉴를 불러오는 중입니다.
      </p>
    );
  }

  if (!images.length) {
    return null;
  }

  return (
    <div className={className} aria-label="대표 메뉴 사진">
      {images.map((imageSrc, index) => (
        <img
          key={`${restaurant.id}-${imageSrc}-${index}`}
          src={imageSrc}
          alt={`${restaurant.name} 대표 메뉴 ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default RestaurantImageList;