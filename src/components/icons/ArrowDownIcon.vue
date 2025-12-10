<script setup>
  defineProps({
    color: { type: String, default: '#5B5E69' },
    width: { type: Number, default: 24 },
    height: { type: Number, default: 24 },
  });
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" :fill="color">
    <path
      d="M11.6143 15.5323C11.8143 15.7748 12.1857 15.7748 12.3857 15.5323L15.6553 11.5681C15.9243 11.242 15.6923 10.75 15.2696 10.75H8.73039C8.30766 10.75 8.07569 11.242 8.34467 11.5681L11.6143 15.5323Z"
    />
  </svg>
</template>
