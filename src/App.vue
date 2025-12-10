<script setup>
  import { ref } from 'vue';
  import DatepickerHeadless from './components/datepicker/DatepickerHeadless.vue';
  import { createDatepickerFontConfig } from './plugins/font';

  const simpleDate = ref(null);

  const handleConfirm = (type, value) => {
    console.log(`${type}:`, value);
  };

  createDatepickerFontConfig({
    jalali: 'IRANYekan',
    hijri: 'Cairo',
    gregorian: 'Inter',
    chinese: 'Noto Sans SC',
  });
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <DatepickerHeadless
        v-model="simpleDate"
        :enable-time="true"
        :time-format="24"
        @confirm="handleConfirm('Default', $event)"
      >
        <template #default="{ open, formattedDate, fontFamily }">
          <input
            type="text"
            class="simple-input"
            :value="formattedDate"
            :style="{ fontFamily }"
            placeholder="Select date and time (Default Font)"
            readonly
            @click="open"
          />
        </template>
      </DatepickerHeadless>
      <pre>{{ simpleDate }}</pre>
    </div>
  </div>
</template>

<style lang="scss"></style>
