<script setup lang="ts">
import HSPIntro from './hsp/HSPIntro.vue'
import HSPQuiz from './hsp/HSPQuiz.vue'
import { HSP_QUESTIONNAIRE_CONTENT_READY_DELAY_MS } from '~/app/constants/durations'

const { $gsap } = useNuxtApp()
const animationsStore = useAnimationsStore()
const gameStore = useGameStore()
const hspQuizStore = useHspQuizStore()
const {
  currentView,
  currentQuestionIndex,
  answers,
  ratings,
  sections,
  questions,
  totalQuestions,
  currentQuestion,
  currentSectionIndex,
  isLastQuestion,
  progressPercent,
  displaySectionName,
} = storeToRefs(hspQuizStore)

const { startQuiz, selectAnswer, nextQuestion, previousQuestion, restart } =
  hspQuizStore

const route = useRoute()
const introRef = useTemplateRef('introRef')
const quizRef = useTemplateRef('quizRef')
const elementRef = useTemplateRef('elementRef')

const handleStart = async () => {
  if (introRef.value) {
    await introRef.value.leave()
  }
  startQuiz()
}

const handleNext = async () => {
  if (isLastQuestion.value) {
    if (quizRef.value) {
      await quizRef.value.leave()
    }
  }
  nextQuestion()
}

const contentReady = ref(false)
let contentReadyTimer: ReturnType<typeof setTimeout> | null = null

watch(currentView, (view, previousView) => {
  if (view !== 'results' || previousView === 'results') {
    return
  }

  gameStore.setShowQuestionnaire(false)
  gameStore.setShowFinalFooter(true)
  restart()
})

onMounted(() => {
  // Debug mode: jump straight to quiz
  if (route.query.debug === 'quiz') {
    startQuiz()
  }

  // Delay content rendering to match the external background transition duration from Experience.vue
  contentReadyTimer = setTimeout(() => {
    contentReadyTimer = null
    contentReady.value = true
  }, HSP_QUESTIONNAIRE_CONTENT_READY_DELAY_MS)

  $gsap.timeline({
    scrollTrigger: {
      trigger: elementRef.value,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        animationsStore.setCursorVariant('light')
        animationsStore.setAudiowaveVariant('light')
      },
      onEnterBack: () => {
        animationsStore.setCursorVariant('light')
        animationsStore.setAudiowaveVariant('light')
      },
    },
  })
})

onUnmounted(() => {
  if (contentReadyTimer) {
    clearTimeout(contentReadyTimer)
    contentReadyTimer = null
  }
})
</script>

<template>
  <div
    ref="elementRef"
    class="questionnaire-container fixed inset-0 z-100 w-full h-full flex flex-col items-center justify-center p-4 text-white overflow-y-auto transition-all duration-500"
  >
    <!-- Delay content rendering until external gradient finishes if needed or just let it be handled by child components (HSPIntro handles its own enter fade) -->
    <template v-if="contentReady || currentView !== 'intro'">
      <!-- Intro Screen -->
      <HSPIntro
        v-if="currentView === 'intro'"
        ref="introRef"
        :total-questions="totalQuestions"
        :sections-count="sections.length"
        @start="handleStart"
      />

      <!-- Quiz Screen -->
      <HSPQuiz
        v-if="currentView === 'quiz'"
        ref="quizRef"
        :sections="sections"
        :questions="questions"
        :current-question="currentQuestion"
        :current-question-index="currentQuestionIndex"
        :total-questions="totalQuestions"
        :ratings="ratings"
        :current-answer="answers[currentQuestionIndex]"
        :current-section-index="currentSectionIndex"
        :display-section-name="displaySectionName"
        :progress-percent="progressPercent"
        :is-last-question="isLastQuestion"
        @select-answer="selectAnswer"
        @next="handleNext"
        @previous="previousQuestion"
      />
    </template>
  </div>
</template>
