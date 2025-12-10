import { reactive } from 'vue';

export const fontConfig = reactive({
  jalali: null,
  hijri: null,
  gregorian: null,
  chinese: null,
});

export function createDatepickerFontConfig(config) {
  Object.assign(fontConfig, config);
}
