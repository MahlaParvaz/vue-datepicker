import { ref, computed, watch } from 'vue';
import { parseJalaaliDate } from '../../utils/datepicker/dateParser.js';
import { VIEW_MODES } from '../../constants/datepicker.js';
import { useI18nStore } from '@/store/i18n.js';
import { getCalendarAdapter } from '@/locales/adapters/createCalendarAdapterManager.js';

export function useNavigation(initialDate = null, options = {}) {
  const i18nStore = useI18nStore();
  const { yearsBefore = 50, yearsAfter = 50 } = options;

  const adapter = computed(() => getCalendarAdapter(i18nStore.calendarType));
  const activeMinYear = computed(() => {
    const today = adapter.value.getToday();
    const currentYear = today.jy || today.year;
    return currentYear - yearsBefore;
  });

  const activeMaxYear = computed(() => {
    const today = adapter.value.getToday();
    const currentYear = today.jy || today.year;
    return currentYear + yearsAfter;
  });

  const parsed = parseJalaaliDate(initialDate);
  const today = adapter.value.getToday();

  let initialYear = parsed?.jy || parsed?.year || today.jy || today.year;

  if (initialYear < activeMinYear.value) {
    initialYear = activeMinYear.value;
  }
  if (initialYear > activeMaxYear.value) {
    initialYear = activeMaxYear.value;
  }

  const currentYear = ref(initialYear);
  const currentMonth = ref(parsed?.jm || parsed?.month || today.jm || today.month);
  const currentView = ref(VIEW_MODES.DAYS);

  watch(
    () => i18nStore.calendarType,
    () => {
      const newToday = adapter.value.getToday();
      let newYear = newToday.jy || newToday.year;
      if (newYear < activeMinYear.value) {
        newYear = activeMinYear.value;
      }
      if (newYear > activeMaxYear.value) {
        newYear = activeMaxYear.value;
      }

      currentYear.value = newYear;
      currentMonth.value = newToday.jm || newToday.month;
    },
  );

  const yearRange = computed(() => {
    const years = [];
    const currentMinYear = activeMinYear.value;
    const currentMaxYear = activeMaxYear.value;

    for (let year = currentMinYear; year <= currentMaxYear; year++) {
      years.push(year);
    }

    return years;
  });

  const daysInCurrentMonth = computed(() => {
    return adapter.value.getDaysInMonth(currentYear.value, currentMonth.value);
  });

  function nextMonth() {
    if (currentMonth.value === 12) {
      currentMonth.value = 1;
      currentYear.value++;
    } else {
      currentMonth.value++;
    }
  }

  function prevMonth() {
    if (currentMonth.value === 1) {
      currentMonth.value = 12;
      currentYear.value--;
    } else {
      currentMonth.value--;
    }
  }

  function nextYear() {
    const nextYearValue = currentYear.value + 1;
    if (nextYearValue <= activeMaxYear.value) {
      currentYear.value = nextYearValue;
    }
  }

  function prevYear() {
    const prevYearValue = currentYear.value - 1;
    if (prevYearValue >= activeMinYear.value) {
      currentYear.value = prevYearValue;
    }
  }

  function setMonth(month) {
    if (month >= 1 && month <= 12) {
      currentMonth.value = month;
      currentView.value = VIEW_MODES.DAYS;
    }
  }

  function setYear(year) {
    if (year < activeMinYear.value || year > activeMaxYear.value) return;

    currentYear.value = year;
    currentView.value = VIEW_MODES.DAYS;
  }

  function setView(view) {
    if (Object.values(VIEW_MODES).includes(view)) {
      currentView.value = view;
    }
  }

  function toggleView(view) {
    currentView.value = currentView.value === view ? VIEW_MODES.DAYS : view;
  }

  function goToDate(date) {
    if ((date?.jy && date?.jm) || (date?.year && date?.month)) {
      currentYear.value = date.jy || date.year;
      currentMonth.value = date.jm || date.month;
      currentView.value = VIEW_MODES.DAYS;
    }
  }

  function goToToday() {
    const newToday = adapter.value.getToday();
    goToDate(newToday);
  }

  function reset() {
    const initial = parseJalaaliDate(initialDate) || adapter.value.getToday();
    currentYear.value = initial.jy || initial.year;
    currentMonth.value = initial.jm || initial.month;
    currentView.value = VIEW_MODES.DAYS;
  }

  return {
    currentYear,
    currentMonth,
    currentView,

    yearRange,
    daysInCurrentMonth,

    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    setMonth,
    setYear,
    setView,
    toggleView,
    goToDate,
    goToToday,
    reset,
  };
}
