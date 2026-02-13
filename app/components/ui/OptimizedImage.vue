<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  imageClass?: string
  loading?: 'lazy' | 'eager'
  fallbackSrc?: string
}>(), {
  imageClass: '',
  loading: 'lazy',
  fallbackSrc: ''
})

function buildCandidates(src: string, fallbackSrc: string) {
  if (fallbackSrc) {
    return [src, fallbackSrc]
  }

  return [src]
}

const candidates = computed(() => buildCandidates(props.src, props.fallbackSrc))
const currentIndex = ref(0)
const currentSrc = computed(() => candidates.value[currentIndex.value] ?? props.src)

watch(() => props.src, (next) => {
  if (!next) {
    return
  }

  currentIndex.value = 0
})

function onError() {
  if (currentIndex.value >= candidates.value.length - 1) {
    return
  }

  currentIndex.value += 1
}
</script>

<template>
  <img
    :src="currentSrc"
    :alt="props.alt"
    :class="props.imageClass"
    :loading="props.loading"
    decoding="async"
    @error="onError"
  >
</template>
