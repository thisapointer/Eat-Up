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

  useEffect(() => {
    const fetchMenus = async () => {
      // 1. 가게 전체 메뉴
      const menuData = await getMenuList(restaurant.id);

      // 2. 내가 이 가게에서 인증한 기록
      const recordData = await getRestaurantMyRecord(restaurant.id);

      // 3. menu_id별 인증 횟수 계산
      const menuCountMap = getMenuChallengeCountMap(recordData);


      // 4. 전체 메뉴에 인증 횟수 붙이기
      const menusWithCount = menuData.map((menu) => ({
        ...menu,
        challengeCount: menuCountMap[menu.id] ?? 0,
      }));

      setMenus(menusWithCount);
    };

    if (restaurant?.id) {
      fetchMenus();
    }
  }, [restaurant?.id]);

  return (
    <div className="restaurant-menu-panel">
      <h3>메뉴</h3>

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

            <MenuStampBadge count={menu.challengeCount} />
          </article>
        ))}
      </div>
    </div>
  );
}

export default RestaurantMenuPanel;