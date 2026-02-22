import { gradientSteps } from '~/app/constants/gradients'
import {
  DAY_TRANSITION_ANNOTATION_AUTO_COMPLETE_DELAY_MS,
  DAY_TRANSITION_EYE_CLOSED_PAUSE_MS,
  DAY_TRANSITION_UI_FADE_OUT_DELAY_MS,
} from '~/app/constants/durations'
import { isEntryAnnotationPhase } from '~/app/stores/game/intro'

interface GradientState {
  color1: string
  color2: string
  color3: string
  color4: string
  stop1: number
  stop2: number
  stop3: number
  stop4: number
}

export const useExperienceDayTransition = (
  gradientState: GradientState,
  playCloseEyeAnimation: () => Promise<void>,
  playOpenEyeAnimation: () => Promise<void>,
  isGameEnd: ComputedRef<boolean>
) => {
  const { $gsap } = useNuxtApp()
  const gameStore = useGameStore()
  const isDayTransition = ref(false)
  const sleep = (delay: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, delay))

  watch(
    () => gameStore.isDayTransitioning,
    async (isTransitioning) => {
      // We only trigger when it turns true automatically by gameStore.goToScene
      if (!isTransitioning || isGameEnd.value) return

      // 1. Hide Game UI
      isDayTransition.value = true

      // Reset gradient to white first to avoid snappy transitions
      Object.assign(gradientState, {
        color1: '#ffffff',
        color2: '#ffffff',
        color3: '#ffffff',
        color4: '#ffffff',
      })

      // Animate background to black over the UI fade time
      $gsap.to(gradientState, {
        ...gradientSteps[8],
        duration: 1,
        ease: 'power2.inOut',
      })

      // Wait for UI to fade out
      await sleep(DAY_TRANSITION_UI_FADE_OUT_DELAY_MS)

      // 2. Play Close Eye Animation
      await playCloseEyeAnimation()

      // The eye is fully closed. Safely advance the game state to Day 2 in the background.
      gameStore.completeDayTransition()

      // Small pause closed
      await sleep(DAY_TRANSITION_EYE_CLOSED_PAUSE_MS)

      // Prepare to show the new scene's annotation blurred behind the closed eye
      gameStore.setIntroBlurAmount(8)
      isDayTransition.value = false // Mounts the UI behind the eye

      // Let Vue render the UI
      await nextTick()

      // 3. Play Open Eye Animation (This will also animate introBlurAmount down to 0)
      await playOpenEyeAnimation()

      // 4. Finish Transition
      gameStore.setDayTransitioning(false)

      // 5. Start entry annotation timer now that the UI is visible
      if (isEntryAnnotationPhase(gameStore.introAnimationPhase)) {
        gameStore.startAnnotationTimer(
          DAY_TRANSITION_ANNOTATION_AUTO_COMPLETE_DELAY_MS
        )
      }
    }
  )

  return {
    isDayTransition,
  }
}
