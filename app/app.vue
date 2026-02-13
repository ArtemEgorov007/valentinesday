<script setup lang="ts">
const title = 'Романтический квест ко Дню святого Валентина'
const description = 'Минималистичный интерактивный квест с мимикойнами и финальной точкой.'
const appBaseURL = useRuntimeConfig().app.baseURL

function withBase(path: string) {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path

  if (!appBaseURL || appBaseURL === '/') {
    return `/${normalizedPath}`
  }

  return `${appBaseURL}${normalizedPath}`
}

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'apple-touch-icon', sizes: '180x180', href: withBase('/favicon/apple-touch-icon.png') },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: withBase('/favicon/favicon-32x32.png') },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: withBase('/favicon/favicon-16x16.png') },
    { rel: 'shortcut icon', href: withBase('/favicon/favicon.ico') },
    { rel: 'manifest', href: withBase('/favicon/site.webmanifest') }
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
