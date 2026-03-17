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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let activeTween: any = null

  const playEntry = (targets: HTMLElement[], onComplete?: () => void) => {
    const shouldSkip =
      options.skipIntroOverride !== undefined
        ? options.skipIntroOverride
        : animationsStore.skipIntro

    if (shouldSkip) {
      $gsap.set(targets, { autoAlpha: 1 })
      if (onComplete) onComplete()
      return
    }

    if (activeTween) {
      activeTween.kill()
    }

    activeTween = $gsap.to(targets, {
      keyframes: [
        { autoAlpha: 0.2, duration: phaseTime, ease: 'power1.out' },
        { autoAlpha: 0.8, duration: phaseTime, ease: 'power1.inOut' },
        { autoAlpha: 1, duration: phaseTime, ease: 'power1.in' },
      ],
      stagger: phaseTime,
      overwrite: 'auto',
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

    if (activeTween) {
      activeTween.kill()
    }

    activeTween = $gsap.to(targets, {
      keyframes: [
        { autoAlpha: 0.8, duration: phaseTime, ease: 'power1.out' },
        { autoAlpha: 0.2, duration: phaseTime, ease: 'power1.inOut' },
        { autoAlpha: 0, duration: phaseTime, ease: 'power1.in' },
      ],
      stagger: phaseTime,
      overwrite: 'auto',
      onComplete,
    })
  }

  watch(
    elements,
    (newElements) => {
      if (newElements && newElements.length) {
        const targets = toRaw(newElements)
        $gsap.set(targets, { autoAlpha: 0 })

        if (options.immediate) {
          playEntry(targets, options.onComplete)
        }
      }
    },
    { immediate: true }
  )

  return {
    playEntry,
    playExit,
  }
}
