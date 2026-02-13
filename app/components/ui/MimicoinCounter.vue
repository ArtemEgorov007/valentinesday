<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  delta: number
  label?: string
}>(), {
  label: 'Мимикойны'
})

const floatingDelta = ref<number | null>(null)
const floatingKey = ref(0)
const floatingTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const pulseClass = computed(() => {
  if (props.delta > 0) {
    return 'scale-110 border-emerald-400 bg-emerald-50 shadow-[0_16px_40px_rgba(16,185,129,0.35)]'
  }

  if (props.delta < 0) {
    return 'scale-95 border-rose-400 bg-rose-50 shadow-[0_16px_40px_rgba(244,63,94,0.3)]'
  }

  return ''
})

watch(() => props.delta, (next) => {
  if (!next) {
    return
  }

  if (floatingTimer.value) {
    clearTimeout(floatingTimer.value)
  }

  floatingDelta.value = next
  floatingKey.value += 1
  floatingTimer.value = setTimeout(() => {
    floatingDelta.value = null
  }, 900)
})

onBeforeUnmount(() => {
  if (floatingTimer.value) {
    clearTimeout(floatingTimer.value)
  }
})
</script>

<template>
  <div class="fixed right-3 top-3 z-40 sm:right-6 sm:top-10">
    <Transition name="coin-pop">
      <p
        v-if="floatingDelta !== null"
        :key="floatingKey"
        class="pointer-events-none absolute -top-9 right-1 text-base font-bold"
        :class="floatingDelta > 0 ? 'text-emerald-600' : 'text-rose-600'"
      >
        {{ floatingDelta > 0 ? '+' : '' }}{{ floatingDelta }}
      </p>
    </Transition>

    <div
      class="rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-200 sm:px-4"
      :class="pulseClass"
    >
      <p class="text-sm font-semibold text-stone-800 sm:text-base">
        {{ props.label }}: {{ props.value }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.coin-pop-enter-active,
.coin-pop-leave-active {
  transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.coin-pop-enter-from,
.coin-pop-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.75);
}

.coin-pop-enter-to,
.coin-pop-leave-from {
  opacity: 1;
  transform: translateY(-2px) scale(1.08);
}
</style>
