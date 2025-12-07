<script setup>
  import { ref, watch } from 'vue';
  import DatepickerInput from './components/datepicker/DatepickerInput.vue';
  import { useI18nStore } from './store/i18n';

  const i18nStore = useI18nStore();
  const selectedDateTime = ref(null);
  const selectedLocale = ref(i18nStore.currentLocale);

  watch(selectedLocale, (newLocale) => {
    i18nStore.setLocale(newLocale);
  });

  watch(
    () => i18nStore.currentLocale,
    (newLocale) => {
      selectedLocale.value = newLocale;
    },
  );
</script>

<template>
  <div class="container">
    <div class="demo-section">
      <DatepickerInput
        v-model="selectedDateTime"
        v-model:locale="selectedLocale"
        mode="range"
        :enable-time="true"
        :time-format="24"
        :enable-locale-selector="true"
        placeholder="انتخاب تاریخ و زمان"
        :min-year="1347"
        :max-year="1500"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
