<template>
  <main class="datepicker-wrapper">
    <div class="datepicker-input-container">
      <BaseInput
        ref="inputRef"
        type="text"
        class="datepicker-input"
        :model-value="formattedDate"
        :placeholder="computedPlaceholder"
        :style="{ fontFamily: fontFamily }"
        readonly
        @click="togglePicker"
      />
      <BaseButton type="button" variant="icon" class="datepicker-input__icon" @click="togglePicker">
        <template #icon-left>
          <CalendarIcon />
        </template>
      </BaseButton>
    </div>

    <Transition name="datepicker-fade">
      <div v-if="isOpen" class="datepicker-overlay" @click="closePicker">
        <div class="datepicker-container" @click.stop>
          <DatePicker
            v-model="internalValue"
            :mode="mode"
            :min-date="minDate"
            :max-date="maxDate"
            :min-year="minYear"
            :max-year="maxYear"
            :locale="currentLocale"
            :enable-time="enableTime"
            :time-format="timeFormat"
            :enable-locale-selector="enableLocaleSelector"
            @confirm="handleConfirm"
            @close="closePicker"
            @change="handleChange"
            @update:locale="handleLocaleChange"
          />
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import DatePicker from './DatePicker.vue';
  import CalendarIcon from '../icons/CalendarIcon.vue';
  import BaseInput from '../base/BaseInput.vue';
  import BaseButton from '../base/BaseButton.vue';
  import { toLocalizedNumbers } from '@/locales';
  import { useI18nStore } from '@/store/i18n';

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
    placeholder: {
      type: String,
      default: null,
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    locale: {
      type: String,
      default: null,
    },
    minDate: {
      type: [Date, String],
      default: null,
    },
    maxDate: {
      type: [Date, String],
      default: null,
    },
    minYear: {
      type: Number,
      default: null,
    },
    maxYear: {
      type: Number,
      default: null,
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
  const isOpen = ref(false);
  const internalValue = ref(props.modelValue);
  const inputRef = ref(null);
  const currentLocale = computed(() => props.locale || i18nStore.currentLocale);
  const computedPlaceholder = computed(
    () => props.placeholder || i18nStore.getText('selectDateText'),
  );

  const fontFamily = computed(() => {
    const fontMap = {
      jalali: 'IRANYekan',
      hijri: 'IRANYekan',
      gregorian: 'Arial, sans-serif',
      chinese: 'Microsoft YaHei, SimHei, sans-serif',
    };
    return fontMap[i18nStore.calendarType] || 'Arial, sans-serif';
  });

  function formatSingleDate(date) {
    if (!date) return '';
    const { jy, jm, jd, hour, minute } = date;
    let formatted = props.format;

    const numberSystem = i18nStore.numberSystem;

    formatted = formatted.replace('YYYY', jy);
    formatted = formatted.replace('MM', String(jm).padStart(2, '0'));
    formatted = formatted.replace('DD', String(jd).padStart(2, '0'));

    let result = toLocalizedNumbers(formatted, numberSystem);

    if (props.enableTime && hour !== undefined && minute !== undefined) {
      const hourStr = String(hour).padStart(2, '0');
      const minuteStr = String(minute).padStart(2, '0');
      result += ` ${toLocalizedNumbers(hourStr, numberSystem)}:${toLocalizedNumbers(minuteStr, numberSystem)}`;
    }

    return result;
  }

  const formattedDate = computed(() => {
    if (!internalValue.value) return '';

    if (props.mode === 'range') {
      const { start, end } = internalValue.value;
      if (!start) return '';
      const startFormatted = formatSingleDate(start);
      if (!end) return startFormatted;
      const endFormatted = formatSingleDate(end);
      return `${startFormatted} - ${endFormatted}`;
    }

    if (props.mode === 'multiple') {
      if (!Array.isArray(internalValue.value) || internalValue.value.length === 0) return '';
      const formattedDates = internalValue.value.map(formatSingleDate);
      return formattedDates.join('، ');
    }

    return formatSingleDate(internalValue.value);
  });

  function togglePicker() {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      emit('open');
    } else {
      emit('close');
    }
  }

  function closePicker() {
    isOpen.value = false;
    emit('close');
  }

  function handleConfirm(date) {
    internalValue.value = date;
    emit('update:modelValue', date);
    emit('confirm', date);
    closePicker();
  }

  function handleChange(date) {
    emit('change', date);
  }

  function handleLocaleChange(newLocale) {
    emit('update:locale', newLocale);
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      internalValue.value = newValue;
    },
  );
</script>

<style scoped lang="scss">
  .datepicker-wrapper {
    position: relative;
    width: 250px;
  }

  .datepicker-input-container {
    position: relative;
    width: 100%;
  }

  .datepicker-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid $gray-200;
    border-radius: 8px;
    font-size: 14px;
    font-variant-numeric: normal;
    cursor: pointer;
    transition: all 0.2s;
    background-color: $white-100;

    &:focus {
      outline: none;
      border-color: $primary-500;
    }
    &::placeholder {
      color: $gray-300;
    }
  }

  .datepicker-input__icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $gray-300;
    transition: color 0.2s;
  }

  .datepicker-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .datepicker-container {
    position: relative;
    z-index: 1001;
  }

  .datepicker-fade-enter-active,
  .datepicker-fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .datepicker-fade-enter-from,
  .datepicker-fade-leave-to {
    opacity: 0;
  }

  .datepicker-fade-enter-active .datepicker-container {
    animation: slideUp 0.3s ease;
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
</style>
