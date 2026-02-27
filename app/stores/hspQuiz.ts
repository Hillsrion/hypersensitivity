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
const questionsPerSection = totalQuestions / sections.length

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

    totalScore(state): number {
      return state.answers.reduce(
        (sum: number, val: number | null) => sum + (val ?? 0),
        0
      )
    },

    sensitivityLevel(): SensitivityLevel {
      const score = this.totalScore
      if (score <= this.totalQuestions) {
        return {
          label: 'Sensibilité standard',
          description:
            'Vous gérez bien les stimuli et les émotions. Vous pouvez être sensible sur certains points précis, mais votre système nerveux filtre efficacement.',
        }
      } else if (score <= this.totalQuestions * 2) {
        return {
          label: 'Sensibilité modérée',
          description:
            "Sensibilité supérieure à la moyenne. Vous avez probablement développé de bonnes stratégies d'adaptation, ou votre sensibilité ne concerne que certains domaines.",
        }
      } else if (score <= this.totalQuestions * 3) {
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

    getSectionScore:
      (state) =>
      (sectionIndex: number): number => {
        const start = sectionIndex * questionsPerSection
        const end = start + questionsPerSection
        return state.answers
          .slice(start, end)
          .reduce(
            (sum: number, val: number | null) => sum + (val ?? 0),
            0
          ) as number
      },

    sectionScores(): number[] {
      return this.sections.map((_, index) => this.getSectionScore(index))
    },

    dominantProfile(): Profile | null {
      let maxScore = 0
      let dominant: Profile | null = null

      this.profiles.forEach((profile) => {
        const profileScore = profile.sections.reduce((sum, sectionIdx) => {
          return sum + this.getSectionScore(sectionIdx)
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
      this.answers = this.answers.map(() => Math.floor(Math.random() * 4))
      this.currentView = 'results'
    },
  },
})
