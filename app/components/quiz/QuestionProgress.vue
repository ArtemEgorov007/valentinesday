<script setup lang="ts">
const props = withDefaults(defineProps<{
  current: number
  total: number
  label?: string
}>(), {
  label: 'Вопрос'
})

const progressScale = computed(() => (props.current + 1) / props.total)
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between text-sm text-stone-500">
      <span>{{ props.label }} {{ props.current + 1 }}</span>
      <span>{{ props.total }}</span>
    </div>
    <div class="h-1.5 overflow-hidden rounded-full bg-stone-200">
      <div
        class="h-full origin-left rounded-full bg-stone-700"
        :style="{ transform: `scaleX(${progressScale})` }"
      />
    </div>
  </div>
</template>
