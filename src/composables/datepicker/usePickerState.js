import { ref, computed } from 'vue';
import { transformOutput } from '@/utils/datepicker/outputFormatter';

/**
 * Composable for managing datepicker state and transformations
 * @param {Object} props - Component props
 * @param {Function} emit - Emit function
 * @returns {Object} State management utilities
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
