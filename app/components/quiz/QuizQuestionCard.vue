<script setup lang="ts">
import type { QuizQuestion } from '~/types/quiz'

const props = defineProps<{
  question: QuizQuestion
  selectedChoiceId: string | null
  answerResolved: boolean
  isAnswerLocked: boolean
}>()

const emit = defineEmits<{
  choose: [choiceId: string]
}>()

const cardThemes = [
  {
    card: 'border-rose-200',
    choiceIdle: 'border-rose-200 bg-white hover:border-rose-300'
  },
  {
    card: 'border-sky-200',
    choiceIdle: 'border-sky-200 bg-white hover:border-sky-300'
  },
  {
    card: 'border-violet-200',
    choiceIdle: 'border-violet-200 bg-white hover:border-violet-300'
  },
  {
    card: 'border-emerald-200',
    choiceIdle: 'border-emerald-200 bg-white hover:border-emerald-300'
  },
  {
    card: 'border-amber-200',
    choiceIdle: 'border-amber-200 bg-white hover:border-amber-300'
  },
  {
    card: 'border-cyan-200',
    choiceIdle: 'border-cyan-200 bg-white hover:border-cyan-300'
  },
  {
    card: 'border-fuchsia-200',
    choiceIdle: 'border-fuchsia-200 bg-white hover:border-fuchsia-300'
  },
  {
    card: 'border-teal-200',
    choiceIdle: 'border-teal-200 bg-white hover:border-teal-300'
  }
] as const

const activeTheme = computed(() => cardThemes[(props.question.id - 1) % cardThemes.length]!)

function choiceClass(choiceId: string, isCorrect: boolean) {
  const isSelected = props.selectedChoiceId === choiceId

  if (!props.answerResolved) {
    return activeTheme.value.choiceIdle
  }

  if (isSelected && isCorrect) {
    return 'border-emerald-300 bg-emerald-50'
  }

  if (isSelected && !isCorrect) {
    return 'border-rose-300 bg-rose-50'
  }

  if (isCorrect) {
    return 'border-emerald-200 bg-emerald-50/70'
  }

  return 'border-stone-200 bg-white/70 opacity-75'
}

function onChoose(choiceId: string) {
  if (props.isAnswerLocked) {
    return
  }

  emit('choose', choiceId)
}
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border bg-white shadow-[0_14px_35px_rgba(0,0,0,0.06)]"
    :class="activeTheme.card"
  >
    <div class="p-4 sm:p-6">
      <h2 class="mb-4 text-lg font-semibold leading-snug text-stone-800 sm:text-xl">
        {{ props.question.prompt }}
      </h2>

      <div class="space-y-2.5">
        <button
          v-for="choice in props.question.choices"
          :key="choice.id"
          type="button"
          :disabled="props.isAnswerLocked"
          class="w-full rounded-xl cursor-pointer border px-3.5 py-3 text-left text-sm text-stone-700 disabled:cursor-not-allowed sm:text-base"
          :class="choiceClass(choice.id, choice.isCorrect)"
          @click="onChoose(choice.id)"
        >
          {{ choice.label }}
        </button>
      </div>
    </div>
  </article>
</template>
