import { computed } from 'vue';
import { useI18nStore } from '@/store/i18n';
import { fontConfig } from '@/plugins/font';

const DEFAULT_FONT_MAP = {
  jalali: 'IRANYekan',
  hijri: 'IRANYekan',
  gregorian: 'Arial, sans-serif',
  chinese: 'Microsoft YaHei, SimHei, sans-serif',
};

export function useFont() {
  const i18nStore = useI18nStore();

  const fontFamily = computed(() => {
    const key = i18nStore.calendarType;

    return fontConfig[key] || DEFAULT_FONT_MAP[key] || 'Arial, sans-serif';
  });

  return { fontFamily };
}
