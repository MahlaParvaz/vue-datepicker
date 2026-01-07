import { ref, computed } from 'vue';
import { transformOutput } from '@/utils/datepicker/outputFormatter';

/**
 * * Composable for managing datepicker state, v-model binding, and output transformations.
 * 
 * @param {Object} props - Component props.
 * @param {*} props.modelValue - Current v-model value.
 * @param {*} props.outputFormat - Format for output transformation.
 * @param {string} props.outputStringFormat - String format for output transformation.
 * @param {boolean} [props.disabled=false] - Whether the datepicker is disabled.
 * @param {Function} emit - Vue emit function.
 *
 * @returns {Object} State management utilities.
 * @returns {import('vue').Ref<boolean>} isOpen - Whether the picker is open.
 * @returns {import('vue').ComputedRef<any>} internalValue - Reactive internal value synced with v-model.
 * @returns {Function} open - Opens the datepicker.
 * @returns {Function} close - Closes the datepicker.
 * @returns {Function} toggle - Toggles the datepicker open state.
 * @returns {Function} handleConfirm - Handles date confirmation, updates v-model, emits confirm event.
 * @returns {Function} handleChange - Handles date change, emits change event.
 * @returns {Function} handleLocaleChange - Handles locale change, emits update:locale event.
 */
export const usePickerState = (props, emit) => {
  const isOpen = ref(false);
  const internalState = ref(props.modelValue);

  const internalValue = computed({
    get: () => props.modelValue ?? internalState.value,
    set: (val) => {
      internalState.value = val;
      const transformed = transformOutput(val, props.outputFormat, props.outputStringFormat);
      emit('update:modelValue', transformed);
    },
  });

  const open = () => {
    if (props.disabled) return;
    isOpen.value = true;
    emit('open');
  };

  const close = () => {
    isOpen.value = false;
    emit('close');
  };

  const toggle = () => {
    if (props.disabled) return;
    isOpen.value ? close() : open();
  };

  const handleConfirm = (date) => {
    internalState.value = date;
    const transformed = transformOutput(date, props.outputFormat, props.outputStringFormat);
    emit('update:modelValue', transformed);
    emit('confirm', transformed);
    close();
  };

  const handleChange = (date) => {
    const transformed = transformOutput(date, props.outputFormat, props.outputStringFormat);
    emit('change', transformed);
  };

  const handleLocaleChange = (newLocale) => {
    emit('update:locale', newLocale);
  };

  return {
    isOpen,
    internalValue,
    open,
    close,
    toggle,
    handleConfirm,
    handleChange,
    handleLocaleChange,
  };
};
