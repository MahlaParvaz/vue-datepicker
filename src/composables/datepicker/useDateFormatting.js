import { computed } from 'vue';
import { useI18nStore } from '@/store/i18n';
import {
  formatSingleDate,
  formatRangeDate,
  formatMultipleDates,
} from '@/utils/datepicker/dateDisplay';

/**
 * Composable for formatting dates based on mode and locale.
 * Provides reactive formatted date, font family, and locale/number system info.
 *
 * @param {import('vue').Ref<Date|Date[]|{start: Date, end: Date}>} value - Reactive date value to format.
 * @param {Object} [options] - Configuration options.
 * @param {'single'|'range'|'multiple'} [options.mode='single'] - Date selection mode.
 * @param {string} [options.format='YYYY/MM/DD'] - Date format string.
 * @param {boolean} [options.enableTime=false] - Whether to include time in formatting.
 *
 * @returns {Object} Reactive utilities for date formatting.
 * @returns {import('vue').ComputedRef<string>} return.formattedDate - Formatted date string.
 * @returns {import('vue').ComputedRef<string>} return.fontFamily - Font family based on calendar type.
 * @returns {import('vue').ComputedRef<string>} return.numberSystem - Current number system (e.g., Arabic, Latin).
 * @returns {import('vue').ComputedRef<string>} return.calendarType - Current calendar type (e.g., jalali, gregorian, hijri, chinese).
 */
export const useDateFormatting = (value, options = {}) => {
  const i18nStore = useI18nStore();

  const { mode = 'single', format = 'YYYY/MM/DD', enableTime = false } = options;

  const numberSystem = computed(() => i18nStore.numberSystem);
  const calendarType = computed(() => i18nStore.calendarType);

  const formattedDate = computed(() => {
    const dateValue = value?.value;
    if (!dateValue) return '';

    try {
      switch (mode) {
        case 'range':
          return formatRangeDate(dateValue, format, enableTime, numberSystem.value);

        case 'multiple':
          return formatMultipleDates(dateValue, format, enableTime, numberSystem.value);

        case 'single':
        default:
          return formatSingleDate(dateValue, format, enableTime, numberSystem.value);
      }
    } catch (error) {
      console.error('[useDateFormatting] Error formatting date:', error);
      return '';
    }
  });

  const FONT_MAP = {
    jalali: 'IRANYekan',
    hijri: 'IRANYekan',
    gregorian: 'Arial, sans-serif',
    chinese: 'Microsoft YaHei, SimHei, sans-serif',
  };

  const fontFamily = computed(() => {
    return FONT_MAP[calendarType.value] || 'Arial, sans-serif';
  });

  return {
    formattedDate,
    fontFamily,
    numberSystem,
    calendarType,
  };
};
