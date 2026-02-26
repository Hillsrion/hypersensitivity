import {
  gradientSteps,
  OUTRO_PRIMARY_COLOR,
  outroFooterGradient,
} from '~/app/constants/gradients'

export interface ExperienceGradientState {
  color1: string
  color2: string
  color3: string
  color4: string
  stop1: number
  stop2: number
  stop3: number
  stop4: number
}

export interface ScrollTriggerHandle {
  kill: () => void
}

export const useExperienceGradient = (
  gradientState: ExperienceGradientState,
  isDayTransition: Ref<boolean>,
  scrollTriggerInstance: Ref<ScrollTriggerHandle | null>
) => {
  const { $gsap } = useNuxtApp()
  const gameStore = useGameStore()
  const animationsStore = useAnimationsStore()

  const isGameEnd = computed(
    () =>
      gameStore.currentScene?.id === 'gameEnd' ||
      gameStore.showQuestionnaire ||
      gameStore.showFinalFooter
  )
  const showEndContent = ref(false)

  const backgroundGradient = computed(() => {
    const visible = animationsStore.aurora.visible
    const zIndex = animationsStore.aurora.zIndex

    if (isGameEnd.value) {
      return `linear-gradient(180deg, ${gradientState.color1} ${gradientState.stop1}%, ${gradientState.color2} ${gradientState.stop2}%, ${gradientState.color3} ${gradientState.stop3}%, ${gradientState.color4} ${gradientState.stop4}%)`
    }

    if (visible && zIndex > 0) {
      return 'transparent'
    }
    // We want the gradient to run during the end sequence or day transition
    if (gameStore.introPlayed && !isDayTransition.value) {
      if (gameStore.currentDay === 2) {
        return 'var(--color-primary)'
      }
      return 'white'
    }

    return `linear-gradient(180deg, ${gradientState.color1} ${gradientState.stop1}%, ${gradientState.color2} ${gradientState.stop2}%, ${gradientState.color3} ${gradientState.stop3}%, ${gradientState.color4} ${gradientState.stop4}%)`
  })

  const playFooterGradientTransition = () => {
    $gsap.killTweensOf(gradientState)

    Object.assign(gradientState, {
      color1: OUTRO_PRIMARY_COLOR,
      color2: OUTRO_PRIMARY_COLOR,
      color3: OUTRO_PRIMARY_COLOR,
      color4: OUTRO_PRIMARY_COLOR,
      stop1: 0,
      stop2: 33,
      stop3: 66,
      stop4: 100,
    })

    $gsap.to(gradientState, {
      ...outroFooterGradient,
      duration: 1.8,
      ease: 'power2.inOut',
    })
  }

  watch(isGameEnd, (newVal) => {
    if (newVal) {
      if (animationsStore.cursor.variant !== 'light') {
        animationsStore.setCursorVariant('light')
        animationsStore.setAudiowaveVariant('light')
      }

      // Kill conflicting tweens and scroll trigger
      $gsap.killTweensOf(gradientState)
      if (scrollTriggerInstance.value) {
        scrollTriggerInstance.value.kill()
        scrollTriggerInstance.value = null
      }

      // Reset gradient to start from Pure White
      // This prevents jumping if the state was modified by scroll or if step 0 is not white
      Object.assign(gradientState, {
        color1: '#ffffff',
        color2: '#ffffff',
        color3: '#ffffff',
        color4: '#ffffff',
      })

      const tl = $gsap.timeline()
      const stepDuration = 0.5

      gradientSteps.forEach((step) => {
        tl.to(gradientState, {
          ...step,
          duration: stepDuration,
          ease: 'none',
        })
      })

      tl.call(() => {
        showEndContent.value = true
      })
    } else {
      showEndContent.value = false
    }
  })

  watch(
    () => gameStore.showFinalFooter,
    (show) => {
      if (!show) return
      playFooterGradientTransition()
    }
  )

  return {
    backgroundGradient,
    isGameEnd,
    showEndContent,
  }
}
