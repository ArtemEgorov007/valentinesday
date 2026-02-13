import type { QuizQuestion } from '~/types/quiz'

const STARTING_BALANCE = 0
const CORRECT_REWARD = 50
const WRONG_PENALTY = -10
const FINAL_THRESHOLD = 400
const ANSWER_LOCK_MS = 1000

export function useGameState() {
  const coins = useState('mimicoins', () => STARTING_BALANCE)
  const currentQuestionIndex = useState('question-index', () => 0)
  const selectedChoiceId = useState<string | null>('selected-choice', () => null)
  const answerResolved = useState('answer-resolved', () => false)
  const isAnswerLocked = useState('answer-locked', () => false)
  const unlocked = useState('quest-unlocked', () => false)
  const answersByQuestion = useState<Record<number, string>>('answers-by-question', () => ({}))
  const scoreByQuestion = useState<Record<number, number>>('score-by-question', () => ({}))

  const canUnlock = computed(() => coins.value >= FINAL_THRESHOLD)

  function scoreDelta(isCorrect: boolean) {
    return isCorrect ? CORRECT_REWARD : WRONG_PENALTY
  }

  function submitAnswer(question: QuizQuestion, choiceId: string) {
    if (isAnswerLocked.value) {
      return null
    }

    const choice = question.choices.find(item => item.id === choiceId)
    if (!choice) {
      return null
    }

    const nextScore = scoreDelta(choice.isCorrect)
    const prevScore = scoreByQuestion.value[question.id] ?? 0
    const delta = nextScore - prevScore

    coins.value += delta
    answersByQuestion.value[question.id] = choiceId
    scoreByQuestion.value[question.id] = nextScore
    selectedChoiceId.value = choiceId
    answerResolved.value = true
    isAnswerLocked.value = true

    setTimeout(() => {
      isAnswerLocked.value = false
    }, ANSWER_LOCK_MS)

    return {
      isCorrect: choice.isCorrect,
      delta,
      total: coins.value
    }
  }

  function nextQuestion(maxQuestions: number) {
    if (currentQuestionIndex.value >= maxQuestions - 1) {
      return
    }

    currentQuestionIndex.value += 1
  }

  function previousQuestion() {
    if (currentQuestionIndex.value <= 0) {
      return
    }

    currentQuestionIndex.value -= 1
  }

  function syncQuestionState(question: QuizQuestion) {
    const selected = answersByQuestion.value[question.id] ?? null
    selectedChoiceId.value = selected
    answerResolved.value = selected !== null
  }

  function tryUnlock() {
    if (!canUnlock.value) {
      return false
    }

    unlocked.value = true
    return true
  }

  function resetGame() {
    coins.value = STARTING_BALANCE
    currentQuestionIndex.value = 0
    selectedChoiceId.value = null
    answerResolved.value = false
    isAnswerLocked.value = false
    unlocked.value = false
    answersByQuestion.value = {}
    scoreByQuestion.value = {}
  }

  return {
    coins,
    canUnlock,
    unlocked,
    currentQuestionIndex,
    selectedChoiceId,
    answerResolved,
    isAnswerLocked,
    constants: {
      STARTING_BALANCE,
      CORRECT_REWARD,
      WRONG_PENALTY,
      FINAL_THRESHOLD,
      ANSWER_LOCK_MS
    },
    submitAnswer,
    nextQuestion,
    previousQuestion,
    syncQuestionState,
    tryUnlock,
    resetGame
  }
}
