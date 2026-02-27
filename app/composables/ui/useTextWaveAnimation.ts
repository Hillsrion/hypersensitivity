import type { Ref } from 'vue'

export const useTextWaveAnimation = (
  elements: Ref<HTMLElement[] | null>,
  options: {
    immediate?: boolean
    onComplete?: () => void
    skipIntroOverride?: boolean
  } = {}
) => {
  const { $gsap } = useNuxtApp()
  const animationsStore = useAnimationsStore()

  const phaseTime = 0.1

  const playEntry = (targets: HTMLElement[], onComplete?: () => void) => {
    const shouldSkip =
      options.skipIntroOverride !== undefined
        ? options.skipIntroOverride
        : animationsStore.skipIntro

    if (shouldSkip) return

    $gsap.to(targets, {
      keyframes: [
        { autoAlpha: 0.2, duration: phaseTime, ease: 'power1.out' },
        { autoAlpha: 0.8, duration: phaseTime, ease: 'power1.inOut' },
        { autoAlpha: 1, duration: phaseTime, ease: 'power1.in' },
      ],
      stagger: phaseTime,
      onComplete,
    })
  }

  const playExit = (targets: HTMLElement[], onComplete?: () => void) => {
    const shouldSkip =
      options.skipIntroOverride !== undefined
        ? options.skipIntroOverride
        : animationsStore.skipIntro

    if (shouldSkip) {
      $gsap.set(targets, { autoAlpha: 0 })
      if (onComplete) onComplete()
      return
    }

    $gsap.to(targets, {
      keyframes: [
        { autoAlpha: 0.8, duration: phaseTime, ease: 'power1.out' },
        { autoAlpha: 0.2, duration: phaseTime, ease: 'power1.inOut' },
        { autoAlpha: 0, duration: phaseTime, ease: 'power1.in' },
      ],
      stagger: phaseTime,
      onComplete,
    })
  }

  watch(
    elements,
    (newElements) => {
      if (newElements && newElements.length) {
        nextTick(() => {
          const targets = toRaw(newElements)
          $gsap.set(targets, { autoAlpha: 0 })

          if (options.immediate) {
            playEntry(targets, options.onComplete)
          }
        })
      }
    },
    { immediate: true }
  )

  return {
    playEntry,
    playExit,
  }
}
