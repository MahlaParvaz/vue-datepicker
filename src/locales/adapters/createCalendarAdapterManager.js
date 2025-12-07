import { JalaaliAdapter } from './jalaali.adapter.js';
import { GregorianAdapter } from './gregorian.adapter.js';
import { HijriAdapter } from './hijri.adapter.js';
import { ChineseAdapter } from './chinese.adapter.js';

const adapters = {
  jalali: JalaaliAdapter,
  gregorian: GregorianAdapter,
  hijri: HijriAdapter,
  chinese: ChineseAdapter,
};

export function getCalendarAdapter(localeCode) {
  const adapter = adapters[localeCode];
  if (!adapter) {
    return adapters.jalali;
  }
  return adapter;
}

export function createCalendarAdapterManager(initialLocale = 'jalali') {
  let currentLocale = initialLocale;
  let currentAdapter = getCalendarAdapter(initialLocale);

  return {
    setLocale(localeCode) {
      currentLocale = localeCode;
      currentAdapter = getCalendarAdapter(localeCode);
    },

    getLocale() {
      return currentLocale;
    },

    getAdapter() {
      return currentAdapter;
    },

    getToday() {
      return currentAdapter.getToday();
    },

    getDaysInMonth(year, month) {
      return currentAdapter.getDaysInMonth(year, month);
    },

    getWeekday(year, month, day) {
      return currentAdapter.getWeekday?.(year, month, day) ?? 0;
    },

    toDateObject(year, month, day) {
      return currentAdapter.toDateObject?.(year, month, day);
    },

    isLeapYear(year) {
      return currentAdapter.isLeapYear?.(year) ?? false;
    },
  };
}
