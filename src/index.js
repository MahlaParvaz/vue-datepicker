import './assets/styles/main.scss';
import DatePicker from './components/datepicker/DatePicker.vue';
import DatepickerHeadless from './components/datepicker/DatepickerHeadless.vue';
import { OUTPUT_FORMATS } from './utils/datepicker/outputFormatter';

// Export composables for custom implementations
export { usePickerState } from './composables/datepicker/usePickerState';
export { useDateFormatting } from './composables/datepicker/useDateFormatting';

// Export main components
export { DatePicker, DatepickerHeadless, OUTPUT_FORMATS };

// Default export is the headless component for maximum flexibility
export default DatepickerHeadless;
