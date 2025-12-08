<script setup>
  import DatepickerInput from './components/datepicker/DatepickerInput.vue';
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <DatepickerInput
        mode="range"
        :enable-time="true"
        :time-format="24"
        :enable-locale-selector="true"
        placeholder="انتخاب تاریخ و زمان"
        :years-before="25"
        :years-after="25"
      />
    </div>
  </div>
</template>

<style lang="scss"></style>
