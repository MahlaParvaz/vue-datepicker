import { computed } from 'vue';
import { isSameDate } from '../../utils/datepicker/dateComparison.js';
import { CALENDAR_CONFIG } from '../../constants/datepicker.js';
import { getCalendarAdapter } from '@/locales/adapters/createCalendarAdapterManager.js';
import { useI18nStore } from '@/store/i18n.js';

export function useCalendarGrid(options) {
  const { year, month, selection, constraints, locale } = options;

  const i18n = useI18nStore();

  if (locale) {
    computed(() => locale.value).value;
    computed(() => i18n.setLocale(locale.value));
  }

  const adapter = computed(() => getCalendarAdapter(i18n.calendarType));

  const today = computed(() => adapter.value.getToday());

  const resolveMonthYear = (offset) => {
    let y = year.value;
    let m = month.value + offset;

    if (m < 1) {
      m = 12;
      y--;
    } else if (m > 12) {
      m = 1;
      y++;
    }

    return { y, m };
  };

  const createDayMeta = (day, offset = 0) => {
    const { y, m } = resolveMonthYear(offset);

    const dateObj = {
      jy: y,
      jm: m,
      jd: day,
      year: y,
      month: m,
      day,
    };

    const isInCurrentMonth = offset === 0;

    return {
      key: isInCurrentMonth ? day : `${offset > 0 ? 'next' : 'prev'}-${day}`,
      id: `${y}-${m}-${day}`,
      day,
      date: dateObj,
      isCurrentMonth: isInCurrentMonth,
      isPrevMonth: offset < 0,
      isNextMonth: offset > 0,
      isToday: isSameDate(dateObj, today.value),
      isDisabled: constraints?.isDisabled(dateObj) ?? false,
      isSelected: selection.isSelected(dateObj),
      isInRange: selection.isInRange(dateObj),
      isRangeStart: selection.isRangeStart(dateObj),
      isRangeEnd: selection.isRangeEnd(dateObj),
    };
  };

  const prevMonthDays = computed(() => {
    const firstDayWeekday = adapter.value.getWeekday?.(year.value, month.value, 1) ?? 0;

    if (firstDayWeekday === 0) return [];

    const { y, m } = resolveMonthYear(-1);
    const totalPrevDays = adapter.value.getDaysInMonth(y, m);

    return Array.from({ length: firstDayWeekday }, (_, i) =>
      createDayMeta(totalPrevDays - (firstDayWeekday - 1 - i), -1),
    );
  });

  const currentMonthDays = computed(() => {
    const total = adapter.value.getDaysInMonth(year.value, month.value);
    return Array.from({ length: total }, (_, i) => createDayMeta(i + 1));
  });

  const nextMonthDays = computed(() => {
    const used = prevMonthDays.value.length + currentMonthDays.value.length;
    const remaining = CALENDAR_CONFIG.TOTAL_CELLS - used;

    return remaining <= 0
      ? []
      : Array.from({ length: remaining }, (_, i) => createDayMeta(i + 1, 1));
  });

  const days = computed(() => [
    ...prevMonthDays.value,
    ...currentMonthDays.value,
    ...nextMonthDays.value,
  ]);

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
