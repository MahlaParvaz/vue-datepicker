<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'medium' },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'button' },
    label: String,
  });

  const buttonClass = computed(() => [
    'button',
    `button--${props.size}`,
    `button--${props.variant}`,
    { 'button--block': props.block },
  ]);
</script>

<template>
  <button :type="props.type" :class="buttonClass" :disabled="props.disabled">
    <span class="button__icon button__icon--left"><slot name="icon-left" /></span>
    <span class="button__label"
      ><slot>{{ label }}</slot></span
    >
    <span class="button__icon button__icon--right"><slot name="icon-right" /></span>
  </button>
</template>
