<script setup lang="ts">
const title = 'Романтический квест ко Дню святого Валентина'
const description = 'Минималистичный интерактивный квест с мимикойнами и финальной точкой.'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'ru'
  }
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="relative min-h-screen overflow-x-clip">
    <UiScrollHeartBackground />
    <div class="relative z-10">
      <NuxtPage />
    </div>
  </div>
</template>
