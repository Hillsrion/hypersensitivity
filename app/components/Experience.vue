<script setup lang="ts">
import { useExperienceDayTransition } from '~/app/composables/game/useExperienceDayTransition'
import {
  type ScrollTriggerHandle,
  useExperienceGradient,
} from '~/app/composables/game/useExperienceGradient'
import { QUIZ_ENTRY_DELAY_MS } from '~/app/constants/durations'
import { isContentRevealedPhase } from '~/app/stores/game/intro'
import type { Choice } from '~/app/types/game'

import GameChoiceButtons from './game/GameChoiceButtons.vue'
import GameContainer from './game/GameContainer.vue'

defineOptions({
  name: 'ExperienceScreen',
})

const gameStore = useGameStore()
const animationsStore = useAnimationsStore()

const endGameChoices: Choice[] = [
  { id: 'yes', text: 'OUI', nextSceneId: 'quiz' },
  { id: 'no', text: 'NON', nextSceneId: 'outro' },
]

const handleEndChoiceSelect = (choice: Choice) => {
  if (choice.id === 'yes') {
    showQuiz('intro')
  } else {
    showQuiz('skipped')
  }
}

const container = useTemplateRef<HTMLElement>('container')
const textContainer = useTemplateRef<HTMLElement>('textContainer')

const {
  eyePaths,
  gradientState,
  playCloseEyeAnimation,
  playOpenEyeAnimation,
  setupIntroSequence,
} = useExperienceAnimation()

const scrollTriggerInstance = ref<ScrollTriggerHandle | null>(null)
let quizTimer: ReturnType<typeof setTimeout> | null = null

const { backgroundGradient, isGameEnd, showEndContent } = useExperienceGradient(
  gradientState,
  computed(() => isDayTransition.value),
  scrollTriggerInstance
)

const audioStore = useAudioStore()
watch(showEndContent, (show) => {
  if (show) {
    audioStore.stopCurrentAudio(false)
  }
})

const { isDayTransition } = useExperienceDayTransition(
  gradientState,
  playCloseEyeAnimation,
  playOpenEyeAnimation,
  isGameEnd
)

const lines = [
  'Parfois tout est trop fort, et tout se superpose.',
  'Tu entendras peut-être ton histoire pendant ces quelques minutes.',
]

const { words } = useSplitText(textContainer, { splitBy: 'words' })

onUnmounted(() => {
  if (quizTimer) {
    clearTimeout(quizTimer)
    quizTimer = null
  }
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill()
  }
})

watch(
  [words, container],
  ([newWords, containerEl]) => {
    if (newWords && newWords.length && containerEl && textContainer.value) {
      nextTick(() => {
        const lineElements = textContainer.value?.children
        if (!lineElements || lineElements.length === 0) return

        if (scrollTriggerInstance.value) {
          scrollTriggerInstance.value.kill()
        }

        scrollTriggerInstance.value =
          setupIntroSequence(containerEl, lineElements) ?? null
      })
    }
  },
  { immediate: true }
)

const showQuiz = (view: 'intro' | 'skipped' = 'intro') => {
  showEndContent.value = false
  gameStore.setShowFinalFooter(false)

  quizTimer = setTimeout(() => {
    quizTimer = null
    const hspQuizStore = useHspQuizStore()
    if (view === 'skipped') hspQuizStore.skipQuiz()
    gameStore.setShowQuiz(true)
  }, QUIZ_ENTRY_DELAY_MS)
}

const isEyeHidden = computed(() => {
  return (
    (animationsStore.aurora.visible &&
      !isDayTransition.value &&
      isContentRevealedPhase(gameStore.introAnimationPhase)) ||
    isGameEnd.value ||
    gameStore.showQuiz
  )
})
</script>

<template>
  <div ref="container" class="relative h-[800svh] z-10">
    <div
      class="sticky top-0 w-full h-dvh flex items-center justify-center overflow-hidden transition-colors duration-1000"
      :style="{ background: backgroundGradient }"
    >
      <!-- Eye Animation -->
      <svg
        class="absolute top-1/2 left-1/2 w-screen aspect-square max-w-none -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-visible blur-sm transition-all duration-1000 origin-center"
        :class="{ 'opacity-0': isEyeHidden }"
        viewBox="0 0 1366 769"
      >
        <path v-once ref="eyePath" :d="eyePaths.closed" fill="white" />
      </svg>

      <!-- Game Container - Affiche dans l'oeil, l'annotation apparait avec l'animation -->
      <div
        class="absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000"
        :class="{ 'opacity-0': isGameEnd || isDayTransition }"
      >
        <GameContainer class="h-full pointer-events-auto" />
      </div>

      <!-- End Screen Overlay -->
      <Transition name="fade">
        <div
          v-if="showEndContent && !gameStore.showQuiz"
          class="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto"
        >
          <div
            class="max-w-2xl px-6 text-center h-full flex flex-col items-center justify-center"
          >
            <h2
              class="font-serif italic fl-text-xl/title leading-[1.4] text-white"
            >
              Souhaitez-vous évaluer votre spectre de l'Hypersensibilité ?
            </h2>
          </div>

          <GameChoiceButtons
            :choices="endGameChoices"
            variant="light"
            @select="handleEndChoiceSelect"
          />
        </div>
      </Transition>

      <!-- Content -->
      <h2
        ref="textContainer"
        class="relative z-10 max-w-4xl px-6 text-center grid place-items-center"
      >
        <span
          v-for="(line, index) in lines"
          :key="index"
          class="font-serif font-light text-title sm:text-2xl lg:text-intro-max leading-[1.45] text-primary opacity-0 col-start-1 row-start-1 w-full"
        >
          {{ line }}
        </span>
      </h2>
    </div>
  </div>
</template>
