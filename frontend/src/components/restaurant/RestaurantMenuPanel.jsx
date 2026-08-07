import MenuStampBadge from "./MenuStampBadge";
import "../../styles/RestaurantMenuPanel.css";
import { getMenuList } from "../../api/menuApi";
import { useEffect, useState } from "react";


function RestaurantMenuPanel({ restaurant }) {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async() => {
      const data = await getMenuList(restaurant.id);
      setMenus(Array.isArray(data) ? data : []);
    };

    if(restaurant?.id) {
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
              src={menu.img ?? ""}
              alt=""
            />

            <div className="restaurant-menu-info">
              <strong>{menu.name}</strong>
              <span>{menu.price}</span>
            </div>

            <MenuStampBadge count={menu.challengeCount ?? 0} />
          </article>
        ))}
      </div>
    </div>
  );
}

export default RestaurantMenuPanel;