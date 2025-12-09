import { onMounted, onUnmounted, watch } from 'vue';

/**
 * Composable for managing dynamic theme customization via CSS variables.
Instance-specific theme prop (applied to individual datepicker instances)
 *
 * @param {import('vue').Ref<Object|null>} theme - Reactive theme configuration object
 * @param {import('vue').Ref<HTMLElement|null>} containerRef - Ref to the container element where styles will be applied
 *
 * @returns {Object} Theme utilities
 * @returns {Function} return.applyTheme - Function to manually apply theme
 * @returns {Function} return.removeTheme - Function to remove applied theme
 *
 * @example
 * // Approach 1: Global CSS variable override (in user's app.css)
 
 */
export const useTheme = (theme, containerRef) => {
  const THEME_VARIABLE_MAP = {
    // Colors - Primary
    'colors.primary': '--datepicker-primary-500',
    'colors.primaryLight': '--datepicker-primary-400',
    'colors.primaryLighter': '--datepicker-primary-300',
    'colors.primaryLightest': '--datepicker-primary-200',
    'colors.primaryDark': '--datepicker-primary-600',

    // Colors - Gray/Neutral
    'colors.gray': '--datepicker-gray-300',
    'colors.grayLight': '--datepicker-gray-200',
    'colors.grayLighter': '--datepicker-gray-100',
    'colors.grayLightest': '--datepicker-gray-50',

    // Colors - Text
    'colors.textPrimary': '--datepicker-text-primary',
    'colors.white': '--datepicker-white',

    // Border Radius
    'radius.small': '--datepicker-radius-4',
    'radius.medium': '--datepicker-radius-8',
    'radius.large': '--datepicker-radius-10',
    'radius.xlarge': '--datepicker-radius-12',

    // Spacing
    'spacing.xs': '--datepicker-spacing-4',
    'spacing.sm': '--datepicker-spacing-8',
    'spacing.md': '--datepicker-spacing-12',
    'spacing.lg': '--datepicker-spacing-16',
    'spacing.xl': '--datepicker-spacing-20',
    'spacing.xxl': '--datepicker-spacing-24',

    // Font Sizes
    'fontSize.xs': '--datepicker-font-size-10',
    'fontSize.sm': '--datepicker-font-size-12',
    'fontSize.md': '--datepicker-font-size-14',
    'fontSize.lg': '--datepicker-font-size-16',

    // Font Weights
    'fontWeight.normal': '--datepicker-font-weight-normal',
    'fontWeight.medium': '--datepicker-font-weight-medium',
    'fontWeight.semibold': '--datepicker-font-weight-semibold',

    // Dimensions
    'dimensions.width': '--datepicker-width',
    'dimensions.daySize': '--datepicker-day-size',
    'dimensions.buttonHeight': '--datepicker-button-height',
    'dimensions.weekdayHeight': '--datepicker-weekday-height',

    // Grid
    'grid.columns': '--datepicker-grid-columns',
    'grid.gap': '--datepicker-grid-gap',
    'grid.columnGap': '--datepicker-grid-column-gap',

    // Transitions
    'transitions.duration': '--datepicker-transition-duration',
    'transitions.timing': '--datepicker-transition-timing',

    // Range Selection
    'range.gradientStart': '--datepicker-range-gradient-start',
    'range.gradientEnd': '--datepicker-range-gradient-end',

    // Scrollbar
    'scrollbar.width': '--datepicker-scrollbar-width',
    'scrollbar.thumbHeight': '--datepicker-scrollbar-thumb-height',
    'scrollbar.trackColor': '--datepicker-scrollbar-track-color',
    'scrollbar.thumbColor': '--datepicker-scrollbar-thumb-color',
  };

  /**
   * Gets nested property value from object using dot notation
   * @param {Object} obj - Object to traverse
   * @param {string} path - Dot-notated path (e.g., 'colors.primary')
   * @returns {*} Value at path or undefined
   */
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const applyTheme = () => {
    if (!theme?.value || !containerRef?.value) return;

    const container = containerRef.value;
    const themeConfig = theme.value;

    Object.entries(THEME_VARIABLE_MAP).forEach(([themePath, cssVariable]) => {
      const value = getNestedValue(themeConfig, themePath);

      if (value !== undefined && value !== null) {
        container.style.setProperty(cssVariable, String(value));
      }
    });
  };

  const removeTheme = () => {
    if (!containerRef?.value) return;

    const container = containerRef.value;

    Object.values(THEME_VARIABLE_MAP).forEach((cssVariable) => {
      container.style.removeProperty(cssVariable);
    });
  };

  onMounted(() => {
    applyTheme();
  });

  watch(
    theme,
    () => {
      applyTheme();
    },
    { deep: true },
  );

  onUnmounted(() => {
    removeTheme();
  });

  return {
    applyTheme,
    removeTheme,
  };
};
