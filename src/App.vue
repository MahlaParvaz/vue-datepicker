<script setup>
  import { ref } from 'vue';
  import DatepickerHeadless from './components/datepicker/DatepickerHeadless.vue';
  import { createDatepickerFontConfig } from './plugins/font';

  const simpleDate = ref(null);
  const customFontDate = ref(null);

  const handleConfirm = (type, value) => {
    console.log(`${type}:`, value);
  };

  // const customFonts = {
  //   jalali: 'Vazir, sans-serif',
  //   gregorian: 'Roboto, Arial, sans-serif',
  //   hijri: 'Amiri, serif',
  //   chinese: 'Noto Sans SC, Microsoft YaHei, sans-serif',
  // };
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
      <h3>Default Font</h3>
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

    <div class="demo-section">
      <h3>Custom Font</h3>
      <DatepickerHeadless
        v-model="customFontDate"
        :enable-time="true"
        :time-format="24"
        :font-config="customFonts"
        @confirm="handleConfirm('Custom Font', $event)"
      >
        <template #default="{ open, formattedDate, fontFamily }">
          <input
            type="text"
            class="simple-input"
            :value="formattedDate"
            :style="{ fontFamily }"
            placeholder="Select date and time (Custom Font)"
            readonly
            @click="open"
          />
        </template>
      </DatepickerHeadless>
      <pre>{{ customFontDate }}</pre>
    </div>
  </div>
</template>

<style lang="scss"></style>
