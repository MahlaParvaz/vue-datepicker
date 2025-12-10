<script setup>
  defineProps({
    color: { type: String, default: '#868A95' },
    width: { type: Number, default: 24 },
    height: { type: Number, default: 24 },
  });
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none">
    <path d="M8.91 19.92L15.43 13.4a2 2 0 0 0 0-2.8L8.91 4.08" :stroke="color" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
