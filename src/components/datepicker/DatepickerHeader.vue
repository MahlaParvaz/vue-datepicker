<template>
  <div class="datepicker__header" :style="{ fontFamily }">
    <slot name="close-icon" :on-close="handleClose">
      <CloseButtonIcon
        :width="24"
        :height="24"
        class="datepicker__header-close"
        @click="handleClose"
      />
    </slot>
    <p>{{ i18nStore.getText('selectDateText') }}</p>
  </div>

  <div v-if="currentView !== 'years'" class="datepicker__controls">
    <DatePickerLocaleSelector
      v-if="enableLocaleSelector"
      v-model="selectedLocale"
      :available-locales="availableLocales"
    >
      <template v-if="$slots['locale-dropdown-icon']" #dropdown-icon="slotProps">
        <slot name="locale-dropdown-icon" v-bind="slotProps" />
      </template>
    </DatePickerLocaleSelector>

    <BaseButton
      variant="outline"
      type="button"
      size="small"
      class="datepicker__controls-btn"
      @click="onToggleView('months')"
    >
      <template #icon-right>
        <slot name="dropdown-icon" :size="24">
          <ArrowDownIcon :width="24" :height="24" />
        </slot>
      </template>
      {{ getMonthName(currentMonth) }}
    </BaseButton>

    <BaseButton
      variant="outline"
      type="button"
      size="small"
      class="datepicker__controls-btn"
      @click="onToggleView('years')"
      :style="{ fontFamily }"
    >
      <template #icon-right>
        <slot name="dropdown-icon" :size="24">
          <ArrowDownIcon :width="24" :height="24" />
        </slot>
      </template>
      {{ formatNumber(currentYear) }}
    </BaseButton>
  </div>

  <template v-if="props.currentView === 'years'">
    <div class="datepicker-content__years-controls" :style="{ fontFamily }">
      <slot name="arrow-right-icon" :size="24" :on-click="prevYearRange">
        <ArrowRightIcon :width="24" :height="24" @click="prevYearRange" />
      </slot>
      <p class="datepicker-content__years-controls-year">
        {{ formatNumber(navigation.currentYear.value) }}
      </p>
      <slot name="arrow-left-icon" :size="24" :on-click="nextYearRange">
        <ArrowLeftIcon :width="24" :height="24" @click="nextYearRange" />
      </slot>
    </div>
    <div class="datepicker-content__years">
      <BaseButton
        v-for="year in navigation.yearRange.value"
        :key="year"
        :ref="(el) => setYearRef(el, year)"
        variant="secondary"
        size="small"
        :style="{ fontFamily }"
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
  import { useFont } from '@/composables/useFont';

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
  const { fontFamily } = useFont(props.fontConfig);
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

  const getMonthName = (month) => i18nStore.getMonthName(month);

  const formatNumber = (value) => toLocalizedNumbers(value, i18nStore.numberSystem);

  const handleClose = () => emit('close');

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
      font-weight: font-weight(normal);
      font-size: font-size(12);
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
      @include flex(row, space-between, center, space(8));
      margin-bottom: space(20);

      &-btn {
        height: size(button-height);
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
      row-gap: space(12);
      column-gap: space(24);
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
      max-height: size(years-max-height);
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: space(12);
      @include flex(row, space-between, center, space(12), wrap);
      @include custom-scrollbar;

      &-btn--active {
        @include button-active;
      }
    }

    &__years-controls {
      @include flex(row, space-between, center);
      height: size(button-height);
      cursor: pointer;
      margin-bottom: space(20);

      &-year {
        font-weight: font-weight(normal);
        font-size: font-size(12);
      }
    }
  }
</style>
