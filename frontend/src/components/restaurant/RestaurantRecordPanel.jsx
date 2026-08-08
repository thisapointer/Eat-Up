import { useEffect, useMemo, useState } from "react";
import LaurelLeft from "../../assets/laurel-left.svg";
import LaurelRight from "../../assets/laurel-right.svg";
import ReceiptIcon from "../../assets/receipt.svg";
import { getRestaurantMyRecord } from "../../api/certApi";
import { getMenuList } from "../../api/menuApi";
import "../../styles/RestaurantRecordPanel.css";

function RestaurantRecordPanel({ restaurant }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setIsLoading(true);

        const [recordData, menuData] = await Promise.all([
          getRestaurantMyRecord(restaurant.id),
          getMenuList(restaurant.id),
        ]);

        const recordList = normalizeRecordData(recordData);
        const menuList = Array.isArray(menuData) ? menuData : [];

        const recordsWithMenus = recordList.map((record) => ({
          ...record,
          menus: getMenusByIds(record.menu_ids, menuList),
        }));

        setRecords(recordsWithMenus);
      } catch (error) {
        console.error("내 기록 조회 실패:", error);
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurant?.id) {
      fetchRecords();
    }
  }, [restaurant?.id]);

  const hasRecords = records.length > 0;

  const totalPrice = useMemo(() => {
    return records.reduce((sum, record) => {
      return sum + getRecordTotalPrice(record);
    }, 0);
  }, [records]);

  const monthGroups = useMemo(() => {
    return groupRecordsByMonth(records);
  }, [records]);

  return (
    <div className="restaurant-record-panel">
      <section className="restaurant-total-card" aria-label="총 지출">
        <img src={LaurelLeft} alt="" aria-hidden="true" />

        <div>
          <strong>총 지출</strong>
          <p>{formatWon(totalPrice)}</p>
        </div>

        <img src={LaurelRight} alt="" aria-hidden="true" />
      </section>

      {isLoading && (
        <p className="restaurant-record-empty">
          내 기록을 불러오는 중입니다.
        </p>
      )}

      {!isLoading && !hasRecords && (
        <p className="restaurant-record-empty">
          가게를 방문해서 인증 기록을 추가해보세요!
        </p>
      )}

      {!isLoading &&
        monthGroups.map((monthGroup) => (
          <section className="restaurant-record-month" key={monthGroup.month}>
            <h3>{monthGroup.month}</h3>

            {monthGroup.records.map((record) => (
              <article className="restaurant-record-card" key={record.id}>
                <div className="restaurant-record-card-header">
                  <strong>{formatRecordDate(record.created)}</strong>

                  <span>
                    <img src={ReceiptIcon} alt="" aria-hidden="true" />
                    {formatWon(getRecordTotalPrice(record))}
                  </span>
                </div>

                <ul>
                  {record.menus.map((menu) => (
                    <li key={`${record.id}-${menu.id}`}>
                      <span>{menu.name}</span>
                      <span>{formatWon(menu.price)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        ))}
    </div>
  );
}

function normalizeRecordData(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.certs)) {
    return data.certs;
  }

  return [];
}

function getMenusByIds(menuIds = [], menuList = []) {
  return menuIds
    .map((menuId) => menuList.find((menu) => menu.id === menuId))
    .filter(Boolean);
}

function getRecordTotalPrice(record) {
  return record.menus.reduce((sum, menu) => {
    return sum + Number(menu.price ?? 0);
  }, 0);
}

function groupRecordsByMonth(records) {
  const monthMap = {};

  records.forEach((record) => {
    const date = new Date(record.created);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const month = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

    if (!monthMap[month]) {
      monthMap[month] = [];
    }

    monthMap[month].push(record);
  });

  return Object.entries(monthMap).map(([month, monthRecords]) => ({
    month,
    records: monthRecords,
  }));
}

function formatRecordDate(dateText) {
  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatWon(price) {
  return `${Number(price ?? 0).toLocaleString()}원`;
}

export default RestaurantRecordPanel;