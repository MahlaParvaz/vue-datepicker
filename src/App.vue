<script setup>
  import { ref } from 'vue';
  import DatepickerInput from './components/datepicker/DatepickerInput.vue';

  const selectedDateTime = ref(null);
  const selectedLocale = ref('jalali');
</script>

<template>
  <div class="container">

    <div class="demo-section">
      <DatepickerInput
        v-model="selectedDateTime"
        v-model:locale="selectedLocale"
        mode="multiple"
        :enable-time="true"
        :time-format="24"
        :enable-locale-selector="true"
        placeholder="انتخاب تاریخ و زمان"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
