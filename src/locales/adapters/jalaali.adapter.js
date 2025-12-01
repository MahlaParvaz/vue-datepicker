import {
  getJalaaliWeekday,
  isLeapJalaaliYear,
  jalaaliMonthLength,
  jalaaliToDate,
  jalaaliToday,
  timestampToJalaali,
} from '@/utils/datepicker';

export const JalaaliAdapter = {
  getToday: jalaaliToday,

  getDaysInMonth: jalaaliMonthLength,

  toDateObject: jalaaliToDate,

  addMonths(date, months) {
    const j = timestampToJalaali(date.getTime());

    let newMonth = j.jm + months;
    let newYear = j.jy + Math.floor((newMonth - 1) / 12);
    newMonth = ((((newMonth - 1) % 12) + 12) % 12) + 1;

    const maxDay = jalaaliMonthLength(newYear, newMonth);
    const day = Math.min(j.jd, maxDay);

    return jalaaliToDate({
      jy: newYear,
      jm: newMonth,
      jd: day,
      hour: j.hour,
      minute: j.minute,
    });
  },

  addYears(date, years) {
    const j = timestampToJalaali(date.getTime());
    const newYear = j.jy + years;

    const maxDay = jalaaliMonthLength(newYear, j.jm);
    const day = Math.min(j.jd, maxDay);

    return jalaaliToDate({
      jy: newYear,
      jm: j.jm,
      jd: day,
      hour: j.hour,
      minute: j.minute,
    });
  },

  parse(str) {
    if (!str) return null;

    const match = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (!match) return null;

    const y = Number(match[1]);
    const m = Number(match[2]);
    const d = Number(match[3]);

    return jalaaliToDate({ jy: y, jm: m, jd: d });
  },

  format(date) {
    const j = timestampToJalaali(date.getTime());
    return `${j.jy}-${String(j.jm).padStart(2, '0')}-${String(j.jd).padStart(2, '0')}`;
  },

  getWeekday(jy, jm, jd) {
    return getJalaaliWeekday(jy, jm, jd);
  },

  isLeapYear(jy) {
    return isLeapJalaaliYear(jy);
  },
};
