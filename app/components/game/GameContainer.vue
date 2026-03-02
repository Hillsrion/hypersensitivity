<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'

import { EDGE_SPACING } from '~/app/constants/layout'
import { UI_SIZES } from '~/app/constants/ui'

import MenuIcon from '../ui/MenuIcon.vue'
import ChoiceButtons from './ChoiceButtons.vue'
import DialogueBox from './DialogueBox.vue'
import GameEnergyBar from './GameEnergyBar.vue'
import GameHeader from './GameHeader.vue'

const { $gsap } = useNuxtApp()

const containerRef = useTemplateRef<HTMLElement>('containerRef')

// Use VueUse to detect if the game container is physically on screen
const isContainerVisible = useElementVisibility(containerRef)

const {
  gameStore,
  audioStore,
  isChoiceSelecting,
  activeChoices,
  audioProgressPercent,
  showAnnotation,
  isMilestoneAnnotation,
  showGameUI,
  showDelayedGameUI,
  annotationText,
  showContent,
  handleInteraction,
  handleChoiceSelect,
  onDialogueAnimationComplete,
} = useGameController()

const visualProgress = ref(0)
const barTransformOrigin = ref('left')
let progressResetTimer: ReturnType<typeof setTimeout> | null = null

const isMenuBusy = computed(
  () =>
    gameStore.isMenuOpening || gameStore.isMenuOpen || gameStore.isMenuClosing
)

const shouldShowCoreUi = computed(
  () => showDelayedGameUI.value && !isMenuBusy.value
)

const isGameAudioPlaying = computed(() => {
  return (
    audioStore.isPlaying &&
    (audioStore.currentAudio?.src.includes('experience') || false)
  )
})

watch(isGameAudioPlaying, (playing) => {
  if (playing) {
    if (progressResetTimer) {
      clearTimeout(progressResetTimer)
      progressResetTimer = null
    }
    if (barTransformOrigin.value !== 'left') {
      barTransformOrigin.value = 'left'
    }
  } else {
    // Audio stopped - trigger exit animation
    visualProgress.value = 100
    barTransformOrigin.value = 'right'
    if (progressResetTimer) {
      clearTimeout(progressResetTimer)
    }
    progressResetTimer = setTimeout(() => {
      progressResetTimer = null
      visualProgress.value = 0
    }, 50)
  }
})

watch(audioProgressPercent, (newVal) => {
  if (isGameAudioPlaying.value) {
    visualProgress.value = newVal
  }
})

onUnmounted(() => {
  if (progressResetTimer) {
    clearTimeout(progressResetTimer)
    progressResetTimer = null
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full h-svh overflow-hidden transition-colors duration-500"
    @click="handleInteraction"
  >
    <!-- Menu Icon (top left) -->
    <Teleport to="body">
      <Transition name="fade-fast" appear>
        <button
          v-if="showDelayedGameUI && !isMilestoneAnnotation"
          class="fixed z-70 text-primary cursor-pointer group flex items-center justify-center font-sans"
          :class="[EDGE_SPACING.TOP, EDGE_SPACING.LEFT, UI_SIZES.TOP_ELEMENT]"
          @click.stop="gameStore.toggleMenu()"
        >
          <MenuIcon
            :is-open="gameStore.isMenuOpen || gameStore.isMenuOpening"
          />
        </button>
      </Transition>
    </Teleport>

    <!-- Header -->
    <Transition name="fade-fast" appear>
      <GameHeader v-if="shouldShowCoreUi" />
    </Transition>

    <!-- Energy Bar (right side) -->
    <Transition name="fade-fast" appear>
      <GameEnergyBar
        v-if="shouldShowCoreUi"
        class="absolute z-40 transition-opacity duration-300 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
        :class="[
          {
            'opacity-0 pointer-events-none min-[590px]:opacity-100 min-[590px]:pointer-events-auto':
              (gameStore.showChoices || gameStore.selectedChoice) &&
              !isMilestoneAnnotation,
            'opacity-100': !(
              (gameStore.showChoices || gameStore.selectedChoice) &&
              !isMilestoneAnnotation
            ),
          },
          EDGE_SPACING.ENERGY_BAR,
        ]"
      />
    </Transition>

    <!-- Intro Annotation handled by DialogueBox now -->
    <Transition
      :css="false"
      @leave="
        (el, done) => {
          $gsap.to(el, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.inOut',
            onComplete: done,
          })
        }
      "
    >
      <div
        v-if="showAnnotation"
        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
      >
        <DialogueBox
          :dialogue="{
            id: 'intro-anno',
            speaker: '',
            speakerType: 'normal',
            text: '',
            annotation: annotationText,
            isChat: false,
          }"
          :blur-amount="gameStore.introBlurAmount"
          class="pointer-events-auto"
        />
      </div>
    </Transition>

    <!-- Dialogue Area (center) -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
    >
      <Transition name="fade-fast" mode="out-in">
        <DialogueBox
          v-if="
            showContent &&
            !showAnnotation &&
            (showDelayedGameUI ||
              !gameStore.isFirstDialogueOfInitialScene ||
              isMilestoneAnnotation) &&
            !isMenuBusy
          "
          :key="
            isMilestoneAnnotation
              ? 'milestone-anno'
              : gameStore.currentDialogue?.id
          "
          ref="dialogueBoxRef"
          :dialogue="
            isMilestoneAnnotation
              ? {
                  id: 'milestone-entry',
                  speaker: '',
                  speakerType: 'normal',
                  text: '',
                  annotation: gameStore.currentScene?.entryAnnotation || '',
                  isChat: false,
                }
              : gameStore.currentDialogue
          "
          :is-selecting="isChoiceSelecting"
          class="pointer-events-auto"
          @animation-complete="onDialogueAnimationComplete"
        />
      </Transition>
    </div>

    <!-- Choice Buttons (bottom) -->
    <Transition name="fade-fast">
      <ChoiceButtons
        v-if="
          (gameStore.showChoices || gameStore.selectedChoice) &&
          showGameUI &&
          !isMenuBusy &&
          !isMilestoneAnnotation
        "
        ref="choicesRef"
        :choices="activeChoices"
        @selecting="isChoiceSelecting = true"
        @select="handleChoiceSelect"
      />
    </Transition>

    <!-- Milestone Menu - removed from here as it Teleports itself -->
    <!-- <GameMilestoneMenu /> -->

    <!-- Game End Screen removed as per request -->

    <!-- Fixed Progress Bar -->
    <div
      v-if="
        isContainerVisible &&
        (showGameUI || isGameAudioPlaying) &&
        !gameStore.isMenuOpening &&
        !gameStore.isMenuOpen &&
        !gameStore.isGameEnded
      "
      class="fixed bottom-0 left-0 w-full h-[4px] bg-primary/10 z-50"
    >
      <div
        class="w-full h-full bg-primary transition-transform duration-500 ease-out"
        :style="{
          transform: `scaleX(${visualProgress / 100})`,
          transformOrigin: barTransformOrigin,
        }"
      />
    </div>
  </div>
</template>
