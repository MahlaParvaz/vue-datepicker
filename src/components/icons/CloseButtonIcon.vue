<script setup>
  defineProps({
    color: { type: String, default: '#292D32' },
    size: { type: Number, default: 24 },
  });
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9.17 14.83L14.83 9.17M14.83 14.83L9.17 9.17" :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
