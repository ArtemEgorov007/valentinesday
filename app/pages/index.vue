<script setup lang="ts">
import { homeMemoryCards as memoryCards } from '~/data/memories'

const featuredMemoryCards = computed(() => memoryCards.slice(0, 3))
const warmHeaderWords = ['тепло рядом', 'тихий свет', 'наше место']
const warmCardNotes = [
  'Ты рядом и день становится ярче',
  'С тобой даже паузы звучат уютно',
  'Пусть это воспоминание согревает'
]
</script>

<template>
  <main class="relative min-h-screen px-3 pb-14 pt-12 sm:px-6 sm:pt-16">
    <section class="mx-auto w-full max-w-4xl space-y-4 sm:space-y-6">
      <header class="relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_10px_28px_rgba(0,0,0,0.05)] sm:p-8">
        <p class="text-sm text-stone-500">
          Наша история
        </p>
        <h1 class="mt-2 text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
          Тёплые воспоминания о нас
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
          Небольшая страница о наших моментах. Когда будешь готова, можно открыть романтический квест.
        </p>

        <div class="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
          <span
            v-for="word in warmHeaderWords"
            :key="word"
            class="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-500"
          >
            {{ word }}
          </span>
        </div>

        <div class="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center">
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
          v-for="(item, index) in featuredMemoryCards"
          :key="item.title"
          class="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.10)]"
        >
          <UiOptimizedImage
            :src="item.image"
            :alt="item.title"
            image-class="h-40 w-full object-cover object-center sm:h-72"
          />
          <div class="flex-1 p-3 sm:p-5">
            <p class="text-xs text-stone-500">
              Воспоминание
            </p>
            <h2 class="mt-1.5 text-lg font-semibold text-stone-900">
              {{ item.title }}
            </h2>
            <p class="mt-2.5 text-sm leading-relaxed text-stone-600">
              {{ item.text }}
            </p>
            <p class="mt-3 text-xs text-rose-400">
              {{ warmCardNotes[index] }}
            </p>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>
