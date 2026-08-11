import MenuStampBadge from "./MenuStampBadge";
import "../../styles/RestaurantMenuPanel.css";
import { getMenuList } from "../../api/menuApi";
import { getRestaurantMyRecord } from "../../api/certApi";
import { useEffect, useState } from "react";

function getMenuChallengeCountMap(recordData) {
  const menuCountMap = {};
  const records = Array.isArray(recordData)
    ? recordData
    : recordData?.certs ?? [];

  records.forEach((record) => {
    record.menu_ids?.forEach((menuId) => {
      menuCountMap[menuId] = (menuCountMap[menuId] ?? 0) + 1;
    });
  });

  return menuCountMap;
}

function RestaurantMenuPanel({ restaurant }) {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!restaurant?.id) {
      setMenus([]);
      setIsLoading(false);
      return;
    }

    const fetchMenus = async () => {
      try {
        setIsLoading(true);

        // 메뉴 목록과 해당 식당 인증 기록을 함께 조회합니다.
        const [menuData, recordData] = await Promise.all([
          getMenuList(restaurant.id),
          getRestaurantMyRecord(restaurant.id),
        ]);

        const menuList = Array.isArray(menuData)
          ? menuData
          : [];

        // 인증 기록의 menu_ids를 이용해 메뉴별 횟수를 계산합니다.
        const menuCountMap =
          getMenuChallengeCountMap(recordData);

        const menusWithCount = menuList.map((menu) => ({
          ...menu,
          challengeCount: menuCountMap[menu.id] ?? 0,
        }));

        setMenus(menusWithCount);
      } catch (error) {
        console.error("메뉴 및 도장 정보 조회 실패:", error);
        setMenus([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, [restaurant?.id]);

  return (
    <div className="restaurant-menu-panel">
      <h3>메뉴</h3>

      {/* API 요청 중 표시 */}
      {isLoading && (
        <p className="restaurant-menu-loading">
          메뉴를 불러오는 중입니다.
        </p>
      )}

      {!isLoading && menus.length === 0 && (
        <p className="restaurant-menu-empty">
          등록된 메뉴가 없습니다.
        </p>
      )}

      {!isLoading && menus.length > 0 && (
        <div className="restaurant-menu-list">
          {menus.map((menu) => (
            <article className="restaurant-menu-card" key={menu.id}>
              <img
                className="restaurant-menu-image"
                src={menu.img}
                alt=""
              />

              <div className="restaurant-menu-info">
                <strong>{menu.name}</strong>
                <span>{menu.price?.toLocaleString?.() ?? menu.price}원</span>
              </div>

              <MenuStampBadge count={menu.challengeCount ?? 0} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantMenuPanel;