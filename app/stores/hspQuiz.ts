import { defineStore } from 'pinia'

import quizData from '../data/hsp-quiz.json' with { type: 'json' }

type Profile = {
  name: string
  description: string
  advice: string
  sections: number[]
}

type SensitivityLevel = {
  label: string
  description: string
}

type QuizSection = {
  name: string
  shortName: string
}

type QuizQuestion = {
  text: string
  inversed: boolean
}

export type HspQuizState = {
  currentView: 'intro' | 'quiz' | 'results' | 'skipped'
  currentQuestionIndex: number
  answers: (number | null)[]
}

const { ratings, sections, questions, profiles } = quizData
const totalQuestions = questions.length
const questionsPerSection = Math.floor(totalQuestions / sections.length)
const MAX_RATING = 4

export const useHspQuizStore = defineStore('hspQuiz', {
  state: (): HspQuizState => ({
    currentView: 'intro',
    currentQuestionIndex: 0,
    answers: Array(totalQuestions).fill(null),
  }),

  getters: {
    // Data Exposed
    ratings: () => ratings,
    sections: () => sections as QuizSection[],
    questions: () => questions as QuizQuestion[],
    profiles: () => profiles as Profile[],
    totalQuestions: () => totalQuestions,
    questionsPerSection: () => questionsPerSection,

    // Computed
    currentQuestion(state): QuizQuestion {
      const question =
        this.questions[state.currentQuestionIndex] || this.questions[0]
      if (!question) throw new Error('No questions available')
      return question
    },

    currentSectionIndex(state): number {
      return Math.floor(state.currentQuestionIndex / this.questionsPerSection)
    },

    isLastQuestion(state): boolean {
      return state.currentQuestionIndex === this.totalQuestions - 1
    },

    progressPercent(state): number {
      return Math.round(
        ((state.currentQuestionIndex + 1) / this.totalQuestions) * 100
      )
    },

    displaySectionName(): string {
      return (
        this.sections[this.currentSectionIndex]?.name ||
        this.sections[0]?.name ||
        ''
      )
    },

    getAnswerScore(_state) {
      return (value: number | null, questionIndex: number): number => {
        if (value === null) return 0
        const question = this.questions[questionIndex]
        if (question?.inversed) {
          return MAX_RATING - value
        }
        return value
      }
    },

    totalScore(state): number {
      return state.answers.reduce(
        (sum: number, val: number | null, index: number) =>
          sum + this.getAnswerScore(val, index),
        0
      )
    },

    maxScore(): number {
      return this.totalQuestions * MAX_RATING
    },

    scoreRatio(): number {
      if (this.maxScore === 0) return 0
      return this.totalScore / this.maxScore
    },

    sensitivityLevel(): SensitivityLevel {
      const ratio = this.scoreRatio
      if (ratio < 0.35) {
        return {
          label: 'Sensibilité standard',
          description:
            'Vous gérez bien les stimuli et les émotions. Vous pouvez être sensible sur certains points précis, mais votre système nerveux filtre efficacement.',
        }
      } else if (ratio < 0.55) {
        return {
          label: 'Sensibilité modérée',
          description:
            "Sensibilité supérieure à la moyenne. Vous avez probablement développé de bonnes stratégies d'adaptation, ou votre sensibilité ne concerne que certains domaines.",
        }
      } else if (ratio < 0.75) {
        return {
          label: 'Hypersensibilité avérée (HSP)',
          description:
            'Profil classique de la haute sensibilité. Votre système nerveux traite les informations avec une profondeur inhabituelle. Comprendre ce fonctionnement vous aidera à mieux le vivre.',
        }
      } else {
        return {
          label: 'Ultra-sensibilité',
          description:
            "Perméabilité très élevée. Souvent associée à une grande créativité, mais le risque d'épuisement est réel si l'environnement n'est pas adapté. Un accompagnement peut être bénéfique.",
        }
      }
    },

    getSectionScore(state) {
      return (sectionIndex: number): number => {
        const start = sectionIndex * this.questionsPerSection
        const end = start + this.questionsPerSection
        return state.answers
          .slice(start, end)
          .reduce(
            (sum: number, val: number | null, idx: number) =>
              sum + this.getAnswerScore(val, start + idx),
            0
          )
      }
    },

    sectionScores(): number[] {
      return this.sections.map((_, index) => this.getSectionScore(index))
    },

    normalizedSectionScores(): number[] {
      const maxSectionScore = this.questionsPerSection * MAX_RATING
      return this.sectionScores.map((score) => score / maxSectionScore)
    },

    dominantProfile(): Profile | null {
      let maxScore = 0
      let dominant: Profile | null = null

      this.profiles.forEach((profile) => {
        const profileScore = profile.sections.reduce((sum, sectionIdx) => {
          return sum + (this.normalizedSectionScores[sectionIdx] ?? 0)
        }, 0)
        const avgScore = profileScore / profile.sections.length

        if (avgScore > maxScore) {
          maxScore = avgScore
          dominant = profile
        }
      })

      return dominant
    },
  },

  actions: {
    startQuiz() {
      this.currentView = 'quiz'
    },

    skipQuiz() {
      this.currentView = 'skipped'
    },

    selectAnswer(value: number) {
      this.answers[this.currentQuestionIndex] = value
    },

    nextQuestion() {
      if (!this.isLastQuestion) {
        this.currentQuestionIndex++
      } else {
        this.currentView = 'results'
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
      }
    },

    restart() {
      this.currentView = 'intro'
      this.currentQuestionIndex = 0
      this.answers = Array(totalQuestions).fill(null)
    },

    completeWithFakeResults() {
      this.answers = this.answers.map(() =>
        Math.floor(Math.random() * (MAX_RATING + 1))
      )
      this.currentView = 'results'
    },
  },
})
