import LaurelLeft from "../../assets/laurel-left.svg";
import LaurelRight from "../../assets/laurel-right.svg";
import ReceiptIcon from "../../assets/receipt.svg";
import "../../styles/RestaurantRecordPanel.css";
import { getRestaurantMyRecord } from "../../api/certApi";
import { useEffect, useState } from "react";


function RestaurantRecordPanel({ restaurant }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async() => {
      const data = await getRestaurantMyRecord(restaurant.id);
      setRecords(Array.isArray(data) ? data : []);
    };

    if(restaurant?.id) {
      fetchRecords();
    }
  }, [restaurant?.id]);

  const hasRecords = records.length > 0;

  function formatWon(price) {
    const numberPrice = Number(price);

    if(!numberPrice) {
      return "0원";
    }

    return `${numberPrice.toLocaleString()}원`;
  }

  const totalPriceText = hasRecords ? formatWon(restaurant.totalPrice) : "0원"; //총 가격

  return (
    <div className="restaurant-record-panel">
      {/* 총 지출 카드입니다. */}
      <section className="restaurant-total-card" aria-label="총 지출">
        <img src={LaurelLeft} alt="" aria-hidden="true" />
        <div>
          <strong>총 지출</strong>
          <p>{totalPriceText}</p>
        </div>
        <img src={LaurelRight} alt="" aria-hidden="true" />
      </section>

      {/*인증 기록이 없을 때 보여주는 문구 */}
      {!hasRecords && (
        <p className="restaurant-record-empty">
          가게를 방문해서 인증 기록을 추가해보세요!
        </p>
      )}

      {/* 월별 방문 기록입니다. */}
      {records.map((record) => (
        <section className="restaurant-record-month" key={record.id}>
          <h3>{record.month}</h3>

          <article className="restaurant-record-card">
            <div className="restaurant-record-card-header">
              <strong>{record.date}</strong>

              <span>
                <img src={ReceiptIcon} alt="" aria-hidden="true" />
                {record.totalPrice}
              </span>
            </div>

            <ul>
              {record.menus.map((menu) => (
                <li key={`${record.id}-${menu.name}`}>
                  <span>{menu.name}</span>
                  <span>{menu.price}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      ))}
    </div>
  );
}

export default RestaurantRecordPanel;