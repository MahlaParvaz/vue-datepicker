<template>
  <div class="datepicker-content" :style="{ fontFamily: fontFamily }">
    <template v-if="props.currentView === 'days'">
      <div class="datepicker-content__weekdays">
        <span v-for="weekday in WEEKDAYS" :key="weekday" class="datepicker-content__weekday">
          {{ weekday }}
        </span>
      </div>
      <div class="datepicker-content__days">
        <div
          v-for="(week, weekIndex) in calendarWeeks"
          :key="`week-${weekIndex}`"
          class="datepicker-content__week"
          :style="getWeekStyle(week)"
        >
          <BaseButton
            v-for="day in week"
            :key="day.id"
            variant="outline"
            :class="getDayClasses(day)"
            :disabled="day.isDisabled"
            @click="selectDay(day)"
          >
            {{ formatNumber(day.day) }}
            <span v-if="day.isToday && !day.isSelected" class="datepicker-content__day-today-text">
              {{ i18nStore.getText('todayText') }}
            </span>
          </BaseButton>
        </div>
      </div>
    </template>

    <TimePicker
      v-if="props.enableTime && props.currentView === 'days'"
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
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import BaseButton from '../base/BaseButton.vue';
  import TimePicker from './TimePicker.vue';
  import { useNavigation } from '@/composables/datepicker/useNavigation.js';
  import { createSelection } from '@/composables/datepicker/useSelection.js';
  import { useTimeSelection } from '@/composables/datepicker/useTimeSelection.js';
  import { useDateConstraints } from '@/composables/datepicker/useDateConstraints.js';
  import { useCalendarGrid } from '@/composables/datepicker/useCalendarGrid.js';
  import { toLocalizedNumbers } from '@/locales/numberFormatter.js';

  import { useI18nStore } from '@/store/i18n';

  const props = defineProps({
    locale: { type: String, default: null },
    mode: { type: String, default: 'single' },
    initialValue: { type: [Object, String], default: null },
    minDate: { type: [Object, String], default: null },
    maxDate: { type: [Object, String], default: null },
    enableTime: { type: Boolean, default: false },
    timeFormat: { type: [String, Number], default: 24 },
    enableLocaleSelector: { type: Boolean, default: true },
    currentView: { type: String, default: 'days' },
    navigation: { type: Object, default: null },
  });

  const emit = defineEmits([
    'update:selectedDate',
    'update:currentView',
    'update:rangeSelection',
    'update:multipleSelection',
    'update:locale',
  ]);

  const i18nStore = useI18nStore();
  const selectedLocale = ref(props.locale || i18nStore.currentLocale);

  watch(selectedLocale, (newLocale) => {
    i18nStore.setLocale(newLocale);
    emit('update:locale', newLocale);
  });

  watch(
    () => props.locale,
    (newLocale) => {
      if (newLocale && newLocale !== selectedLocale.value) {
        selectedLocale.value = newLocale;
        i18nStore.setLocale(newLocale);
      }
    },
  );

  const navigation = props.navigation || useNavigation(props.initialValue);
  const selection = createSelection(props.mode, props.initialValue);
  const constraints = useDateConstraints({ minDate: props.minDate, maxDate: props.maxDate });
  const time = props.enableTime
    ? useTimeSelection({ timeFormat: props.timeFormat, initialValue: props.initialValue })
    : null;

  const { weeks: calendarWeeks } = useCalendarGrid({
    year: navigation.currentYear,
    month: navigation.currentMonth,
    selection,
    constraints,
    locale: selectedLocale,
  });

  const WEEKDAYS = computed(() => i18nStore.locale?.weekdays || []);

  const fontFamily = computed(() => {
    const fontMap = {
      jalali: 'IRANYekan',
      hijri: ' Arial, sans-serif',
      gregorian: 'Arial, sans-serif',
      chinese: 'Microsoft YaHei, SimHei, sans-serif',
    };
    return fontMap[i18nStore.calendarType] || 'Arial, sans-serif';
  });

  function getDayClasses(day) {
    return [
      'datepicker-content__day',
      { 'datepicker-content__day--selected': day.isSelected },
      { 'datepicker-content__day--prev-month': day.isPrevMonth },
      { 'datepicker-content__day--next-month': day.isNextMonth },
      { 'datepicker-content__day--in-range': day.isInRange },
      { 'datepicker-content__day--range-start': day.isRangeStart },
      { 'datepicker-content__day--range-end': day.isRangeEnd },
    ];
  }

  const formatNumber = (value) => toLocalizedNumbers(value, i18nStore.numberSystem);
  const toPersianNumbers = (value) => toLocalizedNumbers(value, i18nStore.numberSystem);

  function selectDay(dayObj) {
    if (dayObj.isDisabled) return;

    selection.select(dayObj.date);

    switch (props.mode) {
      case 'range':
        emit('update:rangeSelection', selection.getValue());
        break;
      case 'multiple':
        emit('update:multipleSelection', selection.getValue());
        break;

      default:
        emit('update:selectedDate', selection.getValue());
    }
  }
  const selectHour = (hour) => time?.selectHour(hour);
  const selectMinute = (minute) => time?.selectMinute(minute);
  const togglePeriod = () => time?.togglePeriod();

  function getWeekStyle(week) {
    const hasRange = week.some((day) => day.isInRange || day.isRangeStart || day.isRangeEnd);
    if (!hasRange) return {};

    const hasRangeStart = week.some((day) => day.isRangeStart);
    const hasRangeEnd = week.some((day) => day.isRangeEnd);

    let firstRangeIndex = -1;
    let lastRangeIndex = -1;

    week.forEach((day, index) => {
      if (day.isInRange || day.isRangeStart || day.isRangeEnd) {
        if (firstRangeIndex === -1) firstRangeIndex = index;
        lastRangeIndex = index;
      }
    });

    if (firstRangeIndex === -1 || lastRangeIndex === -1) return {};

    let startPercent, endPercent;

    if (hasRangeStart) {
      const rangeStartIndex = week.findIndex((day) => day.isRangeStart);
      startPercent = (rangeStartIndex / 7) * 100 + 100 / 14;
    } else {
      startPercent = (firstRangeIndex / 7) * 100;
    }

    if (hasRangeEnd) {
      const rangeEndIndex = week.findIndex((day) => day.isRangeEnd);
      endPercent = (rangeEndIndex / 7) * 100 + 100 / 14;
    } else {
      endPercent = ((lastRangeIndex + 0.8) / 7) * 100;
    }

    return {
      '--gradient-start': `${100 - endPercent}%`,
      '--gradient-end': `${100 - startPercent}%`,
    };
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
    @include flex(column, space-between, normal, 20px);
    margin-bottom: 20px;
    &__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 16px;
      font-size: 12px;
      font-weight: 400;
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
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }
    &__week {
      display: grid;
      grid-template-columns: repeat(7, 32px);
      align-items: center;
      row-gap: 16px;
      column-gap: 0;
      font-weight: 400;
      font-size: 14px;
      justify-content: space-between;
      display: grid;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: var(--gradient-start, 0%);
        width: calc(var(--gradient-end, 0%) - var(--gradient-start, 0%));
        height: 100%;
        background: linear-gradient(270deg, #cee0fc 0%, rgba(206, 224, 252, 0.15) 100%);
        z-index: 0;
        pointer-events: none;
      }
    }

    &__day {
      border-radius: 10px;
      font-size: 14px;
      font-weight: 400;
      width: 32px;
      height: 32px;
      cursor: pointer;
      @include flex(column, start, center);
      position: relative;
      font-family: inherit;

      &--selected {
        background-color: $primary-500;
        color: $white-100;
        border-radius: 10px;
      }

      &--range-start,
      &--range-end {
        color: $white-100;
        z-index: 1;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          background-color: $primary-500;
          border-radius: 10px;
          z-index: -1;
        }
      }

      &--range-start,
      &--range-end,
      &--in-range {
        background: transparent;
        border-radius: 0;
      }

      &--prev-month,
      &--next-month {
        color: $gray-300;
      }

      &-today-text {
        color: $primary-400;
        font-weight: 400;
        font-size: 10px;
      }
    }
  }
</style>
