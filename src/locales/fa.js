import { localeManager } from './localeManager.js';

const faLocale = {
  name: 'جلالی',
  months: [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ],
  weekdays: ['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'],
  weekdaysFull: ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
  direction: 'rtl',
  numberSystem: 'persian',
  todayText: 'امروز',
  selectDateText: 'تاریخ را انتخاب نمایید',
  selectTimeText: 'انتخاب زمان',
  confirmText: 'تایید',
  cancelText: 'انصراف',
  clearText: 'پاک کردن',
  hourText: 'ساعت',
  minuteText: 'دقیقه',
  periodText: 'دوره',
  selectedTimeText: 'زمان انتخاب شده',
  startDateText: 'تاریخ شروع',
  endDateText: 'تاریخ پایان',
  calendarType: 'jalali',
};

localeManager.register('fa', faLocale);
localeManager.setDefault('fa');

export default faLocale;
