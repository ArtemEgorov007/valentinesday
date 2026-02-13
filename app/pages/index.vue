<script setup lang="ts">
import { homeMemoryCards as memoryCards } from '~/data/memories'

const featuredMemoryCards = computed(() => memoryCards.slice(0, 3))
</script>

<template>
  <main class="relative min-h-screen px-3 pb-14 pt-12 sm:px-6 sm:pt-16">
    <section class="mx-auto w-full max-w-4xl space-y-4 sm:space-y-6">
      <header class="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_10px_28px_rgba(0,0,0,0.05)] sm:p-7">
        <p class="text-sm text-stone-500">
          Наша история
        </p>
        <h1 class="mt-2 text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
          Тёплые воспоминания о нас
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
          Небольшая страница о наших моментах. Когда будешь готова, можно открыть романтический квест.
        </p>

        <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <NuxtLink
            to="/quest"
            class="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Открыть квест
          </NuxtLink>
        </div>
      </header>

      <section class="grid gap-4 sm:grid-cols-3">
        <article
          v-for="item in featuredMemoryCards"
          :key="item.title"
          class="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
        >
          <UiOptimizedImage
            :src="item.image"
            :alt="item.title"
            image-class="h-64 w-full object-cover object-center sm:h-72"
          />
          <div class="p-4">
            <p class="text-xs text-stone-500">
              Воспоминание
            </p>
            <h2 class="mt-1 text-lg font-semibold text-stone-900">
              {{ item.title }}
            </h2>
            <p class="mt-2 text-sm text-stone-600">
              {{ item.text }}
            </p>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>
