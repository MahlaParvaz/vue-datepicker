# Vue Multi-Calendar Datepicker

A comprehensive, feature-rich Vue 3 datepicker component with support for Jalali (Persian), Gregorian, Hijri, and Chinese calendars. Built with full TypeScript support and completely customizable styling.

[![npm version](https://img.shields.io/npm/v/@mahlaparvaz/vue-datepicker.svg)](https://www.npmjs.com/package/@mahlaparvaz/vue-datepicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🌍 **Multi-Calendar Support**: Jalali (Persian), Gregorian, Hijri, and Chinese calendars
- 📅 **Multiple Selection Modes**: Single date, date range, and multiple dates
- ⏰ **Time Picker**: Optional time selection with 12/24-hour format
- 🎨 **Fully Customizable**: CSS variables and SCSS mixins for complete style control
- 🌐 **Internationalization**: Built-in support for multiple locales with easy switching
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- ♿ **Accessible**: Keyboard navigation and ARIA labels
- 🎯 **Type Safe**: Full TypeScript support
- 🪶 **Lightweight**: Tree-shakeable and optimized bundle size
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

### Basic Usage

```vue
<script setup>
import { ref } from 'vue';
import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';
// Styles are automatically included by most bundlers

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
import { ref } from 'vue';
import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';

const selectedDate = ref(null);
</script>

<template>
  <DatepickerInput
    v-model="selectedDate"
    locale="fa"
    placeholder=" select date"
  />
</template>
```

## 📖 Usage Examples

### Single Date Selection

```vue
<DatepickerInput
  v-model="selectedDate"
  mode="single"
  locale="en"
/>
```

### Date Range Selection

```vue
<script setup>
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
<script setup>
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
  v-model="selectedDateTime"
  :enable-time="true"
  :time-format="24"
  locale="fa"
/>
```

### With Date Constraints

```vue
<DatepickerInput
  v-model="selectedDate"
  :years-before="10"
  :years-after="5"
  locale="fa"
/>
```

### Custom Calendar Type

```vue
<DatepickerInput
  v-model="selectedDate"
  locale="ar"  <!-- Hijri calendar -->
/>

<DatepickerInput
  v-model="selectedDate"
  locale="zh"  <!-- Chinese calendar -->
/>
```

## 🎛️ API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Object` | `null` | The selected date(s) |
| `mode` | `'single' \| 'range' \| 'multiple'` | `'single'` | Selection mode |
| `locale` | `String` | `'fa'` | Calendar locale (`'fa'`, `'en'`, `'ar'`, `'zh'`) |
| `placeholder` | `String` | Auto | Input placeholder text |
| `format` | `String` | `'YYYY/MM/DD'` | Date format |
| `enableTime` | `Boolean` | `false` | Enable time selection |
| `timeFormat` | `Number \| String` | `24` | Time format (12 or 24) |
| `yearsBefore` | `Number` | `50` | Number of years before current year |
| `yearsAfter` | `Number` | `50` | Number of years after current year |
| `enableLocaleSelector` | `Boolean` | `true` | Show locale selector in picker |

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
npm run build:lib

# Run linter
npm run lint

# Format code
npm run format
```

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
