# Vue DatePicker

یک کامپوننت انتخاب تاریخ شمسی برای Vue 3 با طراحی ساده و کاربردی.

## ویژگی‌ها

- ✅ تقویم شمسی (جلالی)
- ✅ انتخاب تک تاریخ
- ✅ ناوبری بین سال و ماه
- ✅ نمایش تاریخ امروز
- ✅ تنظیم حداقل و حداکثر تاریخ
- ✅ اتصال به input سفارشی
- ✅ قابلیت تنظیم مقدار اولیه
- ✅ پشتیبانی کامل از Vue 3

## نصب

```bash
npm install @mahlaparvaz/vue-datepicker
```

## استفاده پایه

```vue
<script setup>
  import { ref } from 'vue';
  import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';
  import '@mahlaparvaz/vue-datepicker/dist/vue-datepicker.css';

  const selectedDate = ref(null);
</script>

<template>
  <DatepickerInput v-model="selectedDate" />
</template>
```

## مثال‌های کاربردی

### انتخاب تاریخ با رویداد

```vue
<script setup>
  import { ref } from 'vue';
  import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';

  const date = ref(null);

  function handleChange(value) {
    console.log('تاریخ انتخاب شده:', value);
  }
</script>

<template>
  <DatepickerInput v-model="date" @change="handleChange" />
</template>
```

### محدود کردن بازه تاریخ

```vue
<script setup>
  import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';

  const minDate = { jy: 1404, jm: 1, jd: 1 };
  const maxDate = { jy: 1404, jm: 12, jd: 29 };
</script>

<template>
  <DatepickerInput :min-date="minDate" :max-date="maxDate" />
</template>
```

### تنظیم مقدار اولیه

```vue
<script setup>
  import { ref } from 'vue';
  import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';

  const initialDate = ref({ jy: 1404, jm: 1, jd: 15 });
</script>

<template>
  <DatepickerInput v-model="initialDate" />
</template>
```

### تغییر فرمت نمایش

```vue
<template>
  <DatepickerInput format="YYYY/MM/DD" placeholder="انتخاب تاریخ" />
</template>
```

## API

### Props - DatepickerInput

| Prop          | Type             | Default          | Description                  |
| ------------- | ---------------- | ---------------- | ---------------------------- |
| `modelValue`  | `Object \| null` | `null`           | مقدار انتخاب شده             |
| `minDate`     | `Object \| null` | `null`           | کمترین تاریخ قابل انتخاب     |
| `maxDate`     | `Object \| null` | `null`           | بیشترین تاریخ قابل انتخاب    |
| `format`      | `String`         | `'YYYY/MM/DD'`   | فرمت نمایش تاریخ             |
| `placeholder` | `String`         | `'انتخاب تاریخ'` | متن placeholder              |
| `locale`      | `String`         | `'fa'`           | زبان تقویم (فعلاً فقط فارسی) |

### Props - DatePicker

| Prop         | Type             | Default | Description               |
| ------------ | ---------------- | ------- | ------------------------- |
| `modelValue` | `Object \| null` | `null`  | مقدار انتخاب شده          |
| `minDate`    | `Object \| null` | `null`  | کمترین تاریخ قابل انتخاب  |
| `maxDate`    | `Object \| null` | `null`  | بیشترین تاریخ قابل انتخاب |
| `locale`     | `String`         | `'fa'`  | زبان تقویم                |

### Events

| Event               | Payload  | Description                         |
| ------------------- | -------- | ----------------------------------- |
| `update:modelValue` | `Object` | زمانی که تاریخ تایید می‌شود         |
| `change`            | `Object` | زمانی که تاریخ تغییر می‌کند         |
| `confirm`           | `Object` | زمانی که کاربر دکمه تایید را می‌زند |
| `open`              | -        | زمانی که تقویم باز می‌شود           |
| `close`             | -        | زمانی که تقویم بسته می‌شود          |

### ساختار Object تاریخ

```js
{
  jy: 1404,  // سال جلالی (چهار رقمی)
  jm: 1,     // ماه (1 تا 12)
  jd: 15     // روز (1 تا 31)
}
```

### فرمت‌های پشتیبانی شده

- `YYYY` - سال چهار رقمی (مثال: ۱۴۰۴)
- `MM` - ماه دو رقمی (مثال: ۰۱)
- `DD` - روز دو رقمی (مثال: ۱۵)

## استفاده پیشرفته

### استفاده مستقیم از کامپوننت DatePicker

```vue
<script setup>
  import { ref } from 'vue';
  import { DatePicker } from '@mahlaparvaz/vue-datepicker';

  const selectedDate = ref(null);
  const showPicker = ref(false);
</script>

<template>
  <div>
    <button @click="showPicker = true">باز کردن تقویم</button>

    <DatePicker
      v-if="showPicker"
      v-model="selectedDate"
      @close="showPicker = false"
      @confirm="showPicker = false"
    />
  </div>
</template>
```

### استفاده از Composable

```vue
<script setup>
  import { useDatePicker } from '@mahlaparvaz/vue-datepicker';

  const {
    currentYear,
    currentMonth,
    calendarDays,
    selectDay,
    selectMonth,
    selectYear,
    confirmSelection,
  } = useDatePicker({
    locale: 'fa',
    minDate: { jy: 1404, jm: 1, jd: 1 },
    maxDate: { jy: 1404, jm: 12, jd: 29 },
  });
</script>
```

## مثال کامل

```vue
<script setup>
  import { ref } from 'vue';
  import { DatepickerInput } from '@mahlaparvaz/vue-datepicker';
  import '@mahlaparvaz/vue-datepicker/dist/vue-datepicker.css';

  const selectedDate = ref(null);
  const minDate = { jy: 1403, jm: 1, jd: 1 };
  const maxDate = { jy: 1404, jm: 12, jd: 29 };

  function handleConfirm(date) {
    console.log('تاریخ تایید شده:', date);
  }

  function handleChange(date) {
    console.log('تاریخ تغییر کرد:', date);
  }
</script>

<template>
  <div>
    <DatepickerInput
      v-model="selectedDate"
      :min-date="minDate"
      :max-date="maxDate"
      format="YYYY/MM/DD"
      placeholder="تاریخ مورد نظر را انتخاب کنید"
      @confirm="handleConfirm"
      @change="handleChange"
    />

    <p v-if="selectedDate">
      تاریخ انتخابی: {{ selectedDate.jy }}/{{ selectedDate.jm }}/{{ selectedDate.jd }}
    </p>
  </div>
</template>
```

## پشتیبانی مرورگر

- Chrome (آخرین نسخه)
- Firefox (آخرین نسخه)
- Safari (آخرین نسخه)
- Edge (آخرین نسخه)

## مجوز

MIT

---

ساخته شده با ❤️ برای جامعه Vue
