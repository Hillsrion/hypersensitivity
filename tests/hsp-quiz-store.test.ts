import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import quizData from '../app/data/hsp-quiz.json'
import { useHspQuizStore } from '../app/stores/hspQuiz'

describe('hspQuizStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initial state is correct', () => {
    const store = useHspQuizStore()

    expect(store.currentView).toBe('intro')
    expect(store.currentQuestionIndex).toBe(0)
    expect(store.answers.length).toBe(quizData.questions.length)
    expect(store.answers.every((a) => a === null)).toBe(true)
  })

  it('startQuiz changes view to quiz', () => {
    const store = useHspQuizStore()

    store.startQuiz()
    expect(store.currentView).toBe('quiz')
  })

  it('selectAnswer updates answers array', () => {
    const store = useHspQuizStore()

    // Select answer '2' for the first question
    store.selectAnswer(2)
    expect(store.answers[0]).toBe(2)
    expect(store.answers[1]).toBe(null)
  })

  it('nextQuestion and previousQuestion navigation', () => {
    const store = useHspQuizStore()

    // Check next behavior
    store.nextQuestion()
    expect(store.currentQuestionIndex).toBe(1)

    // Check previous behavior
    store.previousQuestion()
    expect(store.currentQuestionIndex).toBe(0)

    // Should not go below 0
    store.previousQuestion()
    expect(store.currentQuestionIndex).toBe(0)
  })

  it('nextQuestion on last question changes view to results', () => {
    const store = useHspQuizStore()

    store.currentQuestionIndex = store.totalQuestions - 1
    store.nextQuestion()

    expect(store.currentView).toBe('results')
    expect(store.currentQuestionIndex).toBe(store.totalQuestions - 1)
  })

  it('restart resets state to default', () => {
    const store = useHspQuizStore()

    // Setup modified state
    store.currentView = 'results'
    store.currentQuestionIndex = 5
    store.answers[0] = 3

    store.restart()

    expect(store.currentView).toBe('intro')
    expect(store.currentQuestionIndex).toBe(0)
    expect(store.answers.every((a) => a === null)).toBe(true)
  })

  it('completeWithFakeResults generates fake answers and goes to results', () => {
    const store = useHspQuizStore()

    store.completeWithFakeResults()

    expect(store.currentView).toBe('results')
    expect(store.answers.every((a) => a !== null && a >= 0 && a <= 4)).toBe(
      true
    ) // Assuming 0-4 rating mapping logic
  })

  it('computed scores and profiles', () => {
    const store = useHspQuizStore()

    // Simulate all answers as 1
    const val = 1
    store.answers = Array(store.totalQuestions).fill(val)

    const expectedScore1 = store.questions.reduce(
      (sum, q) => sum + (q.inversed ? 4 - val : val),
      0
    )
    expect(store.totalScore).toBe(expectedScore1)
    expect(store.sensitivityLevel.label).toBe('Sensibilité standard')

    // Simulate all sections score logic
    const sectionIndexToTest = 0
    const start = sectionIndexToTest * store.questionsPerSection
    const end = start + store.questionsPerSection
    const expectedSectionScore1 = store.questions
      .slice(start, end)
      .reduce((sum, q) => sum + (q.inversed ? 4 - val : val), 0)
    const testScore = store.getSectionScore(sectionIndexToTest)
    expect(testScore).toBe(expectedSectionScore1)

    // Check section sum maps correctly to array computation
    expect(store.sectionScores[sectionIndexToTest]).toBe(expectedSectionScore1)

    // Simulate all answers as max (e.g., 4)
    const valMax = 4
    store.answers = Array(store.totalQuestions).fill(valMax)
    const expectedScoreMax = store.questions.reduce(
      (sum, q) => sum + (q.inversed ? 4 - valMax : valMax),
      0
    )
    expect(store.totalScore).toBe(expectedScoreMax)
    expect(store.dominantProfile).not.toBeNull()
  })
})
