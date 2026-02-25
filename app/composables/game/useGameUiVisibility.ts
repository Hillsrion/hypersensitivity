import {
  DAY_TRANSITION_GAME_UI_REVEAL_DELAY_MS,
  MENU_OPENING_TRANSITION_DELAY_MS,
} from '~/app/constants/durations'
import {
  isContentRevealedPhase,
  isEntryAnnotationPhase,
} from '~/app/stores/game/intro'

export const useGameUiVisibility = () => {
  const gameStore = useGameStore()
  const audioStore = useAudioStore()

  const audioProgressPercent = computed(() => {
    const audio = audioStore.currentAudio
    if (!audio || !audioStore.isPlaying) return 0

    const duration = audio.duration
    if (!duration || isNaN(duration) || duration === 0) return 0

    return Math.min(100, (audioStore.currentTime / duration) * 100)
  })

  const showAnnotation = computed(() => {
    return gameStore.introAnimationPhase === 'annotation'
  })

  const isMilestoneAnnotation = computed(() => {
    return gameStore.introAnimationPhase === 'milestoneAnnotation'
  })

  const showGameUI = computed(() => {
    return (
      gameStore.forceShowUI ||
      isContentRevealedPhase(gameStore.introAnimationPhase)
    )
  })

  const showDelayedGameUI = ref(false)
  let uiDelayTimer: ReturnType<typeof setTimeout> | null = null
  let menuOpeningTimer: ReturnType<typeof setTimeout> | null = null

  const clearUiDelayTimer = () => {
    if (!uiDelayTimer) return
    clearTimeout(uiDelayTimer)
    uiDelayTimer = null
  }

  const clearMenuOpeningTimer = () => {
    if (!menuOpeningTimer) return
    clearTimeout(menuOpeningTimer)
    menuOpeningTimer = null
  }

  watch(
    () => ({
      phase: gameStore.introAnimationPhase,
      force: gameStore.forceShowUI,
      day: gameStore.currentDay,
    }),
    ({ phase, force, day }) => {
      clearUiDelayTimer()

      if (force || isContentRevealedPhase(phase)) {
        showDelayedGameUI.value = true
        return
      }

      if (isEntryAnnotationPhase(phase) && day > 1) {
        showDelayedGameUI.value = false

        uiDelayTimer = setTimeout(() => {
          uiDelayTimer = null
          showDelayedGameUI.value = true
        }, DAY_TRANSITION_GAME_UI_REVEAL_DELAY_MS)
        return
      }

      showDelayedGameUI.value = false
    },
    { immediate: true }
  )

  watch(
    () => gameStore.isMenuOpening,
    (isOpening) => {
      if (isOpening) {
        clearMenuOpeningTimer()
        menuOpeningTimer = setTimeout(() => {
          menuOpeningTimer = null
          gameStore.openMenu()
        }, MENU_OPENING_TRANSITION_DELAY_MS)
      } else {
        clearMenuOpeningTimer()
      }
    }
  )

  const annotationText = computed(() => {
    const text = gameStore.firstDialogueAnnotation || ''
    console.log('LOG_DEBUG: annotationText computed:', text)
    return text
  })

  const showContent = computed(() => {
    const has = gameStore.hasDialogues && !!gameStore.currentDialogue
    console.log(
      'LOG_DEBUG: GameContainer showContent:',
      has,
      'currentDialogueIdx:',
      gameStore.currentDialogueIndex
    )
    return has
  })

  onUnmounted(() => {
    clearUiDelayTimer()
    clearMenuOpeningTimer()
  })

  return {
    audioProgressPercent,
    showAnnotation,
    isMilestoneAnnotation,
    showGameUI,
    showDelayedGameUI,
    annotationText,
    showContent,
  }
}
