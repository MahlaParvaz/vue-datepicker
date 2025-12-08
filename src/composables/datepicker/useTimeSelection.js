import { TIME_FORMATS, TIME_PERIOD } from '@/constants/datepicker';
import { ref, computed } from 'vue';

export function useTimeSelection(options = {}) {
  const { timeFormat = TIME_FORMATS.TWENTY_FOUR_HOUR, initialValue = null } = options;

  const hour = ref(initialValue?.hour ?? null);
  const minute = ref(initialValue?.minute ?? null);
  const period = ref(initialValue?.hour >= 12 ? TIME_PERIOD.PM : TIME_PERIOD.AM);

  const displayHour = computed(() => {
    if (hour.value === null) return null;
    if (timeFormat === TIME_FORMATS.TWELVE_HOUR) {
      const hours = hour.value % 12;
      return hours === 0 ? 12 : hours;
    }
    return hour.value;
  });

  const hours = computed(() => {
    if (timeFormat === TIME_FORMATS.TWELVE_HOUR) {
      return Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
    }
    return Array.from({ length: 24 }, (_, i) => i);
  });

  const minutes = computed(() => {
    return Array.from({ length: 60 }, (_, i) => i);
  });

  const isValid = computed(() => {
    return hour.value !== null && minute.value !== null;
  });

  function selectHour(hours) {
    if (timeFormat === TIME_FORMATS.TWELVE_HOUR) {
      if (hours === 12) {
        hour.value = period.value === TIME_PERIOD.AM ? 0 : 12;
      } else {
        hour.value = period.value === TIME_PERIOD.AM ? hours : hours + 12;
      }
    } else {
      hour.value = hours;
    }
  }

  function selectMinute(m) {
    if (m >= 0 && m < 60) {
      minute.value = m;
    }
  }

  function togglePeriod() {
    if (timeFormat !== TIME_FORMATS.TWELVE_HOUR) return;

    period.value = period.value === TIME_PERIOD.AM ? TIME_PERIOD.PM : TIME_PERIOD.AM;

    if (hour.value !== null) {
      if (period.value === TIME_PERIOD.PM && hour.value < 12) {
        hour.value += 12;
      } else if (period.value === TIME_PERIOD.AM && hour.value >= 12) {
        hour.value -= 12;
      }
    }
  }

  function setPeriod(p) {
    if (p !== period.value) {
      togglePeriod();
    }
  }

  function getValue() {
    if (!isValid.value) return null;

    return {
      hour: hour.value,
      minute: minute.value,
    };
  }

  function setValue(time) {
    if (time?.hour !== undefined) {
      hour.value = time.hour;
      if (timeFormat === TIME_FORMATS.TWELVE_HOUR) {
        period.value = time.hour >= 12 ? TIME_PERIOD.PM : TIME_PERIOD.AM;
      }
    }
    if (time?.minute !== undefined) {
      minute.value = time.minute;
    }
  }

  function reset() {
    hour.value = null;
    minute.value = null;
    period.value = TIME_PERIOD.AM;
  }

  function isHourSelected(h) {
    if (timeFormat === TIME_FORMATS.TWELVE_HOUR) {
      return displayHour.value === h;
    }
    return hour.value === h;
  }

  function isMinuteSelected(m) {
    return minute.value === m;
  }

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
