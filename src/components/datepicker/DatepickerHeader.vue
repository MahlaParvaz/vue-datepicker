<template>
  <section class="datepicker__header" :style="{ fontFamily: fontFamily }">
    <CloseButtonIcon
      :width="24"
      :height="24"
      class="datepicker__header-close"
      @click="$emit('close')"
    />
    <p>{{ i18nStore.getText('selectDateText') }}</p>
  </section>

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
      v-for="month in MONTHS"
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
  import { computed } from 'vue';
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
  });

  const emit = defineEmits([
    'close',
    'toggle-view',
    'update:locale',
    'select-month',
    'select-year',
  ]);

  const i18nStore = useI18nStore();
  const selectedLocale = computed({
    get() {
      return props.locale || i18nStore.currentLocale;
    },
    set(value) {
      emit('update:locale', value);
    },
  });

  const availableLocales = computed(() => i18nStore.availableLocales);
  const MONTHS = computed(() =>
    Array.from({ length: CALENDAR_CONFIG.MONTHS_IN_YEAR }, (_, i) => i + 1),
  );

  const fontFamily = computed(() => {
    const fontMap = {
      jalali: 'IRANYekan',
      hijri: ' Arial, sans-serif',
      gregorian: 'Arial, sans-serif',
      chinese: 'Microsoft YaHei, SimHei, sans-serif',
    };
    return fontMap[i18nStore.calendarType] || 'Arial, sans-serif';
  });

  function getMonthName(month) {
    return i18nStore.getMonthName(month);
  }

  function formatNumber(value) {
    return toLocalizedNumbers(value, i18nStore.numberSystem);
  }

  function onToggleView(view) {
    emit('toggle-view', view);
  }

  function selectMonth(month) {
    emit('select-month', month);
  }

  function selectYear(year) {
    emit('select-year', year);
  }

  function nextYearRange() {
    for (let i = 0; i < CALENDAR_CONFIG.YEARS_TO_SHOW; i++) {
      props.navigation.nextYear();
    }
  }

  function prevYearRange() {
    for (let i = 0; i < CALENDAR_CONFIG.YEARS_TO_SHOW; i++) {
      props.navigation.prevYear();
    }
  }
</script>

<style lang="scss" scoped>
  .datepicker {
    &__header {
      @include customFlex(row, start, center);
      font-weight: 400;
      font-size: 12px;
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
      @include customFlex(row, space-between, center, 8px);
      margin-bottom: 20px;
      &-btn {
        height: 24px;
        padding: 0;
        border: none;
      }
    }
  }

  .datepicker-content {
    &__months,
    &__years {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 12px;
      column-gap: 29px;
      width: 100%;
      &-btn--active {
        background-color: $primary-500;
        color: $white-100;
      }
    }

    &__years-controls {
      @include customFlex(row, space-between, center);
      height: 24px;
      cursor: pointer;
      margin-bottom: 20px;
      &-year {
        font-weight: 400;
        font-size: 12px;
      }
    }
  }
</style>
