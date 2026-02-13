<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  imageClass?: string
  kind?: 'image' | 'video'
  loading?: 'lazy' | 'eager'
  fallbackSrc?: string
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
  playsinline?: boolean
  preload?: 'none' | 'metadata' | 'auto'
}>(), {
  imageClass: '',
  kind: 'image',
  loading: 'lazy',
  fallbackSrc: '',
  autoplay: false,
  controls: false,
  muted: false,
  loop: false,
  playsinline: true,
  preload: 'metadata'
})

const appBaseURL = useRuntimeConfig().app.baseURL

function isExternalSource(src: string) {
  return /^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith('data:') || src.startsWith('blob:')
}

function joinBaseAndPath(baseURL: string, path: string) {
  if (!path) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path

  if (!baseURL || baseURL === '/') {
    return `/${normalizedPath}`
  }

  const normalizedBase = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  return `${normalizedBase}${normalizedPath}`
}

function resolveAssetSrc(src: string) {
  if (!src || isExternalSource(src)) {
    return src
  }

  return joinBaseAndPath(appBaseURL, src)
}

function buildCandidates(src: string, fallbackSrc: string) {
  const resolvedSrc = resolveAssetSrc(src)
  const resolvedFallbackSrc = resolveAssetSrc(fallbackSrc)

  if (fallbackSrc) {
    return [resolvedSrc, resolvedFallbackSrc]
  }

  return [resolvedSrc]
}

const candidates = computed(() => buildCandidates(props.src, props.fallbackSrc))
const currentIndex = ref(0)
const currentSrc = computed(() => candidates.value[currentIndex.value] ?? props.src)
const resolvedVideoSrc = computed(() => resolveAssetSrc(props.src))

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
    v-if="props.kind === 'image'"
    :src="currentSrc"
    :alt="props.alt"
    :class="props.imageClass"
    :loading="props.loading"
    decoding="async"
    @error="onError"
  >
  <video
    v-else
    :src="resolvedVideoSrc"
    :class="props.imageClass"
    :autoplay="props.autoplay"
    :controls="props.controls"
    :muted="props.muted"
    :loop="props.loop"
    :playsinline="props.playsinline"
    :preload="props.preload"
  />
</template>
