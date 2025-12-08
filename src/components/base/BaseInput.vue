<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    type: { type: String, default: 'text' },
    modelValue: { type: [String, Number], default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    size: { type: String, default: 'medium' },
  });

  const emit = defineEmits(['update:modelValue', 'click', 'focus', 'blur', 'keydown', 'keyup']);

  const inputClass = computed(() => ['input', `input--${props.size}`]);
  const handleInput = (event) => emit('update:modelValue', event.target.value);
  const handleClick = (event) => emit('click', event);
  const handleFocus = (event) => emit('focus', event);
  const handleBlur = (event) => emit('blur', event);
  const handleKeydown = (event) => emit('keydown', event);
  const handleKeyup = (event) => emit('keyup', event);
</script>

<template>
  <input
    :type="props.type"
    :class="inputClass"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    @input="handleInput"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  />
</template>
