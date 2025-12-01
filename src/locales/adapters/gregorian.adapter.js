export const GregorianAdapter = {
  getToday() {
    const date = new Date();
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  },

  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  },

  toDateObject(year, month, day) {
    return new Date(year, month - 1, day);
  },

  addMonths(date, months) {
    const d = new Date(date.getTime());
    const targetMonth = d.getMonth() + months;
    d.setMonth(targetMonth);

    if (d.getMonth() !== ((targetMonth % 12) + 12) % 12) {
      d.setDate(0);
    }

    return d;
  },

  addYears(date, years) {
    const d = new Date(date.getTime());
    d.setFullYear(d.getFullYear() + years);

    if (d.getMonth() !== date.getMonth()) {
      d.setDate(0);
    }

    return d;
  },

  parse(str) {
    if (!str || typeof str !== 'string') return null;

    const match = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (match) {
      const [, y, m, d] = match.map(Number);
      return new Date(y, m - 1, d);
    }

    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
  },

  format(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getWeekday(year, month, day) {
    const date = new Date(year, month - 1, day);
    return (date.getDay() + 1) % 7;
  },

  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },

  fromDateObject(date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  },
};
