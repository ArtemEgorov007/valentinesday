export type QuizQuestion = {
  id: number
  prompt: string
  image: string
  choices: Array<{
    id: string
    label: string
    isCorrect: boolean
  }>
}
