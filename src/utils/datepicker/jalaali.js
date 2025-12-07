/**
 * Integer division helper function
 * @private
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} The floor of a/b
 */
function div(a, b) {
  return Math.floor(a / b);
}

/**
 * Modulo helper function
 * @private
 * @param {number} a - Number
 * @param {number} b - Modulo
 * @returns {number} The remainder of a/b
 */
function mod(a, b) {
  return a - Math.floor(a / b) * b;
}

/**
 * Converts a Gregorian date to Jalali (Persian) calendar
 * @param {number|Date} gy - Gregorian year or Date object
 * @param {number} [gm] - Gregorian month (1-12)
 * @param {number} [gd] - Gregorian day (1-31)
 * @returns {{jy: number, jm: number, jd: number}} Jalali date object
 * @example
 * // Convert specific date
 * const jalali = toJalaali(2024, 12, 7);
 * // Returns: { jy: 1403, jm: 9, jd: 17 }
 *
 * @example
 * // Convert Date object
 * const jalali = toJalaali(new Date());
 */
export function toJalaali(gy, gm, gd) {
  if (gy instanceof Date) {
    gd = gy.getDate();
    gm = gy.getMonth() + 1;
    gy = gy.getFullYear();
  }

  let jy, jm, jd, days;

  gy = parseInt(gy);
  gm = parseInt(gm);
  gd = parseInt(gd);

  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }

  if (gm > 2) {
    days =
      365 * gy +
      div(gy + 3, 4) -
      div(gy + 99, 100) +
      div(gy + 399, 400) -
      80 +
      gd +
      gDaysInMonth[gm - 1];
  } else {
    days =
      365 * gy +
      div(gy + 3, 4) -
      div(gy + 99, 100) +
      div(gy + 399, 400) -
      80 +
      gd +
      gDaysInMonth[gm - 1] -
      1;
  }

  jy += 33 * div(days, 12053);
  days = mod(days, 12053);

  jy += 4 * div(days, 1461);
  days = mod(days, 1461);

  if (days > 365) {
    jy += div(days - 1, 365);
    days = mod(days - 1, 365);
  }

  if (days < 186) {
    jm = 1 + div(days, 31);
    jd = 1 + mod(days, 31);
  } else {
    jm = 7 + div(days - 186, 30);
    jd = 1 + mod(days - 186, 30);
  }

  return { jy, jm, jd };
}

/**
 * Converts a Jalali (Persian) date to Gregorian calendar
 * @param {number} jy - Jalali year
 * @param {number} jm - Jalali month (1-12)
 * @param {number} jd - Jalali day (1-31)
 * @returns {{gy: number, gm: number, gd: number}} Gregorian date object
 * @example
 * const gregorian = toGregorian(1403, 9, 17);
 * // Returns: { gy: 2024, gm: 12, gd: 7 }
 */
export function toGregorian(jy, jm, jd) {
  jy = parseInt(jy);
  jm = parseInt(jm);
  jd = parseInt(jd);

  let gy, gm, gd_temp, days;

  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }

  if (jm < 7) {
    days = (jm - 1) * 31;
  } else {
    days = (jm - 7) * 30 + 186;
  }

  days += 365 * jy + div(jy, 33) * 8 + div(mod(jy, 33) + 3, 4) + 78 + jd;

  gy += 400 * div(days, 146097);
  days = mod(days, 146097);

  let leap = true;
  if (days >= 36525) {
    days--;
    gy += 100 * div(days, 36524);
    days = mod(days, 36524);

    if (days >= 365) {
      days++;
    } else {
      leap = false;
    }
  }

  gy += 4 * div(days, 1461);
  days = mod(days, 1461);

  if (days >= 366) {
    leap = false;

    days--;
    gy += div(days, 365);
    days = mod(days, 365);
  }

  const gDaysInMonth = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let i;

  for (i = 0; gDaysInMonth[i + 1] <= days; i++) {
    days -= gDaysInMonth[i + 1];
  }

  gm = i + 1;
  gd_temp = days + 1;

  return { gy, gm, gd: gd_temp };
}

/**
 * Determines if a Jalali year is a leap year
 * @param {number} jy - Jalali year
 * @returns {boolean} True if the year is a leap year, false otherwise
 * @example
 * isLeapJalaaliYear(1403); // Returns: true or false
 */
export function isLeapJalaaliYear(jy) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
    2456, 3178,
  ];

  // const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];

  let jump;
  for (let i = 1; i <= 19; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;

  let leap = mod(mod(n + 1, 33) - 1, 4);

  if (leap === -1) {
    leap = 4;
  }

  return leap === 0;
}

/**
 * Returns the number of days in a Jalali month
 * @param {number} jy - Jalali year
 * @param {number} jm - Jalali month (1-12)
 * @returns {number} Number of days in the month (29, 30, or 31)
 * @example
 * jalaaliMonthLength(1403, 1); // Returns: 31 (first 6 months have 31 days)
 * jalaaliMonthLength(1403, 7); // Returns: 30 (months 7-11 have 30 days)
 * jalaaliMonthLength(1403, 12); // Returns: 29 or 30 (depends on leap year)
 */
export function jalaaliMonthLength(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  if (isLeapJalaaliYear(jy)) return 30;
  return 29;
}

/**
 * Returns today's date in Jalali calendar
 * @returns {{jy: number, jm: number, jd: number}} Today's Jalali date
 * @example
 * const today = jalaaliToday();
 * // Returns: { jy: 1403, jm: 9, jd: 17 }
 */
export function jalaaliToday() {
  const today = new Date();
  return toJalaali(today);
}

/**
 * Gets the weekday for a Jalali date (0 = Saturday, 6 = Friday in Persian week)
 * @param {number} jy - Jalali year
 * @param {number} jm - Jalali month (1-12)
 * @param {number} jd - Jalali day (1-31)
 * @returns {number} Weekday number (0-6, where 0 is Saturday)
 * @example
 * getJalaaliWeekday(1403, 9, 17); // Returns: 5 (Friday)
 */
export function getJalaaliWeekday(jy, jm, jd) {
  const g = toGregorian(jy, jm, jd);
  const date = new Date(g.gy, g.gm - 1, g.gd);
  return (date.getDay() + 1) % 7;
}

/**
 * Converts a Unix timestamp to Jalali date with time
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {{jy: number, jm: number, jd: number, hour: number, minute: number}} Jalali date with time
 * @example
 * const jalaliDate = timestampToJalaali(1733587200000);
 * // Returns: { jy: 1403, jm: 9, jd: 17, hour: 12, minute: 30 }
 */
export function timestampToJalaali(timestamp) {
  const date = new Date(timestamp);
  const jDate = toJalaali(date);
  return {
    ...jDate,
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

/**
 * Converts a Jalali date (with optional time) to Unix timestamp
 * @param {{jy: number, jm: number, jd: number, hour?: number, minute?: number, second?: number}} jDate - Jalali date object
 * @returns {number|null} Unix timestamp in milliseconds, or null if invalid
 * @example
 * const timestamp = jalaaliToTimestamp({ jy: 1403, jm: 9, jd: 17, hour: 12, minute: 30 });
 * // Returns: 1733587200000
 */
export function jalaaliToTimestamp(jDate) {
  if (!jDate) return null;

  const { jy, jm, jd, hour = 0, minute = 0, second = 0 } = jDate;
  const gregorian = toGregorian(jy, jm, jd);
  const date = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hour, minute, second);

  return date.getTime();
}

/**
 * Converts a Jalali date to a JavaScript Date object
 * @param {{jy: number, jm: number, jd: number, hour?: number, minute?: number, second?: number}} jDate - Jalali date object
 * @returns {Date|null} JavaScript Date object, or null if invalid
 * @example
 * const date = jalaaliToDate({ jy: 1403, jm: 9, jd: 17 });
 * // Returns: Date object for 2024-12-07
 */
export function jalaaliToDate(jDate) {
  if (!jDate) return null;

  const { jy, jm, jd, hour = 0, minute = 0, second = 0 } = jDate;
  const gregorian = toGregorian(jy, jm, jd);

  return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hour, minute, second);
}

/**
 * Converts a Jalali date to ISO 8601 string format
 * @param {{jy: number, jm: number, jd: number, hour?: number, minute?: number, second?: number}} jDate - Jalali date object
 * @returns {string|null} ISO 8601 date string, or null if invalid
 * @example
 * const isoString = jalaaliToISOString({ jy: 1403, jm: 9, jd: 17 });
 * // Returns: "2024-12-07T00:00:00.000Z"
 */
export function jalaaliToISOString(jDate) {
  const date = jalaaliToDate(jDate);
  return date ? date.toISOString() : null;
}
