<script setup lang="ts">
withDefaults(defineProps<{
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
}>(), {
  disabled: false,
  variant: 'primary',
  type: 'button'
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45"
    :class="variant === 'primary'
      ? 'bg-stone-900 text-white hover:bg-stone-800'
      : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'"
  >
    <slot />
  </button>
</template>
