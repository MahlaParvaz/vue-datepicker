import {
  toJalaali,
  toGregorian,
  jalaaliToday,
  jalaaliMonthLength,
  getJalaaliWeekday,
  isLeapJalaaliYear,
} from '../../utils/datepicker/jalaali.js';

export const jalaaliAdapter = {
  type: 'jalaali',

  today() {
    return jalaaliToday();
  },

  monthLength(year, month) {
    return jalaaliMonthLength(year, month);
  },

  getWeekday(year, month, day) {
    return getJalaaliWeekday(year, month, day);
  },

  isLeapYear(year) {
    return isLeapJalaaliYear(year);
  },

  fromJalaali(jalaaliDate) {
    return {
      year: jalaaliDate.jy || jalaaliDate.year,
      month: jalaaliDate.jm || jalaaliDate.month,
      day: jalaaliDate.jd || jalaaliDate.day,
    };
  },

  toJalaali(date) {
    return {
      jy: date.year,
      jm: date.month,
      jd: date.day,
    };
  },

  fromGregorian(gregorianDate) {
    const j = toJalaali(
      gregorianDate.year || gregorianDate.gy,
      gregorianDate.month || gregorianDate.gm,
      gregorianDate.day || gregorianDate.gd,
    );
    return { year: j.jy, month: j.jm, day: j.jd };
  },
};

export const gregorianAdapter = {
  type: 'gregorian',

  today() {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  },

  monthLength(year, month) {
    return new Date(year, month, 0).getDate();
  },

  getWeekday(year, month, day) {
    const date = new Date(year, month - 1, day);

    const jsDay = date.getDay();
    return jsDay === 6 ? 0 : jsDay + 1;
  },

  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },

  fromJalaali(jalaaliDate) {
    const g = toGregorian(
      jalaaliDate.jy || jalaaliDate.year,
      jalaaliDate.jm || jalaaliDate.month,
      jalaaliDate.jd || jalaaliDate.day,
    );
    return { year: g.gy, month: g.gm, day: g.gd };
  },

  toJalaali(date) {
    const j = toJalaali(date.year, date.month, date.day);
    return { jy: j.jy, jm: j.jm, jd: j.jd };
  },

  fromGregorian(gregorianDate) {
    return {
      year: gregorianDate.year || gregorianDate.gy,
      month: gregorianDate.month || gregorianDate.gm,
      day: gregorianDate.day || gregorianDate.gd,
    };
  },
};

function gregorianToHijri(gy, gm, gd) {
  const jd = gregorianToJulian(gy, gm, gd);
  return julianToHijri(jd);
}

function hijriToGregorian(hy, hm, hd) {
  const jd = hijriToJulian(hy, hm, hd);
  return julianToGregorian(jd);
}

function gregorianToJulian(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function julianToGregorian(jd) {
  const Z = Math.floor(jd + 0.5);
  const A = Math.floor((Z - 1867216.25) / 36524.25);
  const AA = Z + 1 + A - Math.floor(A / 4);
  const B = AA + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return { year, month, day };
}

function julianToHijri(jd) {
  const l = Math.floor(jd - 1948439.5) + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { year, month, day };
}

function hijriToJulian(year, month, day) {
  return (
    Math.floor((11 * year + 3) / 30) +
    354 * year +
    30 * month -
    Math.floor((month - 1) / 2) +
    day +
    1948439.5 -
    385
  );
}

function hijriMonthLength(year, month) {
  if (month === 12 && isHijriLeapYear(year)) {
    return 30;
  }
  return month % 2 === 1 ? 30 : 29;
}

function isHijriLeapYear(year) {
  return (11 * year + 14) % 30 < 11;
}

export const hijriAdapter = {
  type: 'hijri',

  today() {
    const now = new Date();
    const h = gregorianToHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return { year: h.year, month: h.month, day: h.day };
  },

  monthLength(year, month) {
    return hijriMonthLength(year, month);
  },

  getWeekday(year, month, day) {
    const g = hijriToGregorian(year, month, day);
    const date = new Date(g.year, g.month - 1, g.day);
    const jsDay = date.getDay();
    return jsDay === 6 ? 0 : jsDay + 1;
  },

  isLeapYear(year) {
    return isHijriLeapYear(year);
  },

  fromJalaali(jalaaliDate) {
    const g = toGregorian(
      jalaaliDate.jy || jalaaliDate.year,
      jalaaliDate.jm || jalaaliDate.month,
      jalaaliDate.jd || jalaaliDate.day,
    );
    const h = gregorianToHijri(g.gy, g.gm, g.gd);
    return { year: h.year, month: h.month, day: h.day };
  },

  toJalaali(date) {
    const g = hijriToGregorian(date.year, date.month, date.day);
    const j = toJalaali(g.year, g.month, g.day);
    return { jy: j.jy, jm: j.jm, jd: j.jd };
  },

  fromGregorian(gregorianDate) {
    const h = gregorianToHijri(
      gregorianDate.year || gregorianDate.gy,
      gregorianDate.month || gregorianDate.gm,
      gregorianDate.day || gregorianDate.gd,
    );
    return { year: h.year, month: h.month, day: h.day };
  },
};

const adapters = {
  jalaali: jalaaliAdapter,
  jalali: jalaaliAdapter,
  shamsi: jalaaliAdapter,
  gregorian: gregorianAdapter,
  miladi: gregorianAdapter,
  hijri: hijriAdapter,
  islamic: hijriAdapter,
  qamari: hijriAdapter,
};

export function getCalendarAdapter(calendarType) {
  const adapter = adapters[calendarType?.toLowerCase()];

  if (!adapter) {
    console.warn(`Unknown calendar type: ${calendarType}, falling back to jalaali`);
    return jalaaliAdapter;
  }

  return adapter;
}

export function registerCalendarAdapter(type, adapter) {
  const requiredMethods = [
    'today',
    'monthLength',
    'getWeekday',
    'isLeapYear',
    'fromJalaali',
    'toJalaali',
  ];
  const missing = requiredMethods.filter((method) => typeof adapter[method] !== 'function');

  if (missing.length > 0) {
    throw new Error(`Calendar adapter missing required methods: ${missing.join(', ')}`);
  }

  adapters[type.toLowerCase()] = adapter;
}

export function listCalendarTypes() {
  return Object.keys(adapters);
}
