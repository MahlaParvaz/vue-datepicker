import { localeManager } from './localeManager.js';

const zhLocale = {
  name: 'چینی',
  months: [
    '法尔瓦丁',
    '奥尔迪贝赫什特',
    '霍尔达德',
    '提尔',
    '莫尔达德',
    '沙赫里瓦尔',
    '梅赫尔',
    '阿班',
    '阿扎尔',
    '代伊',
    '巴赫曼', 
    '埃斯芬德',
  ],
  weekdays: ['周六', '周日', '周一', '周二', '周三', '周四', '周五'],
  weekdaysFull: ['星期六', '星期日', '星期一', '星期二', '星期三', '星期四', '星期五'],
  direction: 'ltr',
  numberSystem: 'chinese',
  todayText: '今天',
  selectDateText: '选择日期',
  selectTimeText: '选择时间',
  confirmText: '确认',
  cancelText: '取消',
  clearText: '清除',
  hourText: '小时',
  minuteText: '分钟',
  periodText: '时段',
  selectedTimeText: '选定时间',
  startDateText: '开始日期',
  endDateText: '结束日期',
  calendarType: 'jalali',
};

localeManager.register('zh', zhLocale);

export default zhLocale;
