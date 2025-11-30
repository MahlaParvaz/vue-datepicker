<template>
  <section class="datepicker-content">
    <div v-if="navigation.currentView.value !== 'years'" class="datepicker-content__controls">
      <DatePickerLocaleSelector
        v-if="enableLocaleSelector"
        v-model="selectedLocale"
        :available-locales="availableLocales"
      />

      <BaseButton
        variant="outline"
        type="button"
        size="small"
        class="datepicker-content__controls-btn"
        @click="toggleView('months')"
      >
        <template #icon-right>
          <ArrowDownIcon :width="24" :height="24" />
        </template>
        {{ getMonthName(navigation.currentMonth.value) }}
      </BaseButton>

      <BaseButton
        variant="outline"
        type="button"
        size="small"
        class="datepicker-content__controls-btn"
        @click="toggleView('years')"
      >
        <template #icon-right>
          <ArrowDownIcon :width="24" :height="24" />
        </template>
        {{ formatNumber(navigation.currentYear.value) }}
      </BaseButton>
    </div>

    <template v-if="navigation.currentView.value === 'years'">
      <div class="datepicker-content__years-controls">
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
          :class="{
            'datepicker-content__years-btn--active': navigation.currentYear.value === year,
          }"
          @click="selectYear(year)"
        >
          {{ formatNumber(year) }}
        </BaseButton>
      </div>
    </template>

    <div v-if="navigation.currentView.value === 'months'" class="datepicker-content__months">
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

    <template v-if="navigation.currentView.value === 'days'">
      <div class="datepicker-content__weekdays">
        <span v-for="weekday in WEEKDAYS" :key="weekday" class="datepicker-content__weekday">
          {{ weekday }}
        </span>
      </div>
      <div class="datepicker-content__days">
        <BaseButton
          v-for="day in calendarDays"
          :key="day.id"
          variant="outline"
          :class="[
            'datepicker-content__day',
            { 'datepicker-content__day--selected': day.isSelected },
            { 'datepicker-content__day--prev-month': day.isPrevMonth },
            { 'datepicker-content__day--next-month': day.isNextMonth },
            { 'datepicker-content__day--in-range': day.isInRange },
            { 'datepicker-content__day--range-start': day.isRangeStart },
            { 'datepicker-content__day--range-end': day.isRangeEnd },
          ]"
          :disabled="day.isDisabled"
          @click="selectDay(day)"
        >
          {{ day.label }}
          <span v-if="day.isToday && !day.isSelected" class="datepicker-content__day-today-text">
            {{ locale.getText('todayText') }}
          </span>
        </BaseButton>
      </div>
    </template>

    <TimePicker
      v-if="props.enableTime && navigation.currentView.value === 'days'"
      :selected-hour="time?.hour.value"
      :selected-minute="time?.minute.value"
      :selected-period="time?.period.value"
      :display-hour="time?.displayHour.value"
      :hours="time?.hours.value || []"
      :minutes="time?.minutes.value || []"
      :time-format="props.timeFormat"
      :to-persian-numbers="toPersianNumbers"
      @select-hour="selectHour"
      @select-minute="selectMinute"
      @toggle-period="togglePeriod"
    />
  </section>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import BaseButton from '../base/BaseButton.vue';
  import ArrowDownIcon from '../icons/ArrowDownIcon.vue';
  import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue';
  import ArrowRightIcon from '../icons/ArrowRightIcon.vue';
  import TimePicker from './TimePicker.vue';
  import { useNavigation } from '@/composables/datepicker/useNavigation.js';
  import { createSelection } from '@/composables/datepicker/useSelection.js';
  import { useTimeSelection } from '@/composables/datepicker/useTimeSelection.js';
  import { useDateConstraints } from '@/composables/datepicker/useDateConstraints.js';
  import { useCalendarGrid } from '@/composables/datepicker/useCalendarGrid.js';
  import { useLocale } from '@/composables/datepicker/useLocale.js';
  import '@/locales/fa.js';
  import '@/locales/ar.js';
  import '@/locales/en.js';
  import '@/locales/zh.js';
  import { CALENDAR_CONFIG } from '@/constants/datepicker.js';
  import DatePickerLocaleSelector from './DatePickerLocaleSelector.vue';

  const props = defineProps({
    locale: { type: String, default: 'fa' },
    mode: { type: String, default: 'single' },
    initialValue: { type: [Object, String], default: null },
    minDate: { type: [Object, String], default: null },
    maxDate: { type: [Object, String], default: null },
    enableTime: { type: Boolean, default: false },
    timeFormat: { type: [String, Number], default: 24 },
    enableLocaleSelector: { type: Boolean, default: true },
  });

  const emit = defineEmits([
    'update:selectedDate',
    'update:currentView',
    'update:rangeSelection',
    'update:multipleSelection',
    'update:locale',
  ]);

  const locale = useLocale(props.locale);
  const selectedLocale = ref(props.locale);

  watch(selectedLocale, (newLocale) => {
    locale.setLocale(newLocale);
    emit('update:locale', newLocale);
  });

  watch(
    () => props.locale,
    (newLocale) => {
      if (newLocale !== selectedLocale.value) {
        selectedLocale.value = newLocale;
        locale.setLocale(newLocale);
      }
    },
  );

  const navigation = useNavigation(props.initialValue);
  const selection = createSelection(props.mode, props.initialValue);
  const constraints = useDateConstraints({ minDate: props.minDate, maxDate: props.maxDate });
  const time = props.enableTime
    ? useTimeSelection({ timeFormat: props.timeFormat, initialValue: props.initialValue })
    : null;

  const { days: calendarDays } = useCalendarGrid({
    year: navigation.currentYear,
    month: navigation.currentMonth,
    selection,
    constraints,
    locale: selectedLocale,
  });

  const availableLocales = computed(() => locale.availableLocales.value);
  const WEEKDAYS = computed(() => locale.localeConfig.value?.weekdays || []);
  const MONTHS = computed(() =>
    Array.from({ length: CALENDAR_CONFIG.MONTHS_IN_YEAR }, (_, i) => i + 1),
  );

  function getMonthName(month) {
    return locale.getMonthName(month);
  }

  function formatNumber(value) {
    return locale.formatNumber(value);
  }

  function toPersianNumbers(value) {
    return locale.formatNumber(value);
  }

  function toggleView(view) {
    navigation.toggleView(view);
    emit('update:currentView', navigation.currentView.value);
  }

  function selectMonth(month) {
    navigation.setMonth(month);
    emit('update:currentView', navigation.currentView.value);
  }

  function selectYear(year) {
    navigation.setYear(year);
    emit('update:currentView', navigation.currentView.value);
  }

  function selectDay(dayObj) {
    if (dayObj.isDisabled) return;

    if (dayObj.isPrevMonth || dayObj.isNextMonth) {
      navigation.goToDate(dayObj.date);
    }

    selection.select(dayObj.date);

    if (props.mode === 'range') {
      emit('update:rangeSelection', selection.getValue());
    } else if (props.mode === 'multiple') {
      emit('update:multipleSelection', selection.getValue());
    } else {
      emit('update:selectedDate', selection.getValue());
    }
  }

  function selectHour(hour) {
    if (time) time.selectHour(hour);
  }

  function selectMinute(minute) {
    if (time) time.selectMinute(minute);
  }

  function togglePeriod() {
    if (time) time.togglePeriod();
  }

  function nextYearRange() {
    for (let i = 0; i < CALENDAR_CONFIG.YEARS_TO_SHOW; i++) {
      navigation.nextYear();
    }
  }

  function prevYearRange() {
    for (let i = 0; i < CALENDAR_CONFIG.YEARS_TO_SHOW; i++) {
      navigation.prevYear();
    }
  }

  function confirmSelection() {
    const dateValue = selection.getValue();
    if (!dateValue) return null;

    if (time && props.enableTime) {
      const timeValue = time.getValue() || { hour: 0, minute: 0 };

      if (props.mode === 'range') {
        return {
          start: { ...dateValue.start, ...timeValue },
          end: { ...dateValue.end, ...timeValue },
        };
      }

      if (props.mode === 'multiple') {
        return dateValue.map((d) => ({ ...d, ...timeValue }));
      }

      return { ...dateValue, ...timeValue };
    }

    return dateValue;
  }

  defineExpose({
    confirmSelection,
  });
</script>

<style scoped lang="scss">
  .datepicker-content {
    @include customFlex(column, space-between, normal, 20px);
    margin-bottom: 20px;

    &__controls {
      @include customFlex(row, space-between, center, 8px);
      &-btn {
        height: 24px;
        padding: 0;
        border: none;
      }
    }

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
      &-year {
        font-weight: 400;
        font-size: 12px;
      }
    }

    &__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 16px;
      font-size: 12px;
      font-weight: 400;
      font-family: 'IRANYekan';
      background-color: $gray-50;
      height: 16px;
      width: 100%;
      border-radius: 4px;
      padding-left: 2px;
    }

    &__weekday {
      text-align: center;
      font-size: 12px;
      font-weight: 400;
    }

    &__days {
      display: grid;
      grid-template-columns: repeat(7, 32px);
      align-items: center;
      row-gap: 16px;
      column-gap: 0;
      font-weight: 400;
      font-size: 14px;
      justify-content: space-between;
    }

    &__day {
      border-radius: 10px;
      font-size: 14px;
      font-weight: 400;
      font-family: 'IRANYekan';
      width: 32px;
      height: 32px;
      cursor: pointer;
      @include customFlex(column, start, center);
      position: relative;
      &--selected {
        background-color: $primary-500;
        color: $white-100;
      }

      &--range-start,
      &--range-end {
        color: $white-100;
        z-index: 1;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          width: 32px;
          height: 32px;
          background-color: $primary-500;
          border-radius: 10px;
          z-index: -1;
        }
      }

      &--range-start {
        background: linear-gradient(to right, rgba($primary-300, 0.15) 50%, transparent 50%);
        border-radius: 0;
      }

      &--range-end {
        background: linear-gradient(to left, rgba($primary-300, 0.15) 50%, transparent 15%);
        border-radius: 0;
      }

      &--prev-month,
      &--next-month {
        color: $gray-300;
      }

      &--in-range {
        background-color: rgba($primary-300, 0.15);
        border-radius: 0;
      }

      &-today-text {
        color: $primary-400;
        font-weight: 400;
        font-size: 10px;
      }
    }
  }
</style>
