# Vue Multi-Calendar Datepicker

A comprehensive, feature-rich Vue 3 datepicker component with support for Jalali (Persian), Gregorian, Hijri, and Chinese calendars. **Headless architecture** with custom font support and an incredibly lightweight bundle!

[![npm version](https://img.shields.io/npm/v/@mahlaparvaz/vue-datepicker.svg)](https://www.npmjs.com/package/@mahlaparvaz/vue-datepicker)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@mahlaparvaz/vue-datepicker)](https://bundlephobia.com/package/@mahlaparvaz/vue-datepicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Key Highlights

```vue
<script setup>
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';
// That's it! Only ~24KB gzipped
</script>

<template>
  <DatepickerHeadless
    v-model="date"
    :font-config="{ jalali: 'Vazir', gregorian: 'Roboto' }"
  >
    <template #default="{ open, formattedDate, fontFamily }">
      <input :value="formattedDate" :style="{ fontFamily }" @click="open" />
    </template>
  </DatepickerHeadless>
</template>
```

**What makes this special:**
- 🪶 **Ultra Lightweight** - Only **24KB gzipped** (one of the smallest Vue datepickers!)
- 🎨 **Headless Architecture** - Full UI control via scoped slots
- 🔤 **Custom Font Support** - Built-in font configuration for any locale
- 💅 **Auto-Styled** - CSS automatically injected, no manual imports
- 🎯 **v-model Optional** - Works with or without v-model binding
- 🌍 **4 Calendars** - Jalali, Gregorian, Hijri, Chinese
- ⚡ **Tree-shakeable** - Optimized bundle with tree-shaking

## ✨ Features

- 🎨 **Headless Architecture**: Full UI control via scoped slots - build your own trigger element
- 🎨 **Advanced Theming**: Dual theming system - global CSS variables OR per-instance theme prop with dark mode support
- 🔤 **Custom Font Support**: Built-in font configuration for any locale via `fontConfig` prop
- 🪶 **Ultra Lightweight**: Only **24KB gzipped** - one of the smallest Vue datepickers!
- 🌍 **Multi-Calendar Support**: Jalali (Persian), Gregorian, Hijri, and Chinese calendars
- 📅 **Multiple Selection Modes**: Single date, date range, and multiple dates
- ⏰ **Time Picker**: Optional time selection with 12/24-hour format
- 🌐 **Internationalization**: Built-in support for multiple locales with easy switching
- 🎯 **Zero Configuration**: Works out of the box without v-model (optional internal state management)
- 💅 **Auto-Styled**: CSS automatically injected - no manual style imports needed!
- 📤 **Multiple Output Formats**: Object, timestamp, Unix, ISO string, custom string, or custom formatter function
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- ♿ **Accessible**: Keyboard navigation and ARIA labels
- ⚡ **Tree-shakeable**: Optimized bundle with tree-shaking support
- 🔧 **Flexible Date Constraints**: Min/max dates and dynamic year ranges

## 📦 Installation

```bash
npm install @mahlaparvaz/vue-datepicker
```

```bash
yarn add @mahlaparvaz/vue-datepicker
```

```bash
pnpm add @mahlaparvaz/vue-datepicker
```

## 🚀 Quick Start

### Headless Component (Full UI Control)

The datepicker uses a **headless architecture** - you control the trigger UI completely via scoped slots:

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const selectedDate = ref(null);
</script>

<template>
  <DatepickerHeadless v-model="selectedDate">
    <template #default="{ open, formattedDate, fontFamily }">
      <input
        :value="formattedDate"
        :style="{ fontFamily }"
        @click="open"
        placeholder="Select a date"
      />
    </template>
  </DatepickerHeadless>
</template>
```

### Pre-built Input Component

For quick implementation, use the pre-styled input component:

```vue
<script setup>
import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';
// That's it! No CSS imports, no v-model required
</script>

<template>
  <DatepickerInput placeholder="Select a date" />
</template>
```

### With v-model (Optional)

If you need to access the selected date externally:

```vue
<script setup>
import { ref } from 'vue';
import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';

const selectedDate = ref(null);
</script>

<template>
  <DatepickerInput
    v-model="selectedDate"
    placeholder="Select a date"
  />
</template>
```

### With Jalali Calendar

```vue
<script setup>
import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';
</script>

<template>
  <DatepickerInput
    locale="fa"
    placeholder="انتخاب تاریخ"
  />
</template>
```

## 🔤 Custom Font Configuration

Fonts are **NOT included** in the bundle by default to keep the package lightweight (only 24KB gzipped). You can easily add your own fonts!

### Option 1: Using `fontConfig` Prop (Recommended)

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const date = ref(null);

const customFonts = {
  jalali: 'Vazir, IRANYekan, sans-serif',
  gregorian: 'Roboto, Arial, sans-serif',
  hijri: 'Amiri, serif',
  chinese: 'Noto Sans SC, sans-serif'
};
</script>

<template>
  <DatepickerHeadless
    v-model="date"
    :font-config="customFonts"
  >
    <template #default="{ open, formattedDate, fontFamily }">
      <button
        @click="open"
        :style="{ fontFamily }"
      >
        {{ formattedDate || 'Select Date' }}
      </button>
    </template>
  </DatepickerHeadless>
</template>
```

### Option 2: Load Fonts via CDN

Add fonts from a CDN in your HTML:

```html
<!-- In your index.html -->
<head>
  <!-- For Persian (Jalali/Hijri) -->
  <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css" rel="stylesheet">

  <!-- For other languages -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
```

Then use them in your config:

```vue
<DatepickerHeadless
  :font-config="{ jalali: 'Vazir, sans-serif', gregorian: 'Roboto, sans-serif' }"
/>
```

### Default Fonts

If no `fontConfig` is provided, the datepicker uses these fallback fonts:

- **Jalali**: `IRANYekan, sans-serif`
- **Hijri**: `IRANYekan, sans-serif`
- **Gregorian**: `Arial, sans-serif`
- **Chinese**: `Microsoft YaHei, SimHei, sans-serif`

**For a complete font configuration guide**, see [FONTS.md](./FONTS.md)

## 🎨 Theming & Customization

The datepicker provides two powerful ways to customize its appearance:

### Option 1: Global CSS Variables (Recommended for App-Wide Styling)

Override CSS variables in your global styles to customize all datepicker instances:

```css
/* In your global CSS file (e.g., app.css) */
:root {
  /* Colors */
  --datepicker-primary-500: #e91e63;
  --datepicker-primary-600: #c2185b;

  /* Dimensions */
  --datepicker-width: 400px;
  --datepicker-day-size: 40px;

  /* Border Radius */
  --datepicker-radius-8: 12px;
  --datepicker-radius-10: 16px;

  /* Spacing */
  --datepicker-spacing-16: 20px;
}
```

### Option 2: Theme Prop (For Per-Instance Styling)

Pass a `theme` object to specific datepicker instances:

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const customTheme = ref({
  colors: {
    primary: '#e91e63',
    primaryLight: '#f06292',
    primaryDark: '#c2185b'
  },
  dimensions: {
    width: '400px',
    daySize: '40px'
  },
  radius: {
    medium: '12px',
    large: '16px'
  }
});
</script>

<template>
  <DatepickerHeadless :theme="customTheme">
    <template #default="{ open, formattedDate }">
      <button @click="open">{{ formattedDate || 'Select Date' }}</button>
    </template>
  </DatepickerHeadless>
</template>
```

### Dark Mode Example

```vue
<script setup>
import { ref, computed } from 'vue';

const isDarkMode = ref(false);

const darkTheme = {
  colors: {
    primary: '#84b3fe',
    grayLighter: '#1e1e1e',
    grayLight: '#2a2a2a',
    textPrimary: '#ffffff'
  }
};

const lightTheme = {
  colors: {
    primary: '#2f7bf5',
    grayLighter: '#ffffff',
    textPrimary: '#1a1a1a'
  }
};

const currentTheme = computed(() => isDarkMode.value ? darkTheme : lightTheme);
</script>

<template>
  <DatepickerHeadless :theme="currentTheme">
    <template #default="{ open, formattedDate }">
      <button @click="open">{{ formattedDate }}</button>
    </template>
  </DatepickerHeadless>
</template>
```

**For complete theming documentation**, see [THEMING.md](./THEMING.md)

## 📦 Bundle Size

One of the smallest Vue datepicker packages available:

| Format | Size | Gzipped |
|--------|------|---------|
| ES Module | 109 KB | **24 KB** |
| UMD | 76 KB | **18 KB** |

**How we keep it small:**
- 🚫 No fonts included by default (you provide your own)
- ⚡ Tree-shakeable ES modules
- 🗜️ Aggressive minification with Terser
- 📦 CSS injected directly into JS bundle
- 🎯 Vue marked as external dependency

## 🎨 Headless Component Examples

The `DatepickerHeadless` component provides complete UI flexibility. You control the trigger element via the default scoped slot.

### Available Slot Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | `Function` | Opens the datepicker overlay |
| `close` | `Function` | Closes the datepicker overlay |
| `toggle` | `Function` | Toggles the datepicker overlay |
| `formattedDate` | `String` | Formatted date string for display |
| `fontFamily` | `String` | Current font family based on calendar type and fontConfig |
| `isOpen` | `Boolean` | Whether the datepicker is currently open |

### Custom Button Trigger

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const date = ref(null);
</script>

<template>
  <DatepickerHeadless v-model="date" locale="fa">
    <template #default="{ open, formattedDate, fontFamily }">
      <button
        @click="open"
        :style="{ fontFamily }"
        class="custom-button"
      >
        📅 {{ formattedDate || 'انتخاب تاریخ' }}
      </button>
    </template>
  </DatepickerHeadless>
</template>
```

### Custom Input with Icon

```vue
<template>
  <DatepickerHeadless v-model="date" :font-config="{ jalali: 'Vazir' }">
    <template #default="{ open, formattedDate, fontFamily, isOpen }">
      <div class="input-wrapper">
        <input
          :value="formattedDate"
          :style="{ fontFamily }"
          @click="open"
          placeholder="Select date"
          readonly
        />
        <svg v-if="!isOpen" class="icon" @click="open">
          <!-- Calendar icon -->
        </svg>
        <svg v-else class="icon" @click="close">
          <!-- Close icon -->
        </svg>
      </div>
    </template>
  </DatepickerHeadless>
</template>
```

### With Form Integration

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const form = ref({
  startDate: null,
  endDate: null
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Start Date:</label>
      <DatepickerHeadless v-model="form.startDate" mode="single">
        <template #default="{ open, formattedDate, fontFamily }">
          <input
            :value="formattedDate"
            :style="{ fontFamily }"
            @click="open"
            placeholder="Select start date"
          />
        </template>
      </DatepickerHeadless>
    </div>

    <div class="form-group">
      <label>End Date:</label>
      <DatepickerHeadless v-model="form.endDate" mode="single">
        <template #default="{ open, formattedDate, fontFamily }">
          <input
            :value="formattedDate"
            :style="{ fontFamily }"
            @click="open"
            placeholder="Select end date"
          />
        </template>
      </DatepickerHeadless>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>
```

## 📖 Usage Examples

### Single Date Selection

```vue
<DatepickerInput
  mode="single"
  locale="en"
  placeholder="Select a date"
/>
```

### Date Range Selection

```vue
<DatepickerInput
  mode="range"
  locale="fa"
  placeholder="انتخاب بازه تاریخ"
/>
```

**With v-model:**
```vue
<script setup>
import { ref } from 'vue';

const dateRange = ref({
  start: null,
  end: null
});
</script>

<template>
  <DatepickerInput
    v-model="dateRange"
    mode="range"
    locale="fa"
  />
</template>
```

### Multiple Dates Selection

```vue
<DatepickerInput
  mode="multiple"
  placeholder="Select multiple dates"
/>
```

**With v-model:**
```vue
<script setup>
import { ref } from 'vue';

const multipleDates = ref([]);
</script>

<template>
  <DatepickerInput
    v-model="multipleDates"
    mode="multiple"
  />
</template>
```

### With Time Picker

```vue
<DatepickerInput
  :enable-time="true"
  :time-format="24"
  locale="fa"
  placeholder="انتخاب تاریخ و زمان"
/>
```

### With Date Constraints

```vue
<DatepickerInput
  :years-before="10"
  :years-after="5"
  locale="fa"
/>
```

### Output Formats

The datepicker supports multiple output formats for flexibility in your application:

#### Object Format (Default)

Returns the raw date object:

```vue
<script setup>
import { ref } from 'vue';
import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';

const selectedDate = ref(null);
// Output: { jy: 1403, jm: 9, jd: 18, hour: 14, minute: 30 }
</script>

<template>
  <DatepickerInput
    v-model="selectedDate"
    output-format="object"
  />
</template>
```

#### Timestamp Format

Returns JavaScript timestamp in milliseconds:

```vue
<script setup>
import { ref } from 'vue';

const selectedDate = ref(null);
// Output: 1702905000000
</script>

<template>
  <DatepickerInput
    v-model="selectedDate"
    output-format="timestamp"
  />
</template>
```

#### Unix Timestamp Format

Returns Unix timestamp in seconds:

```vue
<DatepickerInput
  v-model="selectedDate"
  output-format="unix"
/>
<!-- Output: 1702905000 -->
```

#### ISO String Format

Returns ISO 8601 formatted string:

```vue
<DatepickerInput
  v-model="selectedDate"
  output-format="iso"
/>
<!-- Output: "2023-12-18T14:30:00.000Z" -->
```

#### Custom String Format

Returns a custom formatted string:

```vue
<DatepickerInput
  v-model="selectedDate"
  output-format="string"
  output-string-format="YYYY-MM-DD HH:mm"
/>
<!-- Output: "1403-09-18 14:30" -->
```

Available format tokens:
- `YYYY` - 4-digit year
- `YY` - 2-digit year
- `MM` - 2-digit month
- `M` - Month without leading zero
- `DD` - 2-digit day
- `D` - Day without leading zero
- `HH` - 2-digit hour
- `H` - Hour without leading zero
- `mm` - 2-digit minute
- `m` - Minute without leading zero

#### Custom Formatter Function

Use a custom function for complete control:

```vue
<script setup>
import { ref } from 'vue';

const selectedDate = ref(null);

const customFormatter = (date) => {
  if (!date) return null;

  // For range mode
  if (date.start && date.end) {
    return `From ${date.start.jy}/${date.start.jm}/${date.start.jd} to ${date.end.jy}/${date.end.jm}/${date.end.jd}`;
  }

  // For single mode
  return `Custom: ${date.jy}-${date.jm}-${date.jd}`;
};
</script>

<template>
  <DatepickerInput
    v-model="selectedDate"
    :output-format="customFormatter"
  />
</template>
```

#### Using OUTPUT_FORMATS Constant

For better type safety and code clarity:

```vue
<script setup>
import { ref } from 'vue';
import { DatepickerInput, OUTPUT_FORMATS } from '@mahlaparvaz/vue-datepicker';

const selectedDate = ref(null);
</script>

<template>
  <DatepickerInput
    v-model="selectedDate"
    :output-format="OUTPUT_FORMATS.TIMESTAMP"
  />
</template>
```

Available constants:
- `OUTPUT_FORMATS.OBJECT` - Default object format
- `OUTPUT_FORMATS.TIMESTAMP` - JavaScript timestamp (ms)
- `OUTPUT_FORMATS.UNIX` - Unix timestamp (seconds)
- `OUTPUT_FORMATS.ISO` - ISO 8601 string
- `OUTPUT_FORMATS.STRING` - Custom formatted string

### Custom Calendar Type

```vue
<!-- Hijri calendar -->
<DatepickerInput
  locale="ar"
  placeholder="اختر التاريخ"
/>

<!-- Chinese calendar -->
<DatepickerInput
  locale="zh"
  placeholder="选择日期"
/>
```

## 🎛️ API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Object` | `null` | **Optional** - The selected date(s). Component works without v-model using internal state |
| `mode` | `'single' \| 'range' \| 'multiple'` | `'single'` | Selection mode |
| `locale` | `String` | `null` | **Optional** - Calendar locale (`'fa'`, `'en'`, `'ar'`, `'zh'`). Auto-detected from store if not provided |
| `placeholder` | `String` | Auto | Input placeholder text |
| `format` | `String` | `'YYYY/MM/DD'` | Date display format in the input field |
| `fontConfig` | `Object` | `null` | Custom font configuration for different calendar types. Example: `{ jalali: 'Vazir', gregorian: 'Roboto', hijri: 'Amiri', chinese: 'Noto Sans SC' }` |
| `theme` | `Object` | `null` | Custom theme configuration for styling. Example: `{ colors: { primary: '#e91e63' }, dimensions: { width: '400px' } }`. See [THEMING.md](./THEMING.md) |
| `enableTime` | `Boolean` | `false` | Enable time selection |
| `timeFormat` | `Number \| String` | `24` | Time format (12 or 24) |
| `yearsBefore` | `Number` | `50` | Number of years before current year |
| `yearsAfter` | `Number` | `50` | Number of years after current year |
| `enableLocaleSelector` | `Boolean` | `true` | Show locale selector in picker |
| `minDate` | `Date \| String` | `null` | Minimum selectable date |
| `maxDate` | `Date \| String` | `null` | Maximum selectable date |
| `outputFormat` | `String \| Function` | `'object'` | Output format: `'object'`, `'timestamp'`, `'unix'`, `'iso'`, `'string'`, or custom function |
| `outputStringFormat` | `String` | `'YYYY/MM/DD'` | String format when `outputFormat` is `'string'` |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Object` | Emitted when date changes |
| `update:locale` | `String` | Emitted when locale changes |
| `change` | `Object` | Emitted on date change |
| `confirm` | `Object` | Emitted when date is confirmed |
| `open` | - | Emitted when picker opens |
| `close` | - | Emitted when picker closes |

### Date Object Format

#### Jalali Calendar
```javascript
{
  jy: 1403,      // Jalali year
  jm: 9,         // Jalali month (1-12)
  jd: 15,        // Jalali day
  hour: 14,      // Optional: hour (0-23)
  minute: 30     // Optional: minute (0-59)
}
```

#### Gregorian/Hijri/Chinese Calendars
```javascript
{
  year: 2024,    // Year
  month: 12,     // Month (1-12)
  day: 7,        // Day
  hour: 14,      // Optional: hour
  minute: 30     // Optional: minute
}
```

#### Range Mode
```javascript
{
  start: { jy: 1403, jm: 9, jd: 1 },
  end: { jy: 1403, jm: 9, jd: 15 }
}
```

#### Multiple Mode
```javascript
[
  { jy: 1403, jm: 9, jd: 1 },
  { jy: 1403, jm: 9, jd: 5 },
  { jy: 1403, jm: 9, jd: 10 }
]
```

## 🎨 Customization

### Automatic Style Injection

**No manual CSS import needed!** The component automatically injects its styles when imported. This means:

✅ **Just works** - Import the component and styles are included
✅ **No duplicate styles** - Styles are injected only once even with multiple instances
✅ **SSR compatible** - Safe for server-side rendering
✅ **No build config needed** - Works with Vite, Webpack, Rollup, etc.

```vue
<script setup>
// Just import - styles are automatically included!
import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';
</script>

<template>
  <DatepickerInput />
</template>
```

### CSS Variables

The datepicker uses CSS custom properties for easy theming:

```css
:root {
  /* Primary Colors */
  --datepicker-primary-600: #2471eb;
  --datepicker-primary-500: #2f7bf5;
  --datepicker-primary-400: #2d89e9;
  --datepicker-primary-300: #84b3fe;
  --datepicker-primary-200: #cee0fc;

  /* Gray Colors */
  --datepicker-gray-300: #5a5a5a;
  --datepicker-gray-200: #dadce5;
  --datepicker-gray-100: #f6f8ff;
  --datepicker-gray-50: #fafafa;

  /* Dimensions */
  --datepicker-width: 360px;
  --datepicker-day-size: 32px;

  /* Spacing */
  --datepicker-spacing-8: 8px;
  --datepicker-spacing-12: 12px;
  --datepicker-spacing-16: 16px;
  --datepicker-spacing-20: 20px;

  /* Border Radius */
  --datepicker-radius-4: 4px;
  --datepicker-radius-8: 8px;
  --datepicker-radius-10: 10px;

  /* Font Sizes */
  --datepicker-font-size-10: 10px;
  --datepicker-font-size-12: 12px;
  --datepicker-font-size-14: 14px;
  --datepicker-font-size-16: 16px;

  /* And more... */
}
```

### Custom Theme Example

```css
/* Your custom theme */
:root {
  --datepicker-primary-500: #e91e63;
  --datepicker-primary-400: #f06292;
  --datepicker-day-size: 40px;
  --datepicker-radius-10: 20px;
}
```

### Using SCSS Mixins

```scss
// Import SCSS abstracts
@use '@mahlaparvaz/vue-datepicker/styles' as datepicker;

.my-custom-calendar {
  // Use provided mixins
  @include datepicker.datepicker-grid(7, 20px);
  @include datepicker.custom-scrollbar;
}
```

### Available SCSS Exports

```scss
// Import only variables
@use '@mahlaparvaz/vue-datepicker/styles/variables';

// Import only mixins
@use '@mahlaparvaz/vue-datepicker/styles/mixins';

// Import everything
@use '@mahlaparvaz/vue-datepicker/styles';
```

## 🌐 Internationalization

### Supported Locales

| Locale | Calendar Type | Direction | Number System |
|--------|--------------|-----------|---------------|
| `fa` | Jalali (Persian) | RTL | Persian |
| `en` | Gregorian | LTR | Western |
| `ar` | Hijri | RTL | Arabic |
| `zh` | Chinese | LTR | Chinese |

### Dynamic Locale Switching

Users can switch between calendars using the built-in locale selector (enabled by default):

```vue
<DatepickerInput :enable-locale-selector="true" />
```

Or control it programmatically:

```vue
<script setup>
const currentLocale = ref('fa');
const selectedDate = ref(null);
</script>

<template>
  <DatepickerInput
    v-model="selectedDate"
    v-model:locale="currentLocale"
    :enable-locale-selector="true"
  />
</template>
```

## 🔧 Advanced Features

### Internal State Management (No v-model Required)

The datepicker maintains its own internal state, so **v-model is completely optional**:

```vue
<script setup>
import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';

// No ref needed! Component manages state internally
// User can select dates and see them in the input
</script>

<template>
  <!-- Works perfectly without v-model -->
  <DatepickerInput
    mode="range"
    :enable-time="true"
    placeholder="Select dates"
  />
</template>
```

**When to use v-model:**
- ✅ When you need to access/manipulate selected dates externally
- ✅ When you want to set an initial value programmatically
- ✅ When you need to sync the value with other components
- ❌ NOT required for basic date selection functionality

**How it works:**
- Component uses internal `ref` to store selected date(s)
- Falls back to prop value if `v-model` is provided
- Emits `update:modelValue` for optional parent synchronization
- User selection is preserved and displayed regardless of v-model

### Validation

The datepicker automatically validates dates based on the selected calendar:

```javascript
import {
  isValidJalaaliDate,
  isValidGregorianDate,
  isValidDate
} from '@mahlaparvaz/vue-datepicker';

// Jalali validation
isValidJalaaliDate(1403, 9, 15);  // true
isValidJalaaliDate(1403, 13, 15); // false (invalid month)
isValidJalaaliDate(1403, 9, 32);  // false (invalid day)

// Gregorian validation
isValidGregorianDate(2024, 12, 7);  // true
isValidGregorianDate(2024, 2, 30);  // false (invalid day for February)
isValidGregorianDate(2024, 2, 29);  // true (leap year)

// Universal validation
isValidDate({ jy: 1403, jm: 9, jd: 15 });     // true
isValidDate({ year: 2024, month: 12, day: 7 }); // true
```

### Custom Date Parsing

```javascript
import { parseDate } from '@mahlaparvaz/vue-datepicker';

// Parse Jalali date
const jalaliDate = parseDate({ jy: 1403, jm: 9, jd: 15 });

// Parse Gregorian date
const gregorianDate = parseDate({ year: 2024, month: 12, day: 7 });

// Parse string
const stringDate = parseDate('1403/09/15');
```

## 📱 Responsive Design

The datepicker is fully responsive and works seamlessly on all screen sizes. The overlay automatically adjusts to mobile viewports.

## ♿ Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- High contrast mode support

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## ❓ FAQ

### Do I need to import CSS separately?

**No!** Styles are automatically injected when you import the component. No manual CSS imports needed.

### Can I use the datepicker without v-model?

**Yes!** The component works perfectly without v-model. It maintains internal state automatically.

```vue
<!-- This works! -->
<DatepickerInput placeholder="Select date" />
```

### How do I use custom fonts?

Use the `fontConfig` prop to specify fonts for each calendar type:

```vue
<DatepickerHeadless
  :font-config="{
    jalali: 'Vazir, sans-serif',
    gregorian: 'Roboto, Arial, sans-serif'
  }"
>
  <template #default="{ open, formattedDate, fontFamily }">
    <input :value="formattedDate" :style="{ fontFamily }" @click="open" />
  </template>
</DatepickerHeadless>
```

See [FONTS.md](./FONTS.md) for detailed font configuration options including CDN loading, NPM packages, and more.

### Why are fonts not included by default?

To keep the bundle size small! Including all font files would add ~200KB to the package. By letting you provide your own fonts via CDN, NPM, or custom configuration, we keep the package at only **24KB gzipped**.

### What's the bundle size?

One of the smallest Vue datepicker packages:
- **ES Module**: 109 KB (24 KB gzipped)
- **UMD**: 76 KB (18 KB gzipped)

### What is the headless architecture?

The headless component (`DatepickerHeadless`) provides all the logic and state management without imposing any UI. You control exactly how the trigger element looks using scoped slots:

```vue
<DatepickerHeadless v-model="date">
  <template #default="{ open, formattedDate, fontFamily }">
    <!-- Your custom button, input, or any element -->
    <button @click="open">{{ formattedDate }}</button>
  </template>
</DatepickerHeadless>
```

For a pre-styled option, use `DatepickerInput`.

### How do I customize the theme?

You have two options:

**Option 1: Global CSS Variables (affects all datepickers)**
```css
/* In your global CSS */
:root {
  --datepicker-primary-500: #e91e63;
  --datepicker-width: 400px;
  --datepicker-day-size: 40px;
}
```

**Option 2: Theme Prop (per-instance)**
```vue
<DatepickerHeadless :theme="{ colors: { primary: '#e91e63' } }">
  <!-- ... -->
</DatepickerHeadless>
```

See [THEMING.md](./THEMING.md) for complete theming documentation.

### Can I create a dark mode theme?

Yes! Use either CSS variables with media queries or the theme prop:

```vue
<script setup>
const darkTheme = {
  colors: {
    primary: '#84b3fe',
    grayLighter: '#1e1e1e',
    textPrimary: '#ffffff'
  }
};
</script>

<template>
  <DatepickerHeadless :theme="darkTheme">
    <!-- ... -->
  </DatepickerHeadless>
</template>
```

See [THEMING.md](./THEMING.md) for full dark mode examples.

### Which calendars are supported?

- **Jalali (Persian)**: `locale="fa"`
- **Gregorian**: `locale="en"`
- **Hijri (Islamic)**: `locale="ar"`
- **Chinese**: `locale="zh"`

### Does it work with TypeScript?

While the library is written in JavaScript, it provides full type support through JSDoc comments and works seamlessly with TypeScript projects.

### Is it SSR compatible?

Yes! The component checks for `document` availability before injecting styles, making it safe for server-side rendering.

### Can users switch between calendars?

Yes! Enable the locale selector:

```vue
<DatepickerInput :enable-locale-selector="true" />
```

Users can switch between all supported calendars dynamically.

## 📄 License

MIT © Mahla Zohourpar

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- 📧 Email: mahla.zph@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/MahlaParvaz/vue-datepicker/issues)

## 🙏 Acknowledgments

- Built with [Vue 3](https://vuejs.org/)
- Calendar calculations powered by custom adapters
- Inspired by modern datepicker designs

---

Made with ❤️ for the Vue community
