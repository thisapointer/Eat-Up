import RestaurantImageList from "./RestaurantImageList";
import RestaurantStampBadge from "./RestaurantStampBadge";
import "../../styles/RestaurantSummary.css";

function RestaurantSummary({ restaurant }) {
  const name = restaurant.name;
  const category = restaurant.category;
  const info = restaurant.info ?? "영업 정보 없음";
  const phone = restaurant.phone ?? "";
  const address = restaurant.addr?.addr_name ?? restaurant.address ?? "";
  const visitCount = restaurant.visitCount ?? restaurant.visit_count ?? 0;

  return (
    <section className="restaurant-summary" aria-label="식당 요약 정보">
      <div className="restaurant-summary-top">
        <button
          className="restaurant-summary-like"
          type="button"
          aria-label="찜하기"
        >
          ♥
        </button>

        <button className="restaurant-summary-cert" type="button">
          인증하기
        </button>
      </div>

      <div className="restaurant-summary-main">
        <div className="restaurant-summary-info">
          <h2>
            {name}
            <span>{category}</span>
          </h2>

          <p>{info}</p>

          {phone && <p>☎ {phone}</p>}
          {address && <p>⌖ {address}</p>}
        </div>

        <RestaurantStampBadge visitCount={visitCount} />
      </div>

      <RestaurantImageList restaurant={restaurant} />
    </section>
  );
}

export default RestaurantSummary;