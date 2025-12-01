<template>
  <section class="datepicker">
    <DatepickerHeader @close="handleClose" />
    <DatepickerContent
      :locale="currentLocale"
      :mode="props.mode"
      :initial-value="props.modelValue"
      :min-date="props.minDate"
      :max-date="props.maxDate"
      :enable-time="props.enableTime"
      :time-format="props.timeFormat"
      :enable-locale-selector="props.enableLocaleSelector"
      @update:selected-date="onDateSelect"
      @update:range-selection="onRangeSelect"
      @update:multiple-selection="onMultipleSelect"
      @update:locale="onLocaleChange"
      ref="contentRef"
    />
    <BaseButton variant="primary" type="submit" size="medium" block @click="handleConfirm">
      {{ confirmButtonText }}
    </BaseButton>
  </section>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
  import DatepickerContent from '../datepicker/DatepickerContent.vue';
  import DatepickerHeader from '../datepicker/DatepickerHeader.vue';
  import BaseButton from '../base/BaseButton.vue';
  import { useDatePickerLocale } from '@/composables/datepicker/useDatePickerLocale.js';

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

  const emit = defineEmits(['update:modelValue', 'confirm', 'open', 'close', 'change', 'update:locale']);

  const contentRef = ref(null);
  const currentLocale = ref(props.locale);
  const localeHelper = useDatePickerLocale(currentLocale.value);

  watch(() => props.locale, (newLocale) => {
    if (newLocale !== currentLocale.value) {
      currentLocale.value = newLocale;
      localeHelper.setLocale(newLocale);
    }
  });

  watch(currentLocale, (newLocale) => {
    localeHelper.setLocale(newLocale);
  });

  const confirmButtonText = computed(() => localeHelper.getText('confirmText'));

  function onLocaleChange(newLocale) {
    currentLocale.value = newLocale;
    emit('update:locale', newLocale);
  }

  function onDateSelect(date) {
    emit('change', date);
  }

  function onRangeSelect(range) {
    emit('change', range);
  }

  function onMultipleSelect(dates) {
    emit('change', dates);
  }

  function handleConfirm() {
    if (contentRef.value) {
      const confirmedDate = contentRef.value.confirmSelection();
      if (confirmedDate) {
        emit('update:modelValue', confirmedDate);
        emit('confirm', confirmedDate);
      }
    }
  }

  function handleClose() {
    emit('close');
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
    @include customFlex(column, space-between, 12px);
  }
</style>
