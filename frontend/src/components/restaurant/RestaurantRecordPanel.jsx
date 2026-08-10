import { useEffect, useMemo, useState } from "react";

import LaurelLeft from "../../assets/laurel-left.svg";
import LaurelRight from "../../assets/laurel-right.svg";
import ReceiptIcon from "../../assets/receipt.svg";

import { getRestaurantMyRecord } from "../../api/certApi";
import { getMenuList } from "../../api/menuApi";

import {
  normalizeRecordData,
  normalizeMenuData,
  getMenusByIds,
  getRecordTotalPrice,
  formatWon,
  formatRecordDate,
  groupRecordsByYearMonth,
} from "../../utils/recordDate";

import "../../styles/RestaurantRecordPanel.css";

function RestaurantRecordPanel({ restaurant }) {
  // 메뉴 정보까지 합쳐진 인증 기록
  const [records, setRecords] = useState([]);

  // API 요청 중인지 저장
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setIsLoading(true);

        // 인증 기록과 식당 메뉴를 동시에 조회
        const [recordData, menuData] = await Promise.all([
          getRestaurantMyRecord(restaurant.id),
          getMenuList(restaurant.id),
        ]);

        const recordList = normalizeRecordData(recordData);
        const menuList = normalizeMenuData(menuData);

        // 인증 기록의 menu_ids를 실제 메뉴 정보로 변환
        const recordsWithMenus = recordList.map((record) => ({
          ...record,
          menus: getMenusByIds(
            record.menu_ids,
            menuList
          ),
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

  // 전체 인증 기록에서 사용한 총금액
  const totalPrice = useMemo(() => {
    return records.reduce((sum, record) => {
      return sum + getRecordTotalPrice(record);
    }, 0);
  }, [records]);

  // 인증 기록을 최신 연도·월 순서로 묶음
  const monthGroups = useMemo(() => {
    return groupRecordsByYearMonth(records);
  }, [records]);

  return (
    <div className="restaurant-record-panel">
      {/* 전체 인증 기록의 총 지출 */}
      <section
        className="restaurant-total-card"
        aria-label="총 지출"
      >
        <img
          src={LaurelLeft}
          alt=""
          aria-hidden="true"
        />

        <div>
          <strong>총 지출</strong>
          <p>{formatWon(totalPrice)}</p>
        </div>

        <img
          src={LaurelRight}
          alt=""
          aria-hidden="true"
        />
      </section>

      {/* API 요청 중 표시 */}
      {isLoading && (
        <p className="restaurant-record-empty">
          내 기록을 불러오는 중입니다.
        </p>
      )}

      {/* 인증 기록이 없을 때 표시 */}
      {!isLoading && !hasRecords && (
        <p className="restaurant-record-empty">
          가게를 방문해서 인증 기록을 추가해보세요!
        </p>
      )}

      {/* 인증 기록을 연도·월별로 묶어서 출력 */}
      {!isLoading &&
        monthGroups.map((monthGroup) => (
          <section
            className="restaurant-record-month"
            key={monthGroup.key}
          >
            {/* 예: 2026년 8월 */}
            <h3 className="restaurant-record-month-title">
              {monthGroup.title}
            </h3>

            <div className="restaurant-record-month-list">
              {monthGroup.records.map(
                (record, recordIndex) => (
                  <article
                    className="restaurant-record-card"
                    key={
                      record.id ??
                      `${monthGroup.key}-${recordIndex}`
                    }
                  >
                    <div className="restaurant-record-card-header">
                      {/* 예: 8월 8일 */}
                      <strong>
                        {formatRecordDate(record)}
                      </strong>

                      <span>
                        <img
                          src={ReceiptIcon}
                          alt=""
                          aria-hidden="true"
                        />
                        {formatWon(
                          getRecordTotalPrice(record)
                        )}
                      </span>
                    </div>

                    <ul>
                      {(record.menus ?? []).map(
                        (menu, menuIndex) => (
                          <li
                            key={
                              `${record.id ?? recordIndex}-` +
                              `${menu.id ?? menuIndex}`
                            }
                          >
                            <span>{menu.name}</span>
                            <span>
                              {formatWon(menu.price)}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </article>
                )
              )}
            </div>
          </section>
        ))}
    </div>
  );
}

export default RestaurantRecordPanel;