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
              { 'time-picker__item--selected': selectedMinute === minute },
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

  function onSelectHour(hour) {
    emit('select-hour', hour);
  }

  function onSelectMinute(minute) {
    emit('select-minute', minute);
  }

  function onTogglePeriod(period) {
    if (period !== props.selectedPeriod) {
      emit('toggle-period');
    }
  }

  function isHourSelected(hour) {
    if (props.timeFormat === '12') {
      return props.displayHour === hour;
    }
    return props.selectedHour === hour;
  }

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
    @include flex(column, start, stretch, 12px);
    border-radius: $radius-8;
    padding: 16px;

    &__header {
      @include flex(row, center, center);
      padding-bottom: 8px;
    }

    &__title {
      font-size: 14px;
      font-weight: 500;
    }

    &__content {
      @include flex(row, space-around, stretch, 8px);
    }

    &__column {
      @include flex(column, start, center, 8px);
      flex: 1;

      &--period {
        flex: 0.6;
      }
    }

    &__label {
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 4px;
    }

    &__scroll-container {
      @include flex(column, start, stretch, 4px);
      max-height: 150px;
      overflow-y: auto;
      width: 100%;
      padding: 4px;
      background-color: $white-100;
      border-radius: $radius-4;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 2px;

        &:hover {
          background: $gray-100;
        }
      }
    }

    &__item {
      padding: 8px 12px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      border-radius: $radius-4;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;

      &:hover {
        background-color: $gray-100;
      }

      &--selected {
        background-color: $primary-500;
        color: $white-100;
        font-weight: 500;

        &:hover {
          background-color: $primary-600;
        }
      }
    }

    &__display {
      @include flex(row, center, center);
      padding: 12px;
      background-color: $white-100;
      border-radius: $radius-4;
    }

    &__display-text {
      font-size: 14px;

      strong {
        color: $primary-600;
        font-weight: 600;
        margin-right: 4px;
      }
    }
  }
</style>
