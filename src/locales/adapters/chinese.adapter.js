function mod(n, m) {
  return ((n % m) + m) % m;
}

const SYNODIC_MONTH = 29.530588853; 
const REF_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));

function daysBetween(a, b) {
  return (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

function approxLunarFromGregorian(date) {
  const days = daysBetween(
    new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
    REF_NEW_MOON,
  );

  const monthsSince = Math.floor(days / SYNODIC_MONTH);
  const lunarMonthIndex = monthsSince;
  const year = 2000 + Math.floor(lunarMonthIndex / 12);
  const month = mod(lunarMonthIndex, 12) + 1;

  const monthStart = new Date(
    REF_NEW_MOON.getTime() + Math.round(monthsSince * SYNODIC_MONTH * 24 * 3600 * 1000),
  );

  const day =
    Math.floor(
      daysBetween(new Date(date.getFullYear(), date.getMonth(), date.getDate()), monthStart),
    ) + 1;

  const dim = day > 0 ? (day <= 30 ? day : 30) : 1;

  return {
    year,
    month,
    day: dim,
    isLeap: false,
  };
}

export const ChineseAdapter = {
  getToday() {
    const t = new Date();
    const l = approxLunarFromGregorian(t);
    return {
      year: l.year,
      month: l.month,
      day: l.day,
      isLeap: l.isLeap,
    };
  },

  getDaysInMonth(year, month) {
    return month % 2 === 1 ? 30 : 29;
  },

  toDateObject(year, month, day) {
    const monthsSince = (year - 2000) * 12 + (month - 1);
    const approxStart = new Date(
      REF_NEW_MOON.getTime() + Math.round(monthsSince * SYNODIC_MONTH * 24 * 3600 * 1000),
    );

    return new Date(
      approxStart.getFullYear(),
      approxStart.getMonth(),
      approxStart.getDate() + (day - 1),
    );
  },

  addMonths(date, months) {
    const l = approxLunarFromGregorian(date);
    let mi = (l.year - 2000) * 12 + (l.month - 1) + months;
    const y = 2000 + Math.floor(mi / 12);
    const m = mod(mi, 12) + 1;
    const d = Math.min(l.day, this.getDaysInMonth(y, m));
    return this.toDateObject(y, m, d);
  },

  addYears(date, years) {
    const l = approxLunarFromGregorian(date);
    const y = l.year + years;
    const m = l.month;
    const d = Math.min(l.day, this.getDaysInMonth(y, m));
    return this.toDateObject(y, m, d);
  },

  parse(str) {
    if (!str || typeof str !== 'string') return null;

    const match = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (!match) return null;

    const [, y, m, d] = match.map(Number);
    return this.toDateObject(y, m, d);
  },

  format(date) {
    const l = approxLunarFromGregorian(date);
    const formatted = `${l.year}-${String(l.month).padStart(2, '0')}-${String(l.day).padStart(2, '0')}`;
    return l.isLeap ? `${formatted} (leap)` : formatted;
  },

  getWeekday(year, month, day) {
    const date = this.toDateObject(year, month, day);
    return (date.getDay() + 1) % 7;
  },

  isLeapYear(year) {
    return false;
  },

  fromDateObject(date) {
    return approxLunarFromGregorian(date);
  },
};
