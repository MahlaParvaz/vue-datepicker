import { toPersianNumbers } from '@/locales';
import { set, isValid } from 'date-fns';
import { getDaysInMonth as getJalaaliDays } from 'date-fns-jalali';
import { toGregorian } from 'hijri-converter';
import { lunarToSolar } from 'lunar-javascript';

function isJalaaliDate(date) {
  return date && typeof date === 'object' && 'jy' in date && 'jm' in date && 'jd' in date;
}

function isGregorianDate(date) {
  return date && typeof date === 'object' && 'year' in date && 'month' in date && 'day' in date;
}

function isHijriDate(date) {
  return date && typeof date === 'object' && 'hy' in date && 'hm' in date && 'hd' in date;
}

function isChineseDate(date) {
  return date && typeof date === 'object' && 'cyear' in date && 'cmonth' in date && 'cday' in date;
}

export function isValidDateObject(date) {
  if (!date || typeof date !== 'object') return false;

  if (isGregorianDate(date)) {
    const jsDate = set(new Date(), {
      year: date.year,
      month: date.month - 1,
      date: date.day,
    });
    return isValid(jsDate);
  }

  if (isJalaaliDate(date)) {
    if (date.jm < 1 || date.jm > 12) return false;
    const maxDay = getJalaaliDays(new Date(date.jy, date.jm - 1, 1));
    return date.jd >= 1 && date.jd <= maxDay;
  }

  if (isHijriDate(date)) {
    try {
      const g = toGregorian(date.hy, date.hm, date.hd);
      return Boolean(g?.gy);
    } catch {
      return false;
    }
  }

  if (isChineseDate(date)) {
    try {
      const solar = lunarToSolar(date.cyear, date.cmonth, date.cday, false);
      return Boolean(solar?.year);
    } catch {
      return false;
    }
  }

  return false;
}

function toSafeInteger(value, fallback = 0) {
  if (Number.isInteger(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return Number.isInteger(parsed) ? parsed : fallback;
  }
  return fallback;
}

function sanitizeTime(date) {
  const result = {};
  if ('hour' in date) result.hour = toSafeInteger(date.hour, 0);
  if ('minute' in date) result.minute = toSafeInteger(date.minute, 0);
  return result;
}

export function sanitizeDateObject(date) {
  if (!date || typeof date !== 'object') return null;

  const DEFAULTS = {
    jalaali: { jy: 1403, jm: 1, jd: 1 },
    gregorian: { year: 2024, month: 1, day: 1 },
    hijri: { hy: 1446, hm: 1, hd: 1 },
    chinese: { cyear: 2024, cmonth: 1, cday: 1 },
  };

  if (isJalaaliDate(date)) return { ...DEFAULTS.jalaali, ...date, ...sanitizeTime(date) };
  if (isGregorianDate(date)) return { ...DEFAULTS.gregorian, ...date, ...sanitizeTime(date) };
  if (isHijriDate(date)) return { ...DEFAULTS.hijri, ...date, ...sanitizeTime(date) };
  if (isChineseDate(date)) return { ...DEFAULTS.chinese, ...date, ...sanitizeTime(date) };

  return null;
}

function padZero(value, length = 2) {
  return String(value).padStart(length, '0');
}

export function formatSingleDate(
  date,
  format = 'YYYY/MM/DD',
  includeTime = false,
  numberSystem = 'latn',
  persianMonthNames = null,
) {
  const validDate = isValidDateObject(date) ? date : sanitizeDateObject(date);
  if (!validDate) return '';

  let y, m, d;
  const { jy, jm, jd, hy, hm, hd, cyear, cmonth, cday, year, month, day, hour, minute } = validDate;

  if (jy != null) {
    y = jy;
    m = jm;
    d = jd;
  } else if (hy != null) {
    const g = toGregorian(hy, hm, hd);
    y = g.gy;
    m = g.gm;
    d = g.gd;
  } else if (cyear != null) {
    const solar = lunarToSolar(cyear, cmonth, cday, false);
    y = solar.year;
    m = solar.month;
    d = solar.day;
  } else {
    y = year;
    m = month;
    d = day;
  }

  let monthStr = padZero(m);
  if (persianMonthNames && jy != null) monthStr = persianMonthNames[m - 1] ?? monthStr;

  let str = format.replace('YYYY', y).replace('MM', monthStr).replace('DD', padZero(d));
  str = numberSystem === 'persian' ? toPersianNumbers(str) : str;

  if (includeTime && typeof hour === 'number' && typeof minute === 'number') {
    const timeStr = `${padZero(hour)}:${padZero(minute)}`;
    str += numberSystem === 'persian' ? ` ${toPersianNumbers(timeStr)}` : ` ${timeStr}`;
  }

  return str;
}

export function formatDateRange(
  range,
  format,
  includeTime = false,
  numberSystem = 'latn',
  persianMonthNames = null,
) {
  if (!range?.start) return '';
  const startDate = isValidDateObject(range.start) ? range.start : sanitizeDateObject(range.start);
  if (!startDate) return '';

  if (!range.end)
    return formatSingleDate(startDate, format, includeTime, numberSystem, persianMonthNames);

  const endDate = isValidDateObject(range.end) ? range.end : sanitizeDateObject(range.end);
  if (!endDate)
    return formatSingleDate(startDate, format, includeTime, numberSystem, persianMonthNames);

  return `${formatSingleDate(startDate, format, includeTime, numberSystem, persianMonthNames)} - ${formatSingleDate(endDate, format, includeTime, numberSystem, persianMonthNames)}`;
}

export function formatMultipleDates(
  dates = [],
  format,
  includeTime = false,
  numberSystem = 'latn',
  persianMonthNames = null,
) {
  if (!Array.isArray(dates) || !dates.length) return '';

  const sanitizedDates = dates
    .map((d) => (isValidDateObject(d) ? d : sanitizeDateObject(d)))
    .filter(Boolean);

  return sanitizedDates
    .map((d) => formatSingleDate(d, format, includeTime, numberSystem, persianMonthNames))
    .join('، ');
}
