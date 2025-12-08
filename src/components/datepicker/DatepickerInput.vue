<template>
  <div class="datepicker">
    <div class="datepicker__input-container">
      <BaseInput
        ref="inputRef"
        type="text"
        class="datepicker__input"
        :model-value="formattedDate"
        :placeholder="computedPlaceholder"
        :style="{ fontFamily }"
        readonly
        @click="togglePicker"
      />

      <BaseButton type="button" variant="icon" class="datepicker__input-icon" @click="togglePicker">
        <template #icon-left>
          <CalendarIcon />
        </template>
      </BaseButton>
    </div>

    <Transition name="datepicker-fade">
      <div v-if="isOpen" class="datepicker__overlay" @click="closePicker">
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
            @confirm="handleConfirm"
            @close="closePicker"
            @change="handleChange"
            @update:locale="handleLocaleChange"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
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

  const formattedDate = computed(() => {
    if (!internalValue.value) return '';

    const formatSingle = (date) => {
      const { jy, jm, jd, hour, minute } = date;
      const numberSystem = i18nStore.numberSystem;

      let str = props.format
        .replace('YYYY', jy)
        .replace('MM', String(jm).padStart(2, '0'))
        .replace('DD', String(jd).padStart(2, '0'));
      str = toLocalizedNumbers(str, numberSystem);

      if (props.enableTime && hour != null && minute != null) {
        const h = toLocalizedNumbers(String(hour).padStart(2, '0'), numberSystem);
        const m = toLocalizedNumbers(String(minute).padStart(2, '0'), numberSystem);
        str += ` ${h}:${m}`;
      }
      return str;
    };

    if (props.mode === 'range') {
      const { start, end } = internalValue.value || {};
      if (!start) return '';
      return end ? `${formatSingle(start)} - ${formatSingle(end)}` : formatSingle(start);
    }

    if (props.mode === 'multiple') {
      if (!Array.isArray(internalValue.value) || !internalValue.value.length) return '';
      return internalValue.value.map(formatSingle).join('، ');
    }

    return formatSingle(internalValue.value);
  });

  const togglePicker = () => {
    isOpen.value = !isOpen.value;
    emit(isOpen.value ? 'open' : 'close');
  };

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

  const handleChange = (date) => emit('change', date);
  const handleLocaleChange = (newLocale) => emit('update:locale', newLocale);

  const internalValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });
</script>

<style scoped lang="scss">
  .datepicker {
    &-wrapper {
      position: relative;
      max-width: 250px;
    }

    &__input-container {
      position: relative;
      width: 100%;
    }

    &__input {
      width: 250px;
      padding: 12px 16px;
      border: 1px solid $gray-200;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      background-color: $white-100;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: $primary-500;
      }

      &::placeholder {
        color: $gray-300;
      }

      &-icon {
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

        &:hover {
          color: $primary-500;
        }
      }
    }

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
