<template>
  <div class="datepicker">
    <DatepickerHeader
      :current-view="navigation.currentView.value"
      :current-month="navigation.currentMonth.value"
      :current-year="navigation.currentYear.value"
      :enable-locale-selector="enableLocaleSelector"
      :locale="selectedLocale"
      :navigation="navigation"
      @close="handleClose"
      @toggle-view="toggleView"
      @update:locale="handleLocaleUpdate"
      @select-month="selectMonth"
      @select-year="selectYear"
    />
    <DatepickerContent
      :locale="currentLocale"
      :mode="props.mode"
      :initial-value="props.modelValue"
      :min-date="props.minDate"
      :max-date="props.maxDate"
      :enable-time="props.enableTime"
      :time-format="props.timeFormat"
      :enable-locale-selector="props.enableLocaleSelector"
      :current-view="navigation.currentView.value"
      :navigation="navigation"
      @update:selected-date="dateSelect"
      @update:range-selection="rangeSelect"
      @update:multiple-selection="multipleSelect"
      @update:locale="localeChange"
      ref="datepickerContentRef"
    />
    <BaseButton variant="primary" type="submit" size="medium" block @click="handleConfirm">
      {{ confirmButtonText }}
    </BaseButton>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
  import DatepickerContent from '../datepicker/DatepickerContent.vue';
  import DatepickerHeader from '../datepicker/DatepickerHeader.vue';
  import BaseButton from '../base/BaseButton.vue';
  import { useI18nStore } from '@/store/i18n';
  import { useNavigation } from '@/composables/datepicker/useNavigation.js';

  const props = defineProps({
    modelValue: {
      type: [Object, String],
      default: null,
    },
    locale: {
      type: String,
      default: 'fa',
    },
    mode: {
      type: String,
      default: 'single',
    },
    minDate: {
      type: [Object, String],
      default: null,
    },
    maxDate: {
      type: [Object, String],
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
    'confirm',
    'open',
    'close',
    'change',
    'update:locale',
  ]);

  const i18nStore = useI18nStore();
  const selectedLocale = ref(props.locale || i18nStore.currentLocale);
  const datepickerContentRef = ref(null);
  const currentLocale = ref(props.locale || i18nStore.currentLocale);
  const navigation = useNavigation(props.modelValue, {
    yearsBefore: props.yearsBefore,
    yearsAfter: props.yearsAfter,
  });

  watch(
    () => props.locale,
    (newLocale) => {
      if (newLocale && newLocale !== currentLocale.value) {
        currentLocale.value = newLocale;
        i18nStore.setLocale(newLocale);
      }
    },
  );

  watch(currentLocale, (newLocale) => {
    i18nStore.setLocale(newLocale);
  });

  const confirmButtonText = computed(() => i18nStore.getText('confirmText'));

  function localeChange(newLocale) {
    currentLocale.value = newLocale;
    emit('update:locale', newLocale);
  }

  function dateSelect(date) {
    emit('change', date);
  }

  function rangeSelect(range) {
    emit('change', range);
  }

  function multipleSelect(dates) {
    emit('change', dates);
  }

  function handleConfirm() {
    if (datepickerContentRef.value) {
      const confirmedDate = datepickerContentRef.value.confirmSelection();
      if (confirmedDate) {
        emit('update:modelValue', confirmedDate);
        emit('confirm', confirmedDate);
      }
    }
  }

  function handleClose() {
    emit('close');
  }

  function handleLocaleUpdate(newLocale) {
    selectedLocale.value = newLocale;
    currentLocale.value = newLocale;
    i18nStore.setLocale(newLocale);
    emit('update:locale', newLocale);
  }

  function toggleView(view) {
    navigation.toggleView(view);
  }

  function selectMonth(month) {
    navigation.setMonth(month);
  }

  function selectYear(year) {
    navigation.setYear(year);
  }

  onMounted(() => {
    emit('open');
  });

  onUnmounted(() => {
    emit('close');
  });
</script>

<style scoped lang="scss">
  .datepicker {
    background-color: $gray-100;
    width: 360px;
    padding: 24px 16px 16px 16px;
    border-radius: $radius-8;
    @include flex(column, space-between, 20px);
  }
</style>
