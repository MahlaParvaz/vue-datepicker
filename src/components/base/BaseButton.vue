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

<style lang="scss">
  .button {
    @include flex(inline-flex, center, center, 8px);
    border: 0;
    border-radius: $radius-12;
    cursor: pointer;
    font-family: 'IRANYekan';
    font-size: 16px;
    font-weight: 600;
    padding: 8px 16px;

    &--block {
      width: 100%;
      height: 48px;
    }

    &--primary {
      background-color: $primary-600;
      color: $white-100;
    }
    &--secondary {
      border: 1px solid $gray-200;
      height: 55px;
      width: 90px;
    }
    &--outline {
      border: none;
      background-color: transparent;
    }

    &--small {
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 400;
    }

    &--medium {
      font-size: 16px;
      font-weight: 600;
    }

    &--large {
      padding: 14px 24px;
      font-size: 16px;
    }
  }
</style>
