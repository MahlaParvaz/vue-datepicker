export function createLocaleManager(initialLocales = {}) {
  const locales = new Map(Object.entries(initialLocales));
  let defaultLocaleCode = 'fa';

  function validateConfig(config) {
    const requiredFields = ['months', 'weekdays', 'direction'];
    const missing = requiredFields.filter((field) => !config[field]);

    if (missing.length > 0) {
      throw new Error(`Locale config missing required fields: ${missing.join(', ')}`);
    }

    if (config.months.length !== 12) {
      throw new Error('months array must have exactly 12 items');
    }

    if (config.weekdays.length !== 7) {
      throw new Error('weekdays array must have exactly 7 items');
    }

    if (!['rtl', 'ltr'].includes(config.direction)) {
      throw new Error('direction must be "rtl" or "ltr"');
    }

    if (config.numberSystem && !['persian', 'arabic', 'latin', 'chinese'].includes(config.numberSystem)) {
      throw new Error('numberSystem must be one of: persian, arabic, latin, chinese');
    }

    if (config.calendarType && !['jalali', 'gregorian', 'hijri'].includes(config.calendarType)) {
      throw new Error('calendarType must be one of: jalali, gregorian, hijri');
    }
  }

  return {
    get(code) {
      const locale = locales.get(code) || locales.get(defaultLocaleCode);
      return locale ? { ...locale } : null;
    },

    has(code) {
      return locales.has(code);
    },

    register(code, config) {
      validateConfig(config);
      locales.set(code, Object.freeze({ ...config }));
    },

    setDefault(code) {
      if (!locales.has(code)) {
        throw new Error(`Locale "${code}" is not registered`);
      }
      defaultLocaleCode = code;
    },

    getDefaultCode() {
      return defaultLocaleCode;
    },

    list() {
      return Array.from(locales.keys());
    },

    getAll() {
      return Array.from(locales.entries()).map(([code, config]) => ({
        code,
        name: config.name || code,
        direction: config.direction,
        numberSystem: config.numberSystem || 'latin',
        calendarType: config.calendarType || 'jalali',
      }));
    },

    getMonthName(month, code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.months[month - 1] || '';
    },

    getWeekdayName(weekday, code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.weekdays[weekday] || '';
    },

    getWeekdayFullName(weekday, code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.weekdaysFull?.[weekday] || locale?.weekdays?.[weekday] || '';
    },

    getText(key, code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.[key] || '';
    },

    getDirection(code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.direction || 'ltr';
    },

    getNumberSystem(code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.numberSystem || 'latin';
    },

    getCalendarType(code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.calendarType || 'jalali';
    },
  };
}

export const localeManager = createLocaleManager();
