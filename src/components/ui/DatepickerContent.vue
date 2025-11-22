<template>
  <section class="datepicker-content">
    <div class="datepicker-content__controls">
      <BaseButton
        variant="secondary"
        type="button"
        size="small"
        class="datepicker-content__controls-btn"
        @click="toggleMonths"
      >
        <template #icon-right>
          <ArrowDownIcon :width="24" :height="24" />
        </template>
        {{ selectedMonths || 'فروردین' }}
      </BaseButton>

      <BaseButton
        variant="secondary"
        type="button"
        size="small"
        class="datepicker-content__controls-btn"
      >
        <template #icon-right>
          <ArrowDownIcon :width="24" :height="24" />
        </template>
        {{ toPersianNumbers(1404) }}
      </BaseButton>
    </div>

    <div class="datepicker-content__months" v-if="showMonths">
      <BaseButton
        v-for="month in months"
        :key="month"
        variant="secondary"
        size="small"
        @click="selectMonth(month)"
        :class="{ 'datepicker-content__months-btn--active': selectedMonths === month }"
      >
        {{ month }}
      </BaseButton>
    </div>

    <div class="datepicker-content__weekdays" v-if="!showMonths">
      <span v-for="weekday in weekdays" :key="weekday" class="datepicker-content__weekday">
        {{ weekday }}
      </span>
    </div>

    <div class="datepicker-content__days" v-if="!showMonths">
      <BaseButton
        variant="outline"
        v-for="day in calendarDays"
        :key="day.id"
        :class="[
          'datepicker-content__day',
          { 'datepicker-content__day--selected': day.isSelected },
        ]"
        :disabled="day.isDisabled"
        @click="selectDay(day)"
      >
        {{ day.label }}
        <span v-if="day.isToday" class="datepicker-content__day-today-text">امروز</span>
      </BaseButton>
    </div>
  </section>
</template>

<script setup>
  import { ref } from 'vue';
  import { toPersianNumbers } from '@/utils/toPersianNumbers';
  import BaseButton from '../common/BaseButton.vue';
  import ArrowDownIcon from '../icons/ArrowDownIcon.vue';

  const selectedMonths = ref(null);
  const showMonths = ref(false);

  const weekdays = ['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'];
  const months = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  const calendarDays = ref(
    Array.from({ length: 31 }, (_, i) => ({
      id: i + 1,
      label: toPersianNumbers(i + 1),
      isSelected: false,
      isToday: i + 1 === 15,
      isDisabled: false,
      isOtherMonth: false,
    })),
  );

  function toggleMonths() {
    showMonths.value = !showMonths.value;
  }

  function selectMonth(month) {
    selectedMonths.value = month;
    showMonths.value = false;
  }

  function selectDay(day) {
    calendarDays.value.forEach((d) => (d.isSelected = false));
    day.isSelected = true;
  }
</script>

<style scoped lang="scss">
  .datepicker-content {
    @include customFlex(column, space-between, normal, 20px);
    margin-bottom: 20px;

    &__controls {
      @include customFlex(row, space-between, center);
      gap: 8px;
      &-btn {
        height: 24px;
        padding: 0;
        border: none;
      }
    }

    &__months {
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
      grid-template-columns: repeat(7, 1fr);
      gap: 16px;
      font-weight: 400;
      font-size: 14px;
    }

    &__day {
      border-radius: 10px;
      font-size: 14px;
      font-weight: 400;
      font-family: 'IRANYekan';
      font-variant-numeric: normal;
      width: 32px;
      height: 32px;
      cursor: pointer;
      @include customFlex(column, start, center);

      &--selected {
        background-color: $primary-500;
        color: $white-100;
        width: 32px;
        height: 32px;
      }

      &-today-text {
        color: $primary-400;
        font-weight: 400;
        font-size: 10px;
      }
    }
  }
</style>
