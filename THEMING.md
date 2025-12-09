# Theming Guide

The Vue Multi-Calendar Datepicker provides two powerful ways to customize its appearance:

1. **Global CSS Variable Overrides** - Set default styles for all datepicker instances in your app
2. **Instance-Specific Theme Prop** - Apply custom themes to individual datepicker instances

---

## Table of Contents

- [Quick Start](#quick-start)
- [Approach 1: Global CSS Variables](#approach-1-global-css-variables)
- [Approach 2: Theme Prop](#approach-2-theme-prop)
- [Available Theme Options](#available-theme-options)
- [Complete Examples](#complete-examples)
- [Dark Mode Example](#dark-mode-example)
- [Multiple Themes](#multiple-themes)

---

## Quick Start

### Global Style Override (Recommended for App-Wide Styling)

```css
/* In your global CSS file (e.g., app.css, main.css) */
:root {
  --datepicker-primary-500: #e91e63;
  --datepicker-width: 400px;
  --datepicker-day-size: 40px;
}
```

### Instance-Specific Theme

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const customTheme = {
  colors: {
    primary: '#e91e63',
    primaryLight: '#f06292'
  },
  dimensions: {
    width: '400px',
    daySize: '40px'
  }
};
</script>

<template>
  <DatepickerHeadless :theme="customTheme">
    <template #default="{ open, formattedDate }">
      <button @click="open">{{ formattedDate || 'Select Date' }}</button>
    </template>
  </DatepickerHeadless>
</template>
```

---

## Approach 1: Global CSS Variables

Override CSS variables in your global styles to set defaults for **all** datepicker instances.

### Basic Example

```css
/* styles/datepicker-theme.css */
:root {
  /* Primary Colors */
  --datepicker-primary-600: #c2185b;
  --datepicker-primary-500: #e91e63;
  --datepicker-primary-400: #f06292;
  --datepicker-primary-300: #f48fb1;
  --datepicker-primary-200: #f8bbd0;

  /* Gray Colors */
  --datepicker-gray-300: #616161;
  --datepicker-gray-200: #e0e0e0;
  --datepicker-gray-100: #f5f5f5;
  --datepicker-gray-50: #fafafa;

  /* Dimensions */
  --datepicker-width: 400px;
  --datepicker-day-size: 40px;

  /* Border Radius */
  --datepicker-radius-8: 12px;
  --datepicker-radius-10: 16px;
}
```

### Import in Your App

```js
// main.js or main.ts
import { createApp } from 'vue';
import App from './App.vue';
import './styles/datepicker-theme.css'; // Import your custom theme

createApp(App).mount('#app');
```

### Advantages

✅ Set once, apply everywhere
✅ No need to pass props to each datepicker
✅ Easy to maintain consistent design
✅ Works with all component variants (DatepickerHeadless, DatepickerInput)

---

## Approach 2: Theme Prop

Pass a `theme` object to specific datepicker instances for custom styling.

### Basic Example

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const pinkTheme = ref({
  colors: {
    primary: '#e91e63',
    primaryDark: '#c2185b',
    primaryLight: '#f06292',
    primaryLighter: '#f48fb1',
    primaryLightest: '#f8bbd0'
  }
});
</script>

<template>
  <DatepickerHeadless :theme="pinkTheme">
    <template #default="{ open, formattedDate }">
      <button @click="open">{{ formattedDate }}</button>
    </template>
  </DatepickerHeadless>
</template>
```

### Advantages

✅ Per-instance customization
✅ Dynamic theme switching
✅ Multiple themes in the same app
✅ Runtime theme updates

---

## Available Theme Options

### Complete Theme Object Structure

```js
const theme = {
  colors: {
    primary: '#2f7bf5',           // Main primary color
    primaryDark: '#2471eb',       // Darker shade
    primaryLight: '#2d89e9',      // Lighter shade
    primaryLighter: '#84B3FE',    // Even lighter
    primaryLightest: '#cee0fc',   // Lightest shade
    gray: '#5a5a5a',              // Dark gray
    grayLight: '#dadce5',         // Light gray
    grayLighter: '#f6f8ff',       // Lighter gray
    grayLightest: '#fafafa',      // Lightest gray
    textPrimary: '#f4f4f4',       // Primary text color
    white: '#fff'                 // White color
  },
  radius: {
    small: '4px',                 // Small border radius
    medium: '8px',                // Medium border radius
    large: '10px',                // Large border radius
    xlarge: '12px'                // Extra large border radius
  },
  spacing: {
    xs: '4px',                    // Extra small spacing
    sm: '8px',                    // Small spacing
    md: '12px',                   // Medium spacing
    lg: '16px',                   // Large spacing
    xl: '20px',                   // Extra large spacing
    xxl: '24px'                   // Double extra large
  },
  fontSize: {
    xs: '10px',                   // Extra small font
    sm: '12px',                   // Small font
    md: '14px',                   // Medium font
    lg: '16px'                    // Large font
  },
  fontWeight: {
    normal: '400',                // Normal weight
    medium: '500',                // Medium weight
    semibold: '600'               // Semibold weight
  },
  dimensions: {
    width: '360px',               // Datepicker width
    daySize: '32px',              // Day cell size
    buttonHeight: '24px',         // Button height
    weekdayHeight: '16px'         // Weekday header height
  },
  grid: {
    columns: '7',                 // Grid columns (days of week)
    gap: '16px',                  // Gap between cells
    columnGap: '0'                // Column gap
  },
  transitions: {
    duration: '0.2s',             // Transition duration
    timing: 'ease-in-out'         // Transition timing function
  },
  range: {
    gradientStart: 'rgba(206, 224, 252, 0.15)',  // Range start color
    gradientEnd: '#cee0fc'                        // Range end color
  },
  scrollbar: {
    width: '2px',                 // Scrollbar width
    thumbHeight: '48px',          // Scrollbar thumb height
    trackColor: '#cee0fc',        // Scrollbar track color
    thumbColor: '#84b3fe'         // Scrollbar thumb color
  }
};
```

### CSS Variable Mapping

| Theme Property | CSS Variable | Default Value |
|----------------|--------------|---------------|
| `colors.primary` | `--datepicker-primary-500` | `#2f7bf5` |
| `colors.primaryDark` | `--datepicker-primary-600` | `#2471eb` |
| `colors.primaryLight` | `--datepicker-primary-400` | `#2d89e9` |
| `dimensions.width` | `--datepicker-width` | `360px` |
| `dimensions.daySize` | `--datepicker-day-size` | `32px` |
| `radius.medium` | `--datepicker-radius-8` | `8px` |
| `spacing.lg` | `--datepicker-spacing-16` | `16px` |
| `fontSize.md` | `--datepicker-font-size-14` | `14px` |

---

## Complete Examples

### Example 1: Larger Datepicker with Rounded Corners

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const largeTheme = ref({
  dimensions: {
    width: '450px',
    daySize: '48px',
    buttonHeight: '32px'
  },
  radius: {
    medium: '12px',
    large: '16px',
    xlarge: '20px'
  },
  spacing: {
    md: '16px',
    lg: '20px',
    xl: '24px',
    xxl: '32px'
  },
  fontSize: {
    sm: '14px',
    md: '16px',
    lg: '18px'
  }
});
</script>

<template>
  <DatepickerHeadless :theme="largeTheme" locale="en">
    <template #default="{ open, formattedDate }">
      <button @click="open" class="large-button">
        {{ formattedDate || 'Pick a Date' }}
      </button>
    </template>
  </DatepickerHeadless>
</template>
```

### Example 2: Compact Datepicker

```vue
<script setup>
const compactTheme = {
  dimensions: {
    width: '280px',
    daySize: '24px',
    buttonHeight: '20px'
  },
  spacing: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  fontSize: {
    xs: '9px',
    sm: '10px',
    md: '12px'
  }
};
</script>

<template>
  <DatepickerHeadless :theme="compactTheme">
    <template #default="{ open, formattedDate }">
      <input :value="formattedDate" @click="open" placeholder="Date" />
    </template>
  </DatepickerHeadless>
</template>
```

### Example 3: Purple Theme

```vue
<script setup>
const purpleTheme = {
  colors: {
    primary: '#9c27b0',
    primaryDark: '#7b1fa2',
    primaryLight: '#ba68c8',
    primaryLighter: '#ce93d8',
    primaryLightest: '#e1bee7'
  }
};
</script>

<template>
  <DatepickerHeadless :theme="purpleTheme">
    <template #default="{ open, formattedDate }">
      <button @click="open">{{ formattedDate }}</button>
    </template>
  </DatepickerHeadless>
</template>
```

---

## Dark Mode Example

### Approach 1: CSS Variables with Dark Mode

```css
/* styles/datepicker-dark-theme.css */
:root {
  --datepicker-primary-500: #2f7bf5;
  --datepicker-gray-100: #ffffff;
  --datepicker-text-primary: #1a1a1a;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --datepicker-primary-500: #84b3fe;
    --datepicker-gray-100: #1e1e1e;
    --datepicker-gray-200: #2a2a2a;
    --datepicker-gray-50: #2e2e2e;
    --datepicker-text-primary: #ffffff;
    --datepicker-white: #1a1a1a;
  }
}

/* Or use a class-based approach */
.dark-mode {
  --datepicker-primary-500: #84b3fe;
  --datepicker-gray-100: #1e1e1e;
  --datepicker-gray-200: #2a2a2a;
  --datepicker-gray-50: #2e2e2e;
  --datepicker-text-primary: #ffffff;
  --datepicker-white: #1a1a1a;
}
```

### Approach 2: Dynamic Theme Switching

```vue
<script setup>
import { ref, computed } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const isDarkMode = ref(false);

const lightTheme = {
  colors: {
    primary: '#2f7bf5',
    grayLighter: '#ffffff',
    gray: '#5a5a5a',
    textPrimary: '#1a1a1a'
  }
};

const darkTheme = {
  colors: {
    primary: '#84b3fe',
    grayLighter: '#1e1e1e',
    grayLight: '#2a2a2a',
    gray: '#e0e0e0',
    textPrimary: '#ffffff',
    white: '#1a1a1a'
  }
};

const currentTheme = computed(() => isDarkMode.value ? darkTheme : lightTheme);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script>

<template>
  <div>
    <button @click="toggleDarkMode">
      Toggle {{ isDarkMode ? 'Light' : 'Dark' }} Mode
    </button>

    <DatepickerHeadless :theme="currentTheme">
      <template #default="{ open, formattedDate }">
        <button @click="open">{{ formattedDate }}</button>
      </template>
    </DatepickerHeadless>
  </div>
</template>
```

---

## Multiple Themes

You can use different themes for different datepickers in the same application:

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const blueTheme = { colors: { primary: '#2196f3' } };
const greenTheme = { colors: { primary: '#4caf50' } };
const orangeTheme = { colors: { primary: '#ff9800' } };

const startDate = ref(null);
const endDate = ref(null);
const eventDate = ref(null);
</script>

<template>
  <div class="date-pickers">
    <div class="picker-group">
      <label>Start Date (Blue Theme)</label>
      <DatepickerHeadless v-model="startDate" :theme="blueTheme">
        <template #default="{ open, formattedDate }">
          <input :value="formattedDate" @click="open" />
        </template>
      </DatepickerHeadless>
    </div>

    <div class="picker-group">
      <label>End Date (Green Theme)</label>
      <DatepickerHeadless v-model="endDate" :theme="greenTheme">
        <template #default="{ open, formattedDate }">
          <input :value="formattedDate" @click="open" />
        </template>
      </DatepickerHeadless>
    </div>

    <div class="picker-group">
      <label>Event Date (Orange Theme)</label>
      <DatepickerHeadless v-model="eventDate" :theme="orangeTheme">
        <template #default="{ open, formattedDate }">
          <input :value="formattedDate" @click="open" />
        </template>
      </DatepickerHeadless>
    </div>
  </div>
</template>
```

---

## Best Practices

### 1. Use Global CSS Variables for Consistent Branding

If all datepickers in your app should look the same:

```css
/* ✅ Good: Global theme */
:root {
  --datepicker-primary-500: var(--brand-primary);
  --datepicker-radius-8: var(--brand-radius);
}
```

### 2. Use Theme Prop for Special Cases

For datepickers that need unique styling:

```vue
<!-- ✅ Good: Special theme for specific picker -->
<DatepickerHeadless :theme="specialTheme">
  <!-- ... -->
</DatepickerHeadless>
```

### 3. Combine Both Approaches

Set global defaults and override for specific instances:

```css
/* Global defaults */
:root {
  --datepicker-primary-500: #2f7bf5;
}
```

```vue
<!-- Override for this instance -->
<DatepickerHeadless :theme="{ colors: { primary: '#e91e63' } }">
  <!-- ... -->
</DatepickerHeadless>
```

### 4. Keep Themes Consistent

Create theme objects that you can reuse:

```js
// themes.js
export const themes = {
  blue: { colors: { primary: '#2196f3' } },
  green: { colors: { primary: '#4caf50' } },
  purple: { colors: { primary: '#9c27b0' } }
};
```

```vue
<script setup>
import { themes } from './themes';
</script>

<template>
  <DatepickerHeadless :theme="themes.blue">
    <!-- ... -->
  </DatepickerHeadless>
</template>
```

---

## Troubleshooting

### Theme Not Applying

1. **Check if theme prop is passed correctly:**
   ```vue
   <!-- ✅ Correct -->
   <DatepickerHeadless :theme="myTheme">

   <!-- ❌ Incorrect (missing colon) -->
   <DatepickerHeadless theme="myTheme">
   ```

2. **Ensure theme object is reactive:**
   ```js
   // ✅ Correct
   const theme = ref({ colors: { primary: '#e91e63' } });

   // ✅ Also correct
   const theme = { colors: { primary: '#e91e63' } };
   ```

3. **Verify CSS variable names match:**
   ```js
   // ✅ Correct property names
   { colors: { primary: '#e91e63' } }

   // ❌ Incorrect (typo)
   { color: { primary: '#e91e63' } }
   ```

### Global Styles Not Working

1. **Import order matters:**
   ```js
   // ✅ Import your theme AFTER the datepicker
   import '@mahlaparvaz/vue-datepicker';
   import './datepicker-theme.css';
   ```

2. **Use correct specificity:**
   ```css
   /* ✅ Use :root for global scope */
   :root {
     --datepicker-primary-500: #e91e63;
   }
   ```

---

## Need Help?

- 📖 [Main Documentation](./README.md)
- 🔤 [Font Configuration Guide](./FONTS.md)
- 🐛 [Report Issues](https://github.com/mahlaparvaz/vue-datepicker/issues)
- 💬 [Discussions](https://github.com/mahlaparvaz/vue-datepicker/discussions)
