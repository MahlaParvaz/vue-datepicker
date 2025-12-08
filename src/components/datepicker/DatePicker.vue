<template>
  <div class="datepicker">
    <DatepickerHeader
      :current-view="navigation.currentView.value"
      :current-month="navigation.currentMonth.value"
      :current-year="navigation.currentYear.value"
      :enable-locale-selector="enableLocaleSelector"
      :locale="currentLocale"
      :navigation="navigation"
      @close="handleClose"
      @toggle-view="toggleView"
      @update:locale="handleLocaleUpdate"
      @select-month="selectMonth"
      @select-year="selectYear"
    />
    <DatepickerContent
      ref="datepickerContentRef"
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
      @update:selected-date="handleChange"
      @update:range-selection="handleChange"
      @update:multiple-selection="handleChange"
      @update:locale="handleLocaleUpdate"
    />
    <BaseButton variant="primary" type="submit" size="medium" block @click="handleConfirm">
      {{ confirmButtonText }}
    </BaseButton>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import DatepickerContent from '../datepicker/DatepickerContent.vue';
  import DatepickerHeader from '../datepicker/DatepickerHeader.vue';
  import BaseButton from '../base/BaseButton.vue';
  import { useI18nStore } from '@/store/i18n';
  import { useNavigation } from '@/composables/datepicker/useNavigation.js';

  const props = defineProps({
    modelValue: [Object, String],
    locale: { type: String, default: 'fa' },
    mode: { type: String, default: 'single' },
    minDate: [Object, String],
    maxDate: [Object, String],
    yearsBefore: { type: Number, default: 50 },
    yearsAfter: { type: Number, default: 50 },
    enableTime: { type: Boolean, default: false },
    timeFormat: { type: [String, Number], default: 24 },
    enableLocaleSelector: { type: Boolean, default: true },
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
  const datepickerContentRef = ref(null);

  const navigation = useNavigation(props.modelValue, {
    yearsBefore: props.yearsBefore,
    yearsAfter: props.yearsAfter,
  });

  const currentLocale = computed({
    get: () => props.locale ?? i18nStore.currentLocale,
    set: (value) => {
      i18nStore.setLocale(value);
      emit('update:locale', value);
    },
  });

  const confirmButtonText = computed(() => i18nStore.getText('confirmText'));

  const handleChange = (value) => emit('change', value);

  function handleConfirm() {
    const confirmedDate = datepickerContentRef.value?.confirmSelection();
    if (!confirmedDate) return;

    emit('update:modelValue', confirmedDate);
    emit('confirm', confirmedDate);
  }

  const handleLocaleUpdate = (newLocale) => (currentLocale.value = newLocale);

  const handleClose = () => emit('close');

  const toggleView = (view) => navigation.toggleView(view);
  const selectMonth = (month) => navigation.setMonth(month);
  const selectYear = (year) => navigation.setYear(year);
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
