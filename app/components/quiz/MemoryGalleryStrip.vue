<script setup lang="ts">
import { homeMemoryCards } from '~/data/memories'
import { quizQuestions } from '~/data/questions'

type GalleryItem = {
  type: 'image' | 'video'
  src: string
  title: string
  text: string
}

const openedIndex = ref<number | null>(null)

const extraMemoryImages = [
  '/moments/memory-1.jpeg',
  '/moments/memory-2.jpeg',
  '/moments/memory-3.jpeg',
  '/moments/memory-5.jpeg'
]

const staticVideoSources: string[] = [
  '/moments/memory-4.webm',
  '/moments/memory-6.webm'
]

function isSupportedGalleryImage(src: string) {
  return /\.(jpe?g|png|webp|avif)$/i.test(src)
}

const quizMomentTitles = [
  'Тихий свет внутри',
  'Места и встречи',
  'Уютный вдох рядом',
  'Мягкий взгляд о нас',
  'Тепло в деталях',
  'Наш маленький ритм',
  'Сердце в моменте',
  'Еще один общий кадр'
]

const quizMomentTexts = [
  'Этот кадр как напоминание, что с тобой мир звучит мягче.',
  'В таких моментах я особенно ясно чувствую, как нам спокойно вдвоем.',
  'Когда мы смеемся вместе, даже обычный день становится праздником.',
  'Пусть эта картинка хранит ту нежность, которую мы создаем каждый день.',
  'Иногда одна деталь говорит о любви больше, чем длинные слова.',
  'Здесь живет наше тихое счастье, простое и очень настоящее.',
  'Пускай этот момент согревает, когда захочется чуть больше света.',
  'Еще один теплый штрих к нашей истории, которую так приятно проживать.'
]

const extraMomentTitles = [
  'Ласковый вечер',
  'Искра улыбки',
  'Нежный след дня',
  'Теплый финальный аккорд'
]

const extraMomentTexts = [
  'Вечер, который хочется аккуратно сложить в сердце и носить с собой.',
  'Твоя улыбка здесь будто снова рядом, близко-близко.',
  'Пусть этот кадр бережно держит настроение нашего дня.',
  'Такой момент хочется продлить еще на чуть-чуть, просто быть вместе.'
]

const videoMomentTexts = [
  'В движении этих секунд чувствуется твое большое сердце',
  'Это маленькое видео как дыхание нашего теплого вечера.',
  'Здесь есть та легкость, с которой мы смотрим друг на друга.',
  'Пусть этот ролик возвращает в состояние «нам хорошо рядом».'
]

function pickText(source: string[], index: number, fallback: string) {
  return source[index] ?? `${fallback} ${index + 1}`
}

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

const galleryItems = computed<GalleryItem[]>(() => {
  const items: GalleryItem[] = []
  const seen = new Set<string>()

  homeMemoryCards.forEach((card) => {
    if (!isSupportedGalleryImage(card.image)) {
      return
    }

    if (seen.has(card.image)) {
      return
    }

    seen.add(card.image)
    items.push({
      type: 'image',
      src: card.image,
      title: card.title,
      text: card.text
    })
  })

  quizQuestions.forEach((question, index) => {
    if (!isSupportedGalleryImage(question.image)) {
      return
    }

    if (seen.has(question.image)) {
      return
    }

    seen.add(question.image)
    items.push({
      type: 'image',
      src: question.image,
      title: pickText(quizMomentTitles, index, 'Момент'),
      text: pickText(quizMomentTexts, index, 'Этот момент продолжает нашу теплую историю')
    })
  })

  extraMemoryImages.forEach((src, index) => {
    if (!isSupportedGalleryImage(src)) {
      return
    }

    if (seen.has(src)) {
      return
    }

    seen.add(src)
    items.push({
      type: 'image',
      src,
      title: pickText(extraMomentTitles, index, 'Теплый кадр'),
      text: pickText(extraMomentTexts, index, 'Пусть этот кадр бережно хранит наше тепло')
    })
  })

  staticVideoSources.forEach((src, index) => {
    items.push({
      type: 'video',
      src,
      title: `Видео-момент`,
      text: pickText(videoMomentTexts, index, 'Здесь живет наше настроение')
    })
  })

  return items
    .map(item => ({ item, order: hashString(item.src) }))
    .sort((a, b) => a.order - b.order)
    .map(entry => entry.item)
})

const openedCard = computed<GalleryItem | null>(() => {
  if (openedIndex.value === null) {
    return null
  }

  return galleryItems.value[openedIndex.value] ?? null
})

function openCard(index: number) {
  openedIndex.value = index
}

function closeCard() {
  openedIndex.value = null
}

function itemSizeClass(index: number) {
  const pattern = [
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1'
  ]

  const item = galleryItems.value[index]
  if (!item) {
    return 'col-span-1 row-span-1'
  }

  const randomIndex = hashString(item.src) % pattern.length
  return pattern[randomIndex] ?? 'col-span-1 row-span-1'
}

const tileSizeClasses = computed(() => {
  const tailSafeCount = Math.min(6, galleryItems.value.length)
  const tailStart = galleryItems.value.length - tailSafeCount

  return galleryItems.value.map((_, index) => {
    // Last tiles are always 1x1 to fill remaining holes at the end of the grid.
    if (index >= tailStart) {
      return 'col-span-1 row-span-1'
    }

    return itemSizeClass(index)
  })
})
</script>

<template>
  <section class="rounded-2xl border border-stone-200 bg-white p-3 shadow-[0_10px_28px_rgba(0,0,0,0.05)] sm:p-4">
    <p class="text-xs font-medium uppercase tracking-[0.08em] text-stone-500">
      Наши моменты
    </p>

    <div class="mt-2 max-h-[18.5rem] overflow-y-auto rounded-xl border border-stone-200 sm:max-h-[21rem]">
      <div class="grid grid-flow-dense grid-cols-3 [grid-auto-rows:72px] gap-0 sm:[grid-auto-rows:84px]">
        <button
          v-for="(item, index) in galleryItems"
          :key="`${item.type}-${item.src}`"
          type="button"
          class="group relative cursor-pointer overflow-hidden border border-stone-100 bg-stone-100 transition duration-300 hover:z-10 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.20)]"
          :class="tileSizeClasses[index] ?? 'col-span-1 row-span-1'"
          @click="openCard(index)"
        >
          <template v-if="item.type === 'image'">
            <UiOptimizedImage
              :src="item.src"
              :alt="item.title"
              image-class="h-full w-full object-cover object-center"
            />
          </template>
          <template v-else>
            <UiOptimizedImage
              kind="video"
              :src="item.src"
              :alt="item.title"
              :muted="true"
              :playsinline="true"
              preload="metadata"
              image-class="h-full w-full object-cover object-center"
            />
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
              <span
                class="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-stone-700"
              >
                Video
              </span>
            </div>
          </template>
        </button>
      </div>
    </div>

    <p class="mt-2 text-xs text-stone-500">
      Выбери карточку, чтобы посмотреть подпись
    </p>
  </section>

  <Transition name="gallery-pop">
    <div
      v-if="openedCard"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      @click.self="closeCard"
    >
      <article
        class="w-full max-w-xs rounded-2xl border border-stone-200 bg-white p-3 shadow-[0_16px_40px_rgba(0,0,0,0.2)] sm:p-4"
      >
        <template v-if="openedCard.type === 'image'">
          <UiOptimizedImage
            :src="openedCard.src"
            :alt="openedCard.title"
            loading="eager"
            image-class="h-64 w-full rounded-xl object-cover object-center sm:h-72"
          />
        </template>
        <template v-else>
          <UiOptimizedImage
            kind="video"
            :src="openedCard.src"
            :alt="openedCard.title"
            :controls="true"
            :autoplay="true"
            :muted="true"
            :playsinline="true"
            preload="metadata"
            image-class="h-64 w-full rounded-xl bg-black object-cover object-center sm:h-72"
          />
        </template>

        <h3 class="mt-3 text-lg font-semibold text-stone-900">
          {{ openedCard.title }}
        </h3>
        <p class="mt-1 text-sm text-stone-600">
          {{ openedCard.text }}
        </p>

        <button
          type="button"
          class="mt-3 inline-flex cursor-pointer rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
          @click="closeCard"
        >
          Закрыть
        </button>
      </article>
    </div>
  </Transition>
</template>

<style scoped>
.gallery-pop-enter-active,
.gallery-pop-leave-active {
  transition: opacity 0.26s ease, transform 0.26s ease;
}

.gallery-pop-enter-from,
.gallery-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
