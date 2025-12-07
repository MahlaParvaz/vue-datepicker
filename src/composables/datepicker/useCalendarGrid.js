import { computed, watch, ref } from 'vue';
import { isSameDate } from '../../utils/datepicker/dateComparison.js';
import { CALENDAR_CONFIG } from '../../constants/datepicker.js';
import { getCalendarAdapter } from '@/locales/adapters/createCalendarAdapterManager.js';
import { useI18nStore } from '@/store/i18n.js';

export function useCalendarGrid(options) {
  const { year, month, selection, constraints } = options;

  const i18nStore = useI18nStore();
  const adapter = computed(() => getCalendarAdapter(i18nStore.calendarType));
  const today = ref(adapter.value.getToday());

  if (options.locale) {
    watch(options.locale, (newVal) => {
      i18nStore.setLocale(newVal);
      today.value = adapter.value.getToday();
    });
  }

  watch(
    () => i18nStore.calendarType,
    () => {
      today.value = adapter.value.getToday();
    },
  );

  function createDayObject(day, monthOffset = 0) {
    let targetMonth = month.value + monthOffset;
    let targetYear = year.value;

    if (targetMonth < 1) {
      targetMonth = 12;
      targetYear--;
    } else if (targetMonth > 12) {
      targetMonth = 1;
      targetYear++;
    }

    const date = {
      jy: targetYear,
      jm: targetMonth,
      jd: day,
      year: targetYear,
      month: targetMonth,
      day: day,
    };
    const key = monthOffset === 0 ? day : `${monthOffset > 0 ? 'next' : 'prev'}-${day}`;

    return {
      key,
      day,
      date,
      id: `${targetYear}-${targetMonth}-${day}`,

      isCurrentMonth: monthOffset === 0,
      isPrevMonth: monthOffset < 0,
      isNextMonth: monthOffset > 0,

      isToday: isSameDate(date, today.value),
      isDisabled: constraints?.isDisabled(date) ?? false,

      isSelected: selection.isSelected(date),
      isInRange: selection.isInRange(date),
      isRangeStart: selection.isRangeStart(date),
      isRangeEnd: selection.isRangeEnd(date),
    };
  }

  function getPrevMonthDays() {
    const firstDayWeekday = adapter.value.getWeekday?.(year.value, month.value, 1) ?? 0;
    if (firstDayWeekday === 0) return [];

    const prevMonth = month.value === 1 ? 12 : month.value - 1;
    const prevYear = month.value === 1 ? year.value - 1 : year.value;
    const prevMonthLength = adapter.value.getDaysInMonth(prevYear, prevMonth);

    const days = [];
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push(createDayObject(prevMonthLength - i, -1));
    }

    return days;
  }

  function getCurrentMonthDays() {
    const daysInMonth = adapter.value.getDaysInMonth(year.value, month.value);
    return Array.from({ length: daysInMonth }, (_, i) => createDayObject(i + 1, 0));
  }

  function getNextMonthDays(existingCount) {
    const remaining = CALENDAR_CONFIG.TOTAL_CELLS - existingCount;
    if (remaining <= 0) return [];

    return Array.from({ length: remaining }, (_, i) => createDayObject(i + 1, 1));
  }

  const days = computed(() => {
    const prevDays = getPrevMonthDays();
    const currentDays = getCurrentMonthDays();
    const nextDays = getNextMonthDays(prevDays.length + currentDays.length);
    const allDays = [...prevDays, ...currentDays, ...nextDays];
    return allDays.slice(0, CALENDAR_CONFIG.TOTAL_CELLS);
  });

  const weeksCount = computed(() => Math.ceil(days.value.length / CALENDAR_CONFIG.DAYS_IN_WEEK));

  const weeks = computed(() => {
    const result = [];
    for (let i = 0; i < days.value.length; i += CALENDAR_CONFIG.DAYS_IN_WEEK) {
      result.push(days.value.slice(i, i + CALENDAR_CONFIG.DAYS_IN_WEEK));
    }
    return result;
  });

  return {
    days,
    weeks,
    weeksCount,
  };
}
