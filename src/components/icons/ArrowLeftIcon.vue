<script setup>
  defineProps({
    color: { type: String, default: '#868A95' },
    width: { type: Number, default: 24 },
    height: { type: Number, default: 24 },
  });
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none">
    <path d="M15 19.92L8.48 13.4a2 2 0 0 1 0-2.8L15 4.08" :stroke="color" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
