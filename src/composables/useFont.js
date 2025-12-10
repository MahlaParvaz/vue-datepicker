import { computed } from 'vue';
import { useI18nStore } from '@/store/i18n';
import { fontConfig as globalFontConfig } from '@/plugins/font';

const DEFAULT_FONT_MAP = {
  jalali: 'Vazirmatn, Tahoma, sans-serif',
  hijri: 'Vazirmatn, Tahoma, sans-serif',
  gregorian: 'Arial, sans-serif',
  chinese: 'Microsoft YaHei, SimHei, sans-serif',
};

/**
 * Composable for managing font families based on calendar type
 * @param {Object} [customFontConfig] - Optional custom font configuration to override defaults
 * @returns {Object} Object containing computed fontFamily
 */
export function useFont(customFontConfig = null) {
  const i18nStore = useI18nStore();

  const fontFamily = computed(() => {
    const key = i18nStore.calendarType;
    const fonts = { ...DEFAULT_FONT_MAP, ...globalFontConfig, ...customFontConfig };

    return fonts[key] || 'Arial, sans-serif';
  });

  return { fontFamily };
}
