<template>
  <div class="local-selector" ref="localSelectorRef">
    <BaseButton
      variant="outline"
      type="button"
      size="small"
      @click="toggleDropdown"
      class="datepicker-content__controls-btn"
    >
      <template #icon-right>
        <ArrowDownIcon :width="24" :height="24" :class="{ 'locale-selector__icon-open': isOpen }" />
      </template>
      {{ currentLocalName }}
    </BaseButton>

    <Transition name="dropdown">
      <div v-if="isOpen" class="locale-selector__dropdown">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          type="button"
          class="locale-selector__option"
          :class="{ 'locale-selector__option--active': modelValue === locale.code }"
          @click="selectLocale(locale.code)"
        >
          {{ locale.name }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import BaseButton from '../base/BaseButton.vue';
  import ArrowDownIcon from '../icons/ArrowDownIcon.vue';

  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },

    availableLocales: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const isOpen = ref(false);
  const localeSelectorRef = ref(null);

  const currentLocalName = computed(() => {
    if (props.availableLocales.length === 0) {
      return 'شمسی';
    }

    const locale = props.availableLocales.find((locale) => locale.code === props.modelValue);
    return locale?.name || props.modelValue;
  });

  function toggleDropdown() {
    isOpen.value = !isOpen.value;
  }

  function selectLocale(localeCode) {
    emit('update:modelValue', localeCode);
    isOpen.value = false;
  }

  function handleClickOutside(event) {
    if (localeSelectorRef.value && !localeSelectorRef.value.contains(event.target)) {
      isOpen.value = false;
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style scoped lang="scss">
  .datepicker-content {
    @include flex(column, space-between, normal, 20px);
    margin-bottom: 20px;

    &__controls {
      @include flex(row, space-between, center, 8px);
      &-btn {
        height: 24px;
        padding: 0;
        border: none;
      }
    }
  }
  .locale-selector {
    position: relative;
    padding: 0;
    height: 24px;

    &__trigger {
      height: 24px;
      width: 500px;
      padding: 0;
    }

    &__icon-open {
      transform: rotate(180deg);
      transition: transform 0.2s ease;
    }

    &__dropdown {
      position: absolute;
      background-color: $gray-200;
      border-radius: $radius-4;
      max-width: 100px;
      z-index: 1000;
      overflow: hidden;
    }

    &__option {
      width: 100%;
      padding: $padding-8;
      text-align: right;
      cursor: pointer;
      font-size: 12px;
      font-weight: 400;
      transition: background-color 0.2s ease;
      font-family: 'IRANYekan';
    }
  }

  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
</style>
