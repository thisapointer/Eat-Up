const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// 현재 요일을 API weekday 형식으로 바꿉니다.
export function getTodayWeekday(now = new Date()) {
  return WEEKDAYS[now.getDay()];
}

function parseTimeToMinutes(timeText) {
  if (!timeText) {
    return null;
  }

  const [hourText, minuteText] = timeText.split(":");

  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  return hour * 60 + minute;
}

function isTimeInRange(nowMinutes, startMinutes, endMinutes) {
  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  // 일반 시간대: 11:00 ~ 22:00
  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  // 자정을 넘기는 시간대: 11:00 ~ 다음날 00:30
  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

// 영업시간 + 브레이크시간 기준으로 현재 영업 중인지 계산합니다.
export function checkRestaurantOpenNow(hours, breaks, now = new Date()) {
  if (!hours || hours.is_closed) {
    return false;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const openMinutes = parseTimeToMinutes(hours.open_time);
  const closeMinutes = parseTimeToMinutes(hours.close_time);

  const isInBusinessHours = isTimeInRange(
    nowMinutes,
    openMinutes,
    closeMinutes
  );

  if (!isInBusinessHours) {
    return false;
  }

  const breakList = Array.isArray(breaks) ? breaks : breaks ? [breaks] : [];

  const isInBreakTime = breakList.some((breakTime) => {
    const breakStartMinutes = parseTimeToMinutes(breakTime.break_start_time);
    const breakEndMinutes = parseTimeToMinutes(breakTime.break_end_time);

    return isTimeInRange(nowMinutes, breakStartMinutes, breakEndMinutes);
  });

  // 영업시간 안이고 브레이크시간이 아니면 영업 중
  return !isInBreakTime;
}