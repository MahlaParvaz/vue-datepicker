import './assets/styles/main.scss';
import DatePicker from './components/datepicker/DatePicker.vue';
import DatepickerInput from './components/datepicker/DatepickerInput.vue';

export { DatePicker, DatepickerInput };

export {
  localeManager,
  createLocaleManager,
  faLocale,
  enLocale,
  arLocale,
  enGregorianLocale,
  zhLocale,
} from './locales/index.js';

export { useLocale } from './composables/datepicker/useLocale.js';

export default DatePicker;
