import { ref, computed } from 'vue';
import { localeManager } from '@/locales/localeManager.js';
import { toLocalizedNumbers } from '@/locales/numberFormatter.js';

export function useLocale(initialLocale = 'fa') {
  const currentLocale = ref(initialLocale);
  const localeConfig = computed(() => localeManager.get(currentLocale.value));

  const availableLocales = computed(() => {
    return localeManager.getAll();
  });

  const direction = computed(() => localeConfig.value?.direction || 'rtl');
  const numberSystem = computed(() => localeConfig.value?.numberSystem || 'persian');
  const calendarType = computed(() => localeConfig.value?.calendarType || 'jalali');

  function setLocale(code) {
    if (localeManager.has(code)) {
      currentLocale.value = code;
    } else {
      console.warn(`Locale "${code}" is not registered`);
    }
  }

  function getMonthName(month) {
    return localeManager.getMonthName(month, currentLocale.value);
  }

  function getWeekdayName(weekday) {
    return localeManager.getWeekdayName(weekday, currentLocale.value);
  }

  function getWeekdayFullName(weekday) {
    return localeManager.getWeekdayFullName(weekday, currentLocale.value);
  }

  function getText(key) {
    return localeManager.getText(key, currentLocale.value);
  }

  function formatNumber(value) {
    return toLocalizedNumbers(value, numberSystem.value);
  }

  return {
    currentLocale,
    localeConfig,
    availableLocales,
    direction,
    numberSystem,
    calendarType,
    setLocale,
    getMonthName,
    getWeekdayName,
    getWeekdayFullName,
    getText,
    formatNumber,
  };
}
