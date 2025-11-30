import { computed, isRef, unref, ref } from 'vue';
import {
  jalaaliMonthLength,
  jalaaliToday,
  getJalaaliWeekday,
} from '../../utils/datepicker/jalaali.js';
import { isSameDate } from '../../utils/datepicker/dateComparison.js';
import { toLocalizedNumbers } from '../../locales/numberFormatter.js';
import { localeManager } from '../../locales/localeManager.js';
import { CALENDAR_CONFIG } from '../../constants/datepicker.js';

export function useCalendarGrid(options) {
  const { year, month, selection, constraints } = options;
  const locale = options.locale || ref('fa');

  if (!isRef(year) || !isRef(month)) {
    throw new Error('year and month must be Vue refs');
  }

  if (!selection || typeof selection.isSelected !== 'function') {
    throw new Error('selection must implement SelectionStrategy interface');
  }

  const today = jalaaliToday();

  function createDayObject(day, monthOffset = 0, numberSystem = 'latin') {
    let targetMonth = month.value + monthOffset;
    let targetYear = year.value;

    if (targetMonth < 1) {
      targetMonth = 12;
      targetYear--;
    } else if (targetMonth > 12) {
      targetMonth = 1;
      targetYear++;
    }

    const date = { jy: targetYear, jm: targetMonth, jd: day };

    const key = monthOffset === 0 ? day : `${monthOffset > 0 ? 'next' : 'prev'}-${day}`;

    const label = toLocalizedNumbers(day, numberSystem);

    return {
      key,
      day,
      date,
      label,

      isCurrentMonth: monthOffset === 0,
      isPrevMonth: monthOffset < 0,
      isNextMonth: monthOffset > 0,

      isToday: isSameDate(date, today),
      isDisabled: constraints?.isDisabled(date) ?? false,

      isSelected: selection.isSelected(date),
      isInRange: selection.isInRange(date),
      isRangeStart: selection.isRangeStart(date),
      isRangeEnd: selection.isRangeEnd(date),
    };
  }

  function getPrevMonthDays(numberSystem) {
    const firstDayWeekday = getJalaaliWeekday(year.value, month.value, 1);
    if (firstDayWeekday === 0) return [];

    const prevMonth = month.value === 1 ? 12 : month.value - 1;
    const prevYear = month.value === 1 ? year.value - 1 : year.value;
    const prevMonthLength = jalaaliMonthLength(prevYear, prevMonth);

    const days = [];
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push(createDayObject(prevMonthLength - i, -1, numberSystem));
    }

    return days;
  }

  function getCurrentMonthDays(numberSystem) {
    const daysInMonth = jalaaliMonthLength(year.value, month.value);

    return Array.from({ length: daysInMonth }, (_, i) => {
      return createDayObject(i + 1, 0, numberSystem);
    });
  }

  function getNextMonthDays(existingCount, numberSystem) {
    const remaining = CALENDAR_CONFIG.TOTAL_CELLS - existingCount;
    if (remaining <= 0) return [];

    return Array.from({ length: remaining }, (_, i) => {
      return createDayObject(i + 1, 1, numberSystem);
    });
  }

  const days = computed(() => {
    const currentLocale = unref(locale);
    const numberSystem = localeManager.getNumberSystem(currentLocale);

    const prevDays = getPrevMonthDays(numberSystem);
    const currentDays = getCurrentMonthDays(numberSystem);
    const nextDays = getNextMonthDays(prevDays.length + currentDays.length, numberSystem);

    return [...prevDays, ...currentDays, ...nextDays];
  });

  const weeksCount = computed(() => {
    return Math.ceil(days.value.length / CALENDAR_CONFIG.DAYS_IN_WEEK);
  });

  const weeks = computed(() => {
    const result = [];
    const allDays = days.value;

    for (let i = 0; i < allDays.length; i += CALENDAR_CONFIG.DAYS_IN_WEEK) {
      result.push(allDays.slice(i, i + CALENDAR_CONFIG.DAYS_IN_WEEK));
    }

    return result;
  });

  return {
    days,
    weeks,
    weeksCount,
  };
}
