import { ref, readonly, computed } from 'vue';
import { parseMultipleDates, isSameDate, sortDates } from '@/utils/datepicker';

export function useMultipleSelection(initialValue = null) {
  const dates = ref(parseMultipleDates(initialValue));

  const count = computed(() => dates.value.length);

  function select(date) {
    const index = dates.value.findIndex((d) => isSameDate(d, date));

    if (index !== -1) {
      dates.value = dates.value.filter((_, i) => i !== index);
    } else {
      dates.value = [...dates.value, { ...date }];
    }
  }

  const isSelected = (date) => dates.value.some((d) => isSameDate(d, date));

  const getValue = () => sortDates(dates.value.map((d) => ({ ...d })));

  const remove = (date) => (dates.value = dates.value.filter((d) => !isSameDate(d, date)));

  const clear = () => {
    dates.value = [];
  };

  const isInRange = () => false;
  const isRangeStart = () => false;
  const isRangeEnd = () => false;

  return {
    dates: readonly(dates),
    count,
    select,
    isSelected,
    isInRange,
    isRangeStart,
    isRangeEnd,
    getValue,
    clear,
    remove,
  };
}
