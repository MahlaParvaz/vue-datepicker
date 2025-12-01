import { provide, inject, computed, readonly } from 'vue';
import { useNavigation } from './useNavigation.js';
import { createSelection } from './useSelection.js';
import { useTimeSelection } from './useTimeSelection.js';
import { useDateConstraints } from './useDateConstraints.js';
import { useCalendarGrid } from './useCalendarGrid.js';
import { localeManager } from '../../locales/localeManager.js';
import { SELECTION_MODES } from '../../constants/datepicker.js';

const DatePickerContextKey = Symbol('DatePickerContext');

export function createDatePickerContext(options = {}) {
  const {
    mode = SELECTION_MODES.SINGLE,
    locale = 'jalali',
    initialValue = null,
    minDate = null,
    maxDate = null,
    enableTime = false,
    timeFormat = 24,
    format = 'YYYY/MM/DD',
  } = options;

  const navigation = useNavigation(initialValue);
  const selection = createSelection(mode, initialValue);
  const constraints = useDateConstraints({ minDate, maxDate });

  const time = enableTime ? useTimeSelection({ timeFormat, initialValue }) : null;

  const calendarGrid = useCalendarGrid({
    year: navigation.currentYear,
    month: navigation.currentMonth,
    selection,
    constraints,
    locale,
  });

  const currentLocale = computed(() => localeManager.get(locale));

  const config = readonly({
    mode,
    locale,
    enableTime,
    timeFormat,
    format,
  });

  function confirm() {
    const dateValue = selection.getValue();
    if (!dateValue) return null;

    if (time && enableTime) {
      const timeValue = time.getValue() || { hour: 0, minute: 0 };
      return addTimeToValue(dateValue, timeValue, mode);
    }

    return dateValue;
  }

  function addTimeToValue(dateValue, timeValue, mode) {
    if (mode === SELECTION_MODES.RANGE) {
      return {
        start: { ...dateValue.start, ...timeValue },
        end: { ...dateValue.end, ...timeValue },
      };
    }

    if (mode === SELECTION_MODES.MULTIPLE) {
      return dateValue.map((d) => ({ ...d, ...timeValue }));
    }

    return { ...dateValue, ...timeValue };
  }

  function reset() {
    selection.clear();
    navigation.reset();
    time?.reset();
  }

  function selectDay(dayObj) {
    if (dayObj.isDisabled) return;

    if (dayObj.isPrevMonth || dayObj.isNextMonth) {
      navigation.goToDate(dayObj.date);
    }

    selection.select(dayObj.date);
  }

  const context = {
    navigation,
    selection,
    time,
    constraints,
    calendarGrid,

    config,
    locale: currentLocale,

    selectDay,
    confirm,
    reset,
  };

  provide(DatePickerContextKey, context);

  return context;
}

export function useDatePickerContext() {
  const context = inject(DatePickerContextKey);

  return context;
}

export function hasDatePickerContext() {
  return inject(DatePickerContextKey, null) !== null;
}
