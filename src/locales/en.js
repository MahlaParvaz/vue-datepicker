import { localeManager } from './localeManager.js';

const enGregorianLocale = {
  name: 'میلادی',
  englishName: 'English (Gregorian)',

  calendarType: 'gregorian',

  direction: 'ltr',
  numberSystem: 'latin',

  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],

  weekdays: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],

  weekdaysFull: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

  ui: {
    today: 'Today',
    todayText: 'Today',
    selectDate: 'Select date',
    selectTime: 'Select time',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    clearText: 'Clear',
    hourText: 'Hour',
    minuteText: 'Minute',
    periodText: 'AM/PM',
    selectedTimeText: 'Selected time',
    startDate: 'Start date',
    endDate: 'End date',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    am: 'AM',
    pm: 'PM',
  },

  confirmText: 'Confirm',
  todayText: 'Today',
};

localeManager.register('en-gregorian', enGregorianLocale);
localeManager.register('en', enGregorianLocale);

export default enGregorianLocale;
