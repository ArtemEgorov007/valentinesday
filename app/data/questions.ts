import type { QuizQuestion } from '~/types/quiz'

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    image: '/placeholders/quiz-1.jpeg',
    prompt: 'Какой из наших моментов для меня навсегда стал точкой, где всё стало «по-настоящему»?',
    choices: [
      { id: 'a', label: 'Тот смех в Москве в отеле, после которого внутри стало спокойно', isCorrect: true },
      { id: 'b', label: 'Случайный рекламный баннер', isCorrect: false },
      { id: 'c', label: 'Очередь в магазине', isCorrect: false }
    ]
  },
  {
    id: 2,
    image: '/placeholders/quiz-2.jpeg',
    prompt: 'Самый тёплый момент, который я вызываю в твоей памяти — это…',
    choices: [
      { id: 'a', label: 'Как мы лежим под солнцем и пьем молочный коктейль', isCorrect: true },
      { id: 'b', label: 'Наш спор о том, чья очередь мыть посуду', isCorrect: false },
      { id: 'c', label: 'Когда я громко ем чипсы в 2 ночи', isCorrect: false }
    ]
  },
  {
    id: 3,
    image: '/placeholders/quiz-3.jpeg',
    prompt: 'Что для меня означает твоя поддержка в сложный день?',
    choices: [
      { id: 'a', label: 'Чувство, что я не одна, что мы команда', isCorrect: true },
      { id: 'b', label: 'Просто вежливость', isCorrect: false },
      { id: 'c', label: 'Случайное совпадение', isCorrect: false }
    ]
  },
  {
    id: 4,
    image: '/placeholders/quiz-4.svg',
    prompt: 'Если описать наш мир на двоих одним ощущением, каким он будет?',
    choices: [
      { id: 'a', label: 'Случайным и непредсказуемым', isCorrect: false },
      { id: 'b', label: 'Тёплым, безопасным и живым', isCorrect: true },
      { id: 'c', label: 'Сдержанным и формальным', isCorrect: false }
    ]
  },
  {
    id: 5,
    image: '/placeholders/quiz-5.svg',
    prompt: 'Что я чувствую, когда слышу твой искренний смех?',
    choices: [
      { id: 'a', label: 'Будто внутри загорается свет, и всё становится легче', isCorrect: true },
      { id: 'b', label: 'Что пора сменить тему', isCorrect: false },
      { id: 'c', label: 'Что это просто звук', isCorrect: false }
    ]
  },
  {
    id: 6,
    image: '/placeholders/quiz-6.svg',
    prompt: 'Какая мелочь от тебя для меня значит намного больше, чем кажется?',
    choices: [
      { id: 'a', label: 'Скидка в приложении магазина', isCorrect: false },
      { id: 'b', label: 'Твоё короткое «все хорошо?» в нужный момент', isCorrect: true },
      { id: 'c', label: 'Уведомление о погоде', isCorrect: false }
    ]
  },
  {
    id: 7,
    image: '/placeholders/quiz-7.svg',
    prompt: 'Когда я особенно остро понимаю, как сильно люблю тебя?',
    choices: [
      { id: 'a', label: 'Когда выигрываю спор', isCorrect: false },
      { id: 'b', label: 'Когда нахожу мелочь в кармане', isCorrect: false },
      { id: 'c', label: 'Когда вижу твою заботу в деталях, которые замечаем только мы', isCorrect: true }
    ]
  },
  {
    id: 8,
    image: '/placeholders/quiz-8.svg',
    prompt: 'Готова открыть место, где продолжится наша история и появится ещё один тёплый вечер на двоих?',
    choices: [
      { id: 'a', label: 'Когда-нибудь потом', isCorrect: false },
      { id: 'b', label: 'Да. С тобой — в каждый следующий момент.', isCorrect: true },
      { id: 'c', label: 'Только после трёх напоминаний', isCorrect: false }
    ]
  }
]
