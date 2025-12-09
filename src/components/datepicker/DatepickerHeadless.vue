<template>
  <slot
    :open="open"
    :close="close"
    :toggle="toggle"
    :is-open="isOpen"
    :value="internalValue"
    :formatted-date="formattedDate"
    :font-family="fontFamily"
  />

  <Transition name="datepicker-fade">
    <div v-if="isOpen" class="datepicker__overlay" @click="close">
      <div class="datepicker__overlay-content" @click.stop>
        <DatePicker
          v-model="internalValue"
          :mode="mode"
          :min-date="minDate"
          :max-date="maxDate"
          :years-before="yearsBefore"
          :years-after="yearsAfter"
          :locale="currentLocale"
          :enable-time="enableTime"
          :time-format="timeFormat"
          :enable-locale-selector="enableLocaleSelector"
          :font-config="fontConfig"
          :theme="theme"
          @confirm="handleConfirm"
          @change="handleChange"
          @close="close"
          @update:locale="handleLocaleChange"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { computed } from 'vue';
  import DatePicker from './DatePicker.vue';
  import { useI18nStore } from '@/store/i18n';
  import { usePickerState } from '@/composables/datepicker/usePickerState';
  import { useDateFormatting } from '@/composables/datepicker/useDateFormatting';

  const props = defineProps({
    modelValue: {
      type: Object,
      default: null,
    },
    mode: {
      type: String,
      default: 'single',
      validator: (value) => ['single', 'range', 'multiple'].includes(value),
    },
    locale: {
      type: String,
      default: null,
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    minDate: {
      type: [Date, String],
      default: null,
    },
    maxDate: {
      type: [Date, String],
      default: null,
    },
    yearsBefore: {
      type: Number,
      default: 50,
    },
    yearsAfter: {
      type: Number,
      default: 50,
    },
    enableTime: {
      type: Boolean,
      default: false,
    },
    timeFormat: {
      type: [String, Number],
      default: 24,
    },
    enableLocaleSelector: {
      type: Boolean,
      default: true,
    },
    outputFormat: {
      type: [String, Function],
      default: 'object',
      validator: (value) => {
        if (typeof value === 'function') return true;
        return ['object', 'timestamp', 'unix', 'iso', 'string'].includes(value);
      },
    },
    outputStringFormat: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fontConfig: {
      type: Object,
      default: null,
      validator: (value) => {
        if (!value) return true;
        const validKeys = ['jalali', 'hijri', 'gregorian', 'chinese'];
        return Object.keys(value).every((key) => validKeys.includes(key));
      },
    },
    theme: {
      type: Object,
      default: null,
      validator: (value) => {
        if (!value) return true;
        const validKeys = [
          'colors',
          'radius',
          'spacing',
          'fontSize',
          'fontWeight',
          'dimensions',
          'grid',
          'transitions',
          'range',
          'scrollbar',
        ];
        return Object.keys(value).every((key) => validKeys.includes(key));
      },
    },
  });

  const emit = defineEmits([
    'update:modelValue',
    'change',
    'confirm',
    'open',
    'close',
    'update:locale',
  ]);

  const i18nStore = useI18nStore();

  const currentLocale = computed(() => props.locale || i18nStore.currentLocale);

  const {
    isOpen,
    internalValue,
    open,
    close,
    toggle,
    handleConfirm,
    handleChange,
    handleLocaleChange,
  } = usePickerState(props, emit);

  const { formattedDate, fontFamily } = useDateFormatting(internalValue, {
    mode: props.mode,
    format: props.format,
    enableTime: props.enableTime,
    fontConfig: props.fontConfig,
  });

  defineExpose({
    open,
    close,
    toggle,
    isOpen,
  });
</script>

<style scoped lang="scss">
  .datepicker {
    &__overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;

      &-content {
        position: relative;
        z-index: 1001;
        animation: slideUp 0.3s ease;
      }
    }

    &-fade-enter-active,
    &-fade-leave-active {
      transition: opacity 0.2s ease;
    }

    &-fade-enter-from,
    &-fade-leave-to {
      opacity: 0;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
</style>
