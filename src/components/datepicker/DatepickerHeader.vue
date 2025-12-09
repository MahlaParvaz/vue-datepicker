<template>
  <div class="datepicker__header" :style="{ fontFamily }">
    <CloseButtonIcon
      :width="24"
      :height="24"
      class="datepicker__header-close"
      @click="$emit('close')"
    />
    <p>{{ i18nStore.getText('selectDateText') }}</p>
  </div>

  <div v-if="currentView !== 'years'" class="datepicker__controls">
    <DatePickerLocaleSelector
      v-if="enableLocaleSelector"
      v-model="selectedLocale"
      :available-locales="availableLocales"
    />

    <BaseButton
      variant="outline"
      type="button"
      size="small"
      class="datepicker__controls-btn"
      @click="onToggleView('months')"
    >
      <template #icon-right>
        <ArrowDownIcon :width="24" :height="24" />
      </template>
      {{ getMonthName(currentMonth) }}
    </BaseButton>

    <BaseButton
      variant="outline"
      type="button"
      size="small"
      class="datepicker__controls-btn"
      @click="onToggleView('years')"
      :style="{ fontFamily: fontFamily }"
    >
      <template #icon-right>
        <ArrowDownIcon :width="24" :height="24" />
      </template>
      {{ formatNumber(currentYear) }}
    </BaseButton>
  </div>

  <template v-if="props.currentView === 'years'">
    <div class="datepicker-content__years-controls" :style="{ fontFamily: fontFamily }">
      <ArrowRightIcon :width="24" :height="24" @click="prevYearRange" />
      <p class="datepicker-content__years-controls-year">
        {{ formatNumber(navigation.currentYear.value) }}
      </p>
      <ArrowLeftIcon :width="24" :height="24" @click="nextYearRange" />
    </div>
    <div class="datepicker-content__years">
      <BaseButton
        v-for="year in navigation.yearRange.value"
        :key="year"
        :ref="(el) => setYearRef(el, year)"
        variant="secondary"
        size="small"
        :style="{ fontFamily: fontFamily }"
        :class="{
          'datepicker-content__years-btn--active': navigation.currentYear.value === year,
        }"
        @click="selectYear(year)"
      >
        {{ formatNumber(year) }}
      </BaseButton>
    </div>
  </template>

  <div v-if="props.currentView === 'months'" class="datepicker-content__months">
    <BaseButton
      v-for="month in months"
      :key="month"
      variant="secondary"
      size="small"
      :class="{
        'datepicker-content__months-btn--active': navigation.currentMonth.value === month,
      }"
      @click="selectMonth(month)"
    >
      {{ getMonthName(month) }}
    </BaseButton>
  </div>
</template>

<script setup>
  import { computed, ref, watch, nextTick } from 'vue';
  import CloseButtonIcon from '../icons/CloseButtonIcon.vue';
  import BaseButton from '../base/BaseButton.vue';
  import ArrowDownIcon from '../icons/ArrowDownIcon.vue';
  import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue';
  import ArrowRightIcon from '../icons/ArrowRightIcon.vue';
  import DatePickerLocaleSelector from './DatePickerLocaleSelector.vue';
  import { useI18nStore } from '@/store/i18n';
  import { toLocalizedNumbers } from '@/locales/numberFormatter.js';
  import { CALENDAR_CONFIG } from '@/constants/datepicker.js';

  const props = defineProps({
    currentView: {
      type: String,
      default: 'days',
    },
    currentMonth: {
      type: Number,
      default: 1,
    },
    currentYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    enableLocaleSelector: {
      type: Boolean,
      default: true,
    },
    locale: {
      type: String,
      default: null,
    },
    navigation: {
      type: Object,
      required: true,
    },
    fontConfig: {
      type: Object,
      default: null,
    },
  });

  const emit = defineEmits([
    'close',
    'toggle-view',
    'update:locale',
    'select-month',
    'select-year',
  ]);

  const i18nStore = useI18nStore();
  const yearButtonRefs = ref({});

  const selectedLocale = computed({
    get() {
      return props.locale || i18nStore.currentLocale;
    },
    set(value) {
      emit('update:locale', value);
    },
  });

  const availableLocales = computed(() => i18nStore.availableLocales);
  const months = computed(() =>
    Array.from({ length: CALENDAR_CONFIG.MONTHS_IN_YEAR }, (_, i) => i + 1),
  );

  const DEFAULT_FONT_MAP = {
    jalali: 'IRANYekan',
    hijri: 'IRANYekan',
    gregorian: 'Arial, sans-serif',
    chinese: 'Microsoft YaHei, SimHei, sans-serif',
  };

  const fontFamily = computed(() => {
    const fonts = { ...DEFAULT_FONT_MAP, ...props.fontConfig };
    return fonts[i18nStore.calendarType] || 'Arial, sans-serif';
  });

  const getMonthName = (month) => i18nStore.getMonthName(month);

  const formatNumber = (value) => toLocalizedNumbers(value, i18nStore.numberSystem);

  const onToggleView = (view) => emit('toggle-view', view);

  const selectMonth = (month) => emit('select-month', month);

  const selectYear = (year) => emit('select-year', year);

  const shiftYearRange = async (direction) => {
    const method = direction === 'next' ? 'nextYear' : 'prevYear';
    for (let i = 0; i < CALENDAR_CONFIG.YEARS_TO_SHOW; i++) {
      props.navigation[method]();
    }
    await nextTick();
    scrollToCurrentYear();
  };
  const nextYearRange = () => shiftYearRange('next');
  const prevYearRange = () => shiftYearRange('prev');

  function setYearRef(el, year) {
    if (el) {
      yearButtonRefs.value[year] = el;
    }
  }

  const scrollToCurrentYear = () => {
    const el = yearButtonRefs.value[props.navigation.currentYear.value]?.$el;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  watch(
    () => props.currentView,
    async (newView) => {
      if (newView === 'years') {
        await nextTick();
        scrollToCurrentYear();
      }
    },
  );
</script>

<style lang="scss" scoped>
  .datepicker {
    &__header {
      @include flex(row, start, center);
      font-weight: var(--datepicker-font-weight-normal);
      font-size: var(--datepicker-font-size-12);
      width: 100%;
      &-close {
        cursor: pointer;
      }
      p {
        width: 100%;
        text-align: center;
      }
    }

    &__controls {
      @include flex(row, space-between, center, var(--datepicker-spacing-8));
      margin-bottom: var(--datepicker-spacing-20);
      &-btn {
        height: var(--datepicker-button-height);
        padding: 0;
        border: none;
      }
    }
  }

  .datepicker-content {
    direction: rtl;
    &__months {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: var(--datepicker-spacing-12);
      column-gap: var(--datepicker-spacing-24);
      width: 100%;
      &-btn--active {
        @include button-active;
      }
    }

    &__months {
      max-height: none;
      overflow: visible;
    }

    &__years {
      direction: ltr;
      max-height: var(--datepicker-years-max-height);
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: var(--datepicker-spacing-12);
      @include flex(row, space-between, center, var(--datepicker-spacing-12), wrap);
      @include custom-scrollbar;

      &-btn--active {
        @include button-active;
      }
    }

    &__years-controls {
      @include flex(row, space-between, center);
      height: var(--datepicker-button-height);
      cursor: pointer;
      margin-bottom: var(--datepicker-spacing-20);
      &-year {
        font-weight: var(--datepicker-font-weight-normal);
        font-size: var(--datepicker-font-size-12);
      }
    }
  }
</style>
