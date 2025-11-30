import { localeManager } from './localeManager.js';

const arLocale = {
  name: 'هجری',
  months: [
    'فَرْوَرْدین',
    'أُرْدیبِهِشْت',
    'خُرْداد',
    'تیر',
    'مُرْداد',
    'شَهْریوَر',
    'مِهْر',
    'آبان',
    'آذَر',
    'دِی',
    'بَهْمَن',
    'إسْفَنْد',
  ],
  weekdays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
  weekdaysFull: [
    'السبت',
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
  ],
  direction: 'rtl',
  numberSystem: 'arabic',
  todayText: 'اليوم',
  selectDateText: 'اختر التاريخ',
  selectTimeText: 'اختر الوقت',
  confirmText: 'تأكيد',
  cancelText: 'إلغاء',
  clearText: 'مسح',
  hourText: 'ساعة',
  minuteText: 'دقيقة',
  periodText: 'الفترة',
  selectedTimeText: 'الوقت المختار',
  startDateText: 'تاريخ البدء',
  endDateText: 'تاريخ الانتهاء',
  calendarType: 'hijri',
};

localeManager.register('ar', arLocale);

export default arLocale;
