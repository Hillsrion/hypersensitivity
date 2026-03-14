<script setup lang="ts">
import { HSP_QUIZ_CONTENT_READY_DELAY_MS } from '~/app/constants/durations'

import GameOutroFooter from './game/GameOutroFooter.vue'
import HSPIntro from './hsp/HSPIntro.vue'
import HSPQuiz from './hsp/HSPQuiz.vue'
import HSPResults from './hsp/HSPResults.vue'

const props = defineProps<{
  developmentCreditUrl: string
  designCreditUrl: string
}>()

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
  questionsPerSection,
  currentQuestion,
  currentSectionIndex,
  isLastQuestion,
  progressPercent,
  displaySectionName,
  totalScore,
  sensitivityLevel,
  sectionScores,
  dominantProfile,
} = storeToRefs(hspQuizStore)

const { startQuiz, selectAnswer, nextQuestion, previousQuestion, restart } =
  hspQuizStore

const RESULTS_FADE_DISTANCE_PX = 220
const FOOTER_REVEAL_SCROLL_THRESHOLD_PX = 280

const route = useRoute()
const introRef = useTemplateRef('introRef')
const quizRef = useTemplateRef('quizRef')
const resultsRef = useTemplateRef('resultsRef')
const resultsWrapperRef = useTemplateRef<HTMLElement>('resultsWrapperRef')
const elementRef = useTemplateRef<HTMLElement>('elementRef')

const contentReady = ref(false)
const resultsScrollTop = ref(0)
const footerRevealTriggered = ref(false)
const animateFooter = ref(false)
let contentReadyTimer: ReturnType<typeof setTimeout> | null = null

const resultsOpacity = computed(() => {
  if (
    currentView.value !== 'results' ||
    !elementRef.value ||
    !resultsWrapperRef.value
  )
    return 1

  const wrapperHeight = resultsWrapperRef.value.offsetHeight
  const viewportHeight = elementRef.value.clientHeight

  // Only start fading when we reach the bottom of the results content
  const startFadingAt = Math.max(0, wrapperHeight - viewportHeight)

  const progress = Math.min(
    Math.max(0, resultsScrollTop.value - startFadingAt) /
      RESULTS_FADE_DISTANCE_PX,
    1
  )
  return 1 - progress
})

const resetResultsTransitionState = () => {
  resultsScrollTop.value = 0
  footerRevealTriggered.value = false
  animateFooter.value = false

  if (elementRef.value) {
    elementRef.value.scrollTop = 0
  }
}

const handleContainerScroll = () => {
  if (currentView.value !== 'results' || !elementRef.value) {
    return
  }

  const scrollTop = Math.max(elementRef.value.scrollTop, 0)
  resultsScrollTop.value = scrollTop

  const wrapperHeight = resultsWrapperRef.value?.offsetHeight ?? 0
  const viewportHeight = elementRef.value.clientHeight
  const startFadingAt = Math.max(0, wrapperHeight - viewportHeight)

  if (
    !footerRevealTriggered.value &&
    scrollTop >= startFadingAt + FOOTER_REVEAL_SCROLL_THRESHOLD_PX
  ) {
    footerRevealTriggered.value = true
    gameStore.setShowFinalFooter(true)
  }

  // Trigger footer text animation when we've scrolled enough to see the footer
  if (
    !animateFooter.value &&
    scrollTop >= elementRef.value.scrollHeight * 0.8
  ) {
    animateFooter.value = true
  }
}

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

const handleRestart = async () => {
  if (resultsRef.value) {
    await resultsRef.value.leave()
  }

  restart()
  gameStore.setShowFinalFooter(false)

  nextTick(() => {
    resetResultsTransitionState()
  })
}

watch(
  currentView,
  (view, previousView) => {
    const isEndingView = view === 'results' || view === 'skipped'
    const prevViewStr = previousView as string | undefined
    const wasEndingView = prevViewStr === 'results' || prevViewStr === 'skipped'

    if (isEndingView && !wasEndingView) {
      if (view === 'skipped') {
        const { track } = useMetrics()
        track('quiz_skipped')
        gameStore.setShowFinalFooter(true)
        footerRevealTriggered.value = true
        animateFooter.value = true
      } else {
        const { track } = useMetrics()
        track('quiz_completed', {
          sensitivity_level: sensitivityLevel.value,
          total_score: totalScore.value,
        })
        gameStore.setShowFinalFooter(false)
        footerRevealTriggered.value = false
      }

      nextTick(() => {
        resultsScrollTop.value = 0
        if (elementRef.value) {
          elementRef.value.scrollTop = 0
        }
      })

      return
    }

    if (!isEndingView) {
      resultsScrollTop.value = 0
      footerRevealTriggered.value = false
      animateFooter.value = false
    }
  },
  { immediate: true }
)

onMounted(() => {
  // Debug mode: jump straight to quiz
  if (route.query.debug === 'quiz') {
    startQuiz()
  }

  // Delay content rendering to match the external background transition duration from Experience.vue
  contentReadyTimer = setTimeout(() => {
    contentReadyTimer = null
    contentReady.value = true
  }, HSP_QUIZ_CONTENT_READY_DELAY_MS)

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
    class="quiz-container fixed inset-0 z-100 w-full h-dvh flex flex-col items-center text-white transition-opacity duration-500"
    data-lenis-prevent
    :class="{
      'justify-center overflow-hidden':
        currentView !== 'results' && currentView !== 'skipped',
      'justify-start overflow-y-auto overflow-x-hidden':
        currentView === 'results' || currentView === 'skipped',
      'p-4': currentView !== 'skipped',
    }"
    @scroll.passive="handleContainerScroll"
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
        :current-answer="answers[currentQuestionIndex] ?? null"
        :current-section-index="currentSectionIndex"
        :display-section-name="displaySectionName"
        :progress-percent="progressPercent"
        :is-last-question="isLastQuestion"
        @select-answer="selectAnswer"
        @next="handleNext"
        @previous="previousQuestion"
      />

      <!-- Results + Footer Scroll Continuum -->
      <div
        v-if="currentView === 'results' || currentView === 'skipped'"
        class="w-full flex-1 flex flex-col"
      >
        <div
          v-if="currentView === 'results'"
          ref="resultsWrapperRef"
          class="min-h-dvh w-full flex items-center justify-center transition-opacity duration-300"
          :style="{ opacity: resultsOpacity }"
        >
          <HSPResults
            ref="resultsRef"
            :total-score="totalScore"
            :total-questions="totalQuestions"
            :sensitivity-level="sensitivityLevel"
            :sections="sections"
            :section-scores="sectionScores"
            :questions-per-section="questionsPerSection"
            :dominant-profile="dominantProfile"
            @restart="handleRestart"
          />
        </div>

        <GameOutroFooter
          :animate="animateFooter"
          :development-credit-url="props.developmentCreditUrl"
          :design-credit-url="props.designCreditUrl"
        />
      </div>
    </template>
  </div>
</template>
