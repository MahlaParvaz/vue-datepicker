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
    @include flex(column, start, stretch, space(12));
    border-radius: radius(8);
    padding: space(16);

    &__header {
      @include flex(row, center, center);
      padding-bottom: space(8);
    }

    &__title {
      font-size: font-size(14);
      font-weight: font-weight(medium);
    }

    &__content {
      @include flex(row, space-around, stretch, space(8));
    }

    &__column {
      @include flex(column, start, center, space(8));
      flex: 1;

      &--period {
        flex: 0.6;
      }
    }

    &__label {
      font-size: font-size(12);
      font-weight: font-weight(medium);
      text-align: center;
      margin-bottom: space(4);
    }

    &__scroll-container {
      @include flex(column, start, stretch, space(4));
      max-height: 150px;
      overflow-y: auto;
      width: 100%;
      padding: space(4);
      background-color: get-color(text, white);
      border-radius: radius(4);

      &::-webkit-scrollbar {
        width: space(4);
      }

      &::-webkit-scrollbar-track {
        border-radius: radius(4);
      }

      &::-webkit-scrollbar-thumb {
        border-radius: radius(4);

        &:hover {
          background: get-color(gray, 100);
        }
      }
    }

    &__item {
      padding: space(8) space(12);
      text-align: center;
      font-size: font-size(14);
      font-weight: font-weight(normal);
      border-radius: radius(4);
      cursor: pointer;
      transition: transition();
      user-select: none;

      &:hover {
        background-color: get-color(gray, 100);
      }

      &--selected {
        background-color: get-color(primary, 500);
        color: get-color(text, white);
        font-weight: font-weight(medium);

        &:hover {
          background-color: get-color(primary, 600);
        }
      }
    }

    &__display {
      @include flex(row, center, center);
      padding: space(12);
      background-color: get-color(text, white);
      border-radius: radius(4);
    }

    &__display-text {
      font-size: font-size(14);

      strong {
        color: get-color(primary, 600);
        font-weight: font-weight(semibold);
        margin-right: space(4);
      }
    }
  }
</style>
