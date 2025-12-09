<script setup>
  import { ref } from 'vue';
  import DatepickerHeadless from './components/datepicker/DatepickerHeadless.vue';

  const simpleDate = ref(null);

  const handleConfirm = (type, value) => {
    console.log(`${type}:`, value);
  };
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <DatepickerHeadless
        v-model="simpleDate"
        :enable-time="true"
        :time-format="24"
        @confirm="handleConfirm('Simple', $event)"
      >
        <template #default="{ open, formattedDate }">
          <input
            type="text"
            class="simple-input"
            :value="formattedDate"
            placeholder="Select date and time"
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
