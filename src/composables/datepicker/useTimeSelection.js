import { TIME_FORMATS, TIME_PERIOD } from '@/constants/datepicker';
import { ref, computed } from 'vue';

/**
 * Composable for managing time selection in 12/24-hour formats.
 *
 * @param {Object} options
 * @param {string} [options.timeFormat=TIME_FORMATS.TWENTY_FOUR_HOUR] - 12h or 24h format.
 * @param {Object} [options.initialValue=null] - Initial hour and minute.
 * @param {number} [options.initialValue.hour] - Initial hour.
 * @param {number} [options.initialValue.minute] - Initial minute.
 *
 * @returns {Object} Reactive time state and utility functions.
 */
export function useTimeSelection(options = {}) {
  const { timeFormat = TIME_FORMATS.TWENTY_FOUR_HOUR, initialValue = {} } = options;

  const hour = ref(initialValue?.hour ?? null);
  const minute = ref(initialValue?.minute ?? null);
  const period = ref(hour.value !== null && hour.value >= 12 ? TIME_PERIOD.PM : TIME_PERIOD.AM);

  const displayHour = computed(() => {
    if (hour.value === null) return null;
    if (timeFormat === TIME_FORMATS.TWELVE_HOUR) {
      const h = hour.value % 12;
      return h === 0 ? 12 : h;
    }
    return hour.value;
  });

  const hours = computed(() => {
    return timeFormat === TIME_FORMATS.TWELVE_HOUR
      ? Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i))
      : Array.from({ length: 24 }, (_, i) => i);
  });

  const minutes = computed(() => Array.from({ length: 60 }, (_, i) => i));

  const isValid = computed(() => hour.value !== null && minute.value !== null);

  const selectHour = (h) => {
    if (timeFormat === TIME_FORMATS.TWELVE_HOUR) {
      if (h === 12) {
        hour.value = period.value === TIME_PERIOD.AM ? 0 : 12;
      } else {
        hour.value = period.value === TIME_PERIOD.AM ? h : h + 12;
      }
    } else {
      hour.value = h;
    }
  };

  const selectMinute = (m) => {
    if (m >= 0 && m < 60) minute.value = m;
  };

  const togglePeriod = () => {
    if (timeFormat !== TIME_FORMATS.TWELVE_HOUR) return;

    period.value = period.value === TIME_PERIOD.AM ? TIME_PERIOD.PM : TIME_PERIOD.AM;

    if (hour.value !== null) {
      if (period.value === TIME_PERIOD.PM && hour.value < 12) {
        hour.value += 12;
      } else if (period.value === TIME_PERIOD.AM && hour.value >= 12) {
        hour.value -= 12;
      }
    }
  };

  const setPeriod = (p) => {
    if (p !== period.value) togglePeriod();
  };

  const getValue = () => {
    if (!isValid.value) return null;
    return { hour: hour.value, minute: minute.value };
  };

  const setValue = (time = {}) => {
    if (time.hour !== undefined) {
      hour.value = time.hour;
      if (timeFormat === TIME_FORMATS.TWELVE_HOUR) {
        period.value = time.hour >= 12 ? TIME_PERIOD.PM : TIME_PERIOD.AM;
      }
    }
    if (time.minute !== undefined) minute.value = time.minute;
  };

  const reset = () => {
    hour.value = null;
    minute.value = null;
    period.value = TIME_PERIOD.AM;
  };

  const isHourSelected = (h) =>
    timeFormat === TIME_FORMATS.TWELVE_HOUR ? displayHour.value === h : hour.value === h;
  const isMinuteSelected = (m) => minute.value === m;

  return {
    hour,
    minute,
    period,
    displayHour,
    hours,
    minutes,
    isValid,
    timeFormat,
    selectHour,
    selectMinute,
    togglePeriod,
    setPeriod,
    getValue,
    setValue,
    reset,
    isHourSelected,
    isMinuteSelected,
  };
}
