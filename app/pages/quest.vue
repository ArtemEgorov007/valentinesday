<script setup lang="ts">
import type { QuizQuestion } from '~/types/quiz'
import { quizQuestions } from '~/data/questions'

if (!quizQuestions.length) {
  throw new Error('quizQuestions must not be empty')
}

const {
  coins,
  canUnlock,
  unlocked,
  currentQuestionIndex,
  selectedChoiceId,
  answerResolved,
  isAnswerLocked,
  constants,
  submitAnswer,
  nextQuestion,
  previousQuestion,
  syncQuestionState,
  tryUnlock,
  resetGame
} = useGameState()

const destinationAddress = 'https://yandex.ru/maps/-/CPQsEW7f'

const {
  showReminderModal,
  isAppleDevice,
  reminderDateLabel,
  detectMobile,
  triggerOnUnlock,
  closeReminder,
  openGoogleCalendar,
  openAppleCalendar,
  downloadIcsReminder
} = useMeetingReminder(destinationAddress)

const lastDelta = ref(0)
const deltaResetTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const refusalModalVisible = ref(false)
const runawayYesStyle = ref({ transform: 'translate(0px, 0px)' })

const currentQuestion = computed<QuizQuestion>(() => quizQuestions[currentQuestionIndex.value] ?? quizQuestions[0]!)
const isLastQuestion = computed(() => currentQuestionIndex.value === quizQuestions.length - 1)
const hasEnoughCoins = computed(() => coins.value >= constants.FINAL_THRESHOLD)
const isQuizComplete = computed(() => answerResolved.value && isLastQuestion.value)
const needsMoreCoins = computed(() => isQuizComplete.value && !hasEnoughCoins.value)
const canGoBack = computed(() => currentQuestionIndex.value > 0)
const questionTransitionName = ref<'question-next' | 'question-prev'>('question-next')

const statusText = computed(() => {
  if (needsMoreCoins.value) {
    return `Пока не хватает ${constants.FINAL_THRESHOLD - coins.value} мимикойнов. Вернись к вопросам и выбери ответы сердцем.`
  }

  if (isQuizComplete.value) {
    return 'Ты справилась. Нажми, чтобы открыть финальный сюрприз.'
  }

  return 'Выбери ответ и двигайся дальше к нашей точке.'
})

watch(currentQuestion, (question) => {
  syncQuestionState(question)
}, { immediate: true })

watch(unlocked, (isUnlocked) => {
  if (isUnlocked) {
    triggerOnUnlock()
  }
})

watch(currentQuestionIndex, (next, prev) => {
  questionTransitionName.value = next >= prev ? 'question-next' : 'question-prev'
  refusalModalVisible.value = false
  runawayYesStyle.value = { transform: 'translate(0px, 0px)' }
})

function onChoose(choiceId: string) {
  if (!currentQuestion.value) {
    return
  }

  const selectedChoice = currentQuestion.value.choices.find(item => item.id === choiceId)
  if (!selectedChoice) {
    return
  }

  const isFinalQuestion = currentQuestion.value.id === quizQuestions.length
  if (isFinalQuestion && !selectedChoice.isCorrect) {
    refusalModalVisible.value = true
    moveRunawayYesButton()
    return
  }

  const result = submitAnswer(currentQuestion.value, choiceId)
  if (!result) {
    return
  }

  lastDelta.value = result.delta

  if (deltaResetTimer.value) {
    clearTimeout(deltaResetTimer.value)
  }

  deltaResetTimer.value = setTimeout(() => {
    lastDelta.value = 0
  }, 320)
}

function onNext() {
  if (!answerResolved.value) {
    return
  }

  if (isLastQuestion.value) {
    if (!tryUnlock()) {
      return
    }

    return
  }

  nextQuestion(quizQuestions.length)
}

function onBack() {
  previousQuestion()
}

function restartGame() {
  resetGame()
  lastDelta.value = 0
  refusalModalVisible.value = false
  runawayYesStyle.value = { transform: 'translate(0px, 0px)' }
  closeReminder()
}

function moveRunawayYesButton() {
  const x = Math.floor(Math.random() * 140) - 70
  const y = Math.floor(Math.random() * 34) - 17
  runawayYesStyle.value = {
    transform: `translate(${x}px, ${y}px)`
  }
}

function openMaps() {
  if (!import.meta.client) {
    return
  }

  window.open(destinationAddress, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  detectMobile()
})

onBeforeUnmount(() => {
  if (deltaResetTimer.value) {
    clearTimeout(deltaResetTimer.value)
  }
})
</script>

<template>
  <main class="relative min-h-screen px-3 pb-16 pt-16 sm:px-6 sm:pt-20">
    <NuxtLink
      to="/"
      class="fixed left-3 top-3 z-40 inline-flex items-center rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:bg-stone-50 sm:left-6 sm:top-10"
    >
      На главную
    </NuxtLink>
    <UiMimicoinCounter
      :value="coins"
      :delta="lastDelta"
    />

    <QuizMeetingReminderModal
      :visible="showReminderModal"
      :is-apple-device="isAppleDevice"
      :reminder-date-label="reminderDateLabel"
      @close="closeReminder"
      @apple="openAppleCalendar"
      @google="openGoogleCalendar"
      @ics="downloadIcsReminder"
    />
    <Transition name="fade-up">
      <div
        v-if="refusalModalVisible"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/25 p-4"
      >
        <div class="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_20px_46px_rgba(0,0,0,0.22)] sm:p-5">
          <p class="text-sm text-stone-500">
            Подтверждение
          </p>
          <h3 class="mt-1 text-lg font-semibold text-stone-900 sm:text-xl">
            Точно не хочешь?
          </h3>
          <p class="mt-2 text-sm text-stone-600">
            Может все-таки откроем наш вечер вместе?
          </p>

          <div class="relative mt-4 h-11">
            <button
              type="button"
              class="absolute left-0 top-0 cursor-pointer rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700"
              :style="runawayYesStyle"
              @mouseenter="moveRunawayYesButton"
              @mousemove="moveRunawayYesButton"
              @pointerdown.prevent="moveRunawayYesButton"
              @click.prevent="moveRunawayYesButton"
            >
              Да
            </button>

            <button
              type="button"
              class="absolute right-0 top-0 cursor-pointer rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
              @click="refusalModalVisible = false"
            >
              Нет
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <section class="mx-auto w-full max-w-2xl">
      <article
        v-if="!unlocked"
        class="space-y-4"
      >
        <header class="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_10px_28px_rgba(0,0,0,0.05)] sm:p-6">
          <p class="text-sm text-stone-500">
            Для тебя
          </p>
          <h1 class="mt-2 text-2xl font-semibold leading-tight text-stone-900 sm:text-3xl">
            Небольшой тёплый квест о нас
          </h1>
          <p class="mt-2 text-sm text-stone-600 sm:text-base">
            +{{ constants.CORRECT_REWARD }} за правильный ответ, {{ constants.WRONG_PENALTY }} за ошибку. В финале тебя ждёт место, которое я хочу разделить с тобой.
          </p>
        </header>

        <QuizMemoryGalleryStrip :coins="coins" />

        <Transition
          :name="questionTransitionName"
          mode="out-in"
        >
          <div
            :key="currentQuestion.id"
            class="space-y-4"
          >
            <div class="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_10px_28px_rgba(0,0,0,0.05)] sm:p-5">
              <QuizQuestionProgress
                :current="currentQuestionIndex"
                :total="quizQuestions.length"
              />
            </div>

            <QuizQuestionCard
              :question="currentQuestion"
              :selected-choice-id="selectedChoiceId"
              :answer-resolved="answerResolved"
              :is-answer-locked="isAnswerLocked"
              @choose="onChoose"
            />

            <UiLockBadge
              :is-visible="isQuizComplete"
              :is-open="hasEnoughCoins"
            />

            <div class="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_10px_28px_rgba(0,0,0,0.05)] sm:p-5">
              <p
                class="text-sm text-stone-600"
                :class="needsMoreCoins ? 'text-amber-700' : ''"
              >
                {{ statusText }}
              </p>

              <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <UiRomanticButton
                  v-if="canGoBack"
                  class="w-full sm:w-auto cursor-pointer"
                  variant="secondary"
                  @click="onBack"
                >
                  Назад
                </UiRomanticButton>

                <UiRomanticButton
                  class="w-full sm:w-auto cursor-pointer"
                  :disabled="!answerResolved || isAnswerLocked || (isLastQuestion && !canUnlock)"
                  @click="onNext"
                >
                  {{ isLastQuestion ? 'Открыть финал' : 'Дальше' }}
                </UiRomanticButton>
              </div>
            </div>
          </div>
        </Transition>
      </article>

      <article
        v-else
        class="rounded-2xl border border-stone-200 bg-white p-5 text-stone-800 shadow-[0_12px_32px_rgba(0,0,0,0.06)] sm:p-7"
      >
        <h2 class="text-2xl font-semibold sm:text-3xl">
          Наша точка открыта
        </h2>
        <p class="mt-2 text-stone-600">
          Спасибо, что прошла этот маленький путь. Теперь откроем место нашей встречи.
        </p>

        <div class="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p class="text-sm text-stone-500">
            Ссылка
          </p>
          <p class="mt-2 break-all text-sm text-stone-700 sm:text-base">
            {{ destinationAddress }}
          </p>
        </div>

        <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <UiRomanticButton
            class="w-full sm:w-auto"
            @click="openMaps"
          >
            Открыть место в картах
          </UiRomanticButton>
          <UiRomanticButton
            class="w-full sm:w-auto"
            variant="secondary"
            @click="restartGame"
          >
            Пройти ещё раз
          </UiRomanticButton>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.question-next-enter-active,
.question-next-leave-active,
.question-prev-enter-active,
.question-prev-leave-active {
  transition: opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.question-next-enter-from,
.question-prev-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.question-next-leave-to,
.question-prev-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
