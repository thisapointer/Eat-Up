export function normalizeRecordData(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.certs)) {
    return data.certs;
  }

  return [];
}

// 메뉴 API 응답에서 메뉴 배열만 반환
export function normalizeMenuData(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.menus)) {
    return data.menus;
  }

  return [];
}

// 인증 기록의 menu_ids에 해당하는 메뉴 정보
export function getMenusByIds(menuIds = [], menuList = []) {
  const safeMenuIds = Array.isArray(menuIds) ? menuIds : [];
  const safeMenuList = Array.isArray(menuList) ? menuList : [];

  return safeMenuIds
    .map((menuId) =>
      safeMenuList.find(
        (menu) => Number(menu.id) === Number(menuId)
      )
    )
    .filter(Boolean);
}

// 한 번의 인증 기록에서 선택한 메뉴들의 총 가격
export function getRecordTotalPrice(record) {
  const menus = Array.isArray(record?.menus)
    ? record.menus
    : [];

  return menus.reduce((sum, menu) => {
    return sum + Number(menu.price ?? 0);
  }, 0);
}

// 인증 기록 객체에서 날짜 문자열을 가져옴
function getRecordDateText(record) {
  return String(
    record?.created ??
    record?.cert_date ??
    record?.date ??
    ""
  );
}

// 인증 기록을 최신순으로 정렬한 뒤 연도·월별로 묶음
export function groupRecordsByYearMonth(records = []) {
  const recordList = Array.isArray(records) ? records : [];

  // ISO 날짜 문자열- 문자열 비교로 최신순 정렬 가능
  const sortedRecords = [...recordList].sort((a, b) => {
    return getRecordDateText(b).localeCompare(
      getRecordDateText(a)
    );
  });

  const groups = new Map();

  sortedRecords.forEach((record) => {
    const dateText = getRecordDateText(record);
    const [year, month] = dateText.slice(0, 10).split("-");

    // 날짜가 없거나 형식이 잘못된 기록은 그룹 제외
    if (!year || !month) {
      return;
    }

    const groupKey = `${year}-${month}`;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        key: groupKey,
        title: `${year}년 ${Number(month)}월`,
        records: [],
      });
    }

    groups.get(groupKey).records.push(record);
  });

  return Array.from(groups.values());
}

// 카드에 표시할 날짜를 "x월 x일"로 변환
export function formatRecordDate(record) {
  const dateText = getRecordDateText(record);
  const [, month, day] = dateText.slice(0, 10).split("-");

  if (!month || !day) {
    return "날짜 정보 없음";
  }

  return `${Number(month)}월 ${Number(day)}일`;
}

// 숫자를 원 단위 문자열로 변환
export function formatWon(price) {
  const numberPrice = Number(price ?? 0);

  return `${numberPrice.toLocaleString()}원`;
}