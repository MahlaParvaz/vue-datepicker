<template>
  <div class="time-picker">
    <div class="time-picker__header">
      <span class="time-picker__title">{{ i18nStore.getText('selectTimeText') }}</span>
    </div>

    <div class="time-picker__content">
      <div class="time-picker__column">
        <div class="time-picker__label">{{ i18nStore.getText('minuteText') }}</div>
        <div class="time-picker__scroll-container">
          <div
            v-for="minute in minutes"
            :key="minute"
            :class="[
              'time-picker__item',
              { 'time-picker__item--selected': onSelectMinute === minute },
            ]"
            @click="onSelectMinute(minute)"
          >
            {{ toPersianNumbers(String(minute).padStart(2, '0')) }}
          </div>
        </div>
      </div>

      <div class="time-picker__column">
        <div class="time-picker__label">{{ i18nStore.getText('hourText') }}</div>
        <div class="time-picker__scroll-container">
          <div
            v-for="hour in hours"
            :key="hour"
            :class="['time-picker__item', { 'time-picker__item--selected': isHourSelected(hour) }]"
            @click="onSelectHour(hour)"
          >
            {{ toPersianNumbers(hour) }}
          </div>
        </div>
      </div>

      <div v-if="timeFormat === '12'" class="time-picker__column time-picker__column--period">
        <div class="time-picker__label">{{ i18nStore.getText('periodText') }}</div>
        <div class="time-picker__scroll-container">
          <div
            :class="[
              'time-picker__item',
              { 'time-picker__item--selected': selectedPeriod === 'AM' },
            ]"
            @click="onTogglePeriod('AM')"
          >
            AM
          </div>
          <div
            :class="[
              'time-picker__item',
              { 'time-picker__item--selected': selectedPeriod === 'PM' },
            ]"
            @click="onTogglePeriod('PM')"
          >
            PM
          </div>
        </div>
      </div>
    </div>

    <div class="time-picker__display">
      <span class="time-picker__display-text">
        {{ i18nStore.getText('selectedTimeText') }}:
        <strong>
          {{ displayTime }}
        </strong>
      </span>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useI18nStore } from '@/store/i18n';

  const i18nStore = useI18nStore();

  const props = defineProps({
    selectedHour: {
      type: Number,
      default: null,
    },
    selectedMinute: {
      type: Number,
      default: null,
    },
    selectedPeriod: {
      type: String,
      default: 'AM',
    },
    hours: {
      type: Array,
      required: true,
    },
    minutes: {
      type: Array,
      required: true,
    },
    timeFormat: {
      type: [String, Number],
      default: 24,
    },
    displayHour: {
      type: Number,
      default: null,
    },
    toPersianNumbers: {
      type: Function,
      required: true,
    },
  });

  const emit = defineEmits(['select-hour', 'select-minute', 'toggle-period']);

  const onSelectHour = (hour) => emit('select-hour', hour);
  const onSelectMinute = (minute) => emit('select-minute', minute);

  const onTogglePeriod = (period) => period !== props.selectedPeriod && emit('toggle-period');

  const isHourSelected = (hour) =>
    props.timeFormat === '12' ? props.displayHour === hour : props.selectedHour === hour;

  const displayTime = computed(() => {
    if (props.selectedHour === null || props.selectedMinute === null) {
      return '-- : --';
    }

    let hour = props.selectedHour;
    let suffix = '';

    if (props.timeFormat === '12') {
      hour = props.displayHour ?? 12;
      suffix = ` ${props.selectedPeriod}`;
    }

    const hourStr = props.toPersianNumbers(String(hour).padStart(2, '0'));
    const minuteStr = props.toPersianNumbers(String(props.selectedMinute).padStart(2, '0'));

    return `${hourStr}:${minuteStr}${suffix}`;
  });
</script>

<style scoped lang="scss">
  .time-picker {
    @include flex(column, start, stretch, var(--datepicker-spacing-12));
    border-radius: var(--datepicker-radius-8);
    padding: var(--datepicker-spacing-16);

    &__header {
      @include flex(row, center, center);
      padding-bottom: var(--datepicker-spacing-8);
    }

    &__title {
      font-size: var(--datepicker-font-size-14);
      font-weight: var(--datepicker-font-weight-medium);
    }

    &__content {
      @include flex(row, space-around, stretch, var(--datepicker-spacing-8));
    }

    &__column {
      @include flex(column, start, center, var(--datepicker-spacing-8));
      flex: 1;

      &--period {
        flex: 0.6;
      }
    }

    &__label {
      font-size: var(--datepicker-font-size-12);
      font-weight: var(--datepicker-font-weight-medium);
      text-align: center;
      margin-bottom: var(--datepicker-spacing-4);
    }

    &__scroll-container {
      @include flex(column, start, stretch, var(--datepicker-spacing-4));
      max-height: 150px;
      overflow-y: auto;
      width: 100%;
      padding: var(--datepicker-spacing-4);
      background-color: var(--datepicker-white);
      border-radius: var(--datepicker-radius-4);

      &::-webkit-scrollbar {
        width: var(--datepicker-spacing-4);
      }

      &::-webkit-scrollbar-track {
        border-radius: var(--datepicker-radius-4);
      }

      &::-webkit-scrollbar-thumb {
        border-radius: var(--datepicker-radius-4);

        &:hover {
          background: var(--datepicker-gray-100);
        }
      }
    }

    &__item {
      padding: var(--datepicker-spacing-8) var(--datepicker-spacing-12);
      text-align: center;
      font-size: var(--datepicker-font-size-14);
      font-weight: var(--datepicker-font-weight-normal);
      border-radius: var(--datepicker-radius-4);
      cursor: pointer;
      transition: all var(--datepicker-transition-duration) var(--datepicker-transition-timing);
      user-select: none;

      &:hover {
        background-color: var(--datepicker-gray-100);
      }

      &--selected {
        background-color: var(--datepicker-primary-500);
        color: var(--datepicker-white);
        font-weight: var(--datepicker-font-weight-medium);

        &:hover {
          background-color: var(--datepicker-primary-600);
        }
      }
    }

    &__display {
      @include flex(row, center, center);
      padding: var(--datepicker-spacing-12);
      background-color: var(--datepicker-white);
      border-radius: var(--datepicker-radius-4);
    }

    &__display-text {
      font-size: var(--datepicker-font-size-14);

      strong {
        color: var(--datepicker-primary-600);
        font-weight: var(--datepicker-font-weight-semibold);
        margin-right: var(--datepicker-spacing-4);
      }
    }
  }
</style>
