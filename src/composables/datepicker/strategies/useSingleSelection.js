import { isSameDate, parseJalaaliDateTime } from '@/utils/datepicker';
import { ref, readonly } from 'vue';

export function useSingleSelection(initialValue = null) {
  const selected = ref(parseJalaaliDateTime(initialValue));

  const select = (date) => (selected.value = { ...date });

  const isSelected = (date) => isSameDate(selected.value, date);

  const getValue = () => (selected.value ? { ...selected.value } : null);

  const clear = () => (selected.value = null);

  const isInRange = () => false;

  const isRangeStart = () => false;

  const isRangeEnd = () => false;

  return {
    selected: readonly(selected),
    select,
    isSelected,
    getValue,
    clear,
    isInRange,
    isRangeStart,
    isRangeEnd,
  };
}
