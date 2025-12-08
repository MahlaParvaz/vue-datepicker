import { compareDates, isBetweenExclusive, isSameDate, parseDateRange } from '@/utils/datepicker';
import { computed, readonly, ref } from 'vue';

export function useRangeSelection(initialValue = null) {
  const { start: parsedStart, end: parsedEnd } = parseDateRange(initialValue) || {};
  const start = ref(parsedStart || null);
  const end = ref(parsedEnd || null);

  const selectionState = computed(() => {
    if (!start.value && !end.value) return 'empty';
    if (start.value && !end.value) return 'selecting';
    return 'complete';
  });

  const select = (date) => {
    const dateObj = { ...date };

    if (!start.value || (start.value && end.value)) {
      start.value = dateObj;
      end.value = null;
      return;
    }
    if (compareDates(dateObj, start.value) < 0) {
      end.value = start.value;
      start.value = dateObj;
    } else if (compareDates(dateObj, start.value) === 0) {
      start.value = null;
      end.value = null;
    } else {
      end.value = dateObj;
    }
  };

  const isSelected = (date) => isRangeStart(date) || isRangeEnd(date);

  const isInRange = (date) => {
    if (!start.value || !end.value) return false;
    return isBetweenExclusive(date, start.value, end.value);
  };
  const isRangeStart = (date) => isSameDate(start.value, date);

  const isRangeEnd = (date) => isSameDate(end.value, date);

  const getValue = () => {
    if (!start.value || !end.value) return null;
    return { start: { ...start.value }, end: { ...end.value } };
  };
  function clear() {
    start.value = null;
    end.value = null;
  }
  return {
    start: readonly(start),
    end: readonly(end),
    selectionState,
    select,
    isSelected,
    isInRange,
    isRangeStart,
    isRangeEnd,
    getValue,
    clear,
  };
}
