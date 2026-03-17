import { eyePaths } from '~/app/constants/eyePaths'

export const useEyeAnimation = () => {
  const { $gsap } = useNuxtApp()
  const animationsStore = useAnimationsStore()
  const gameStore = useGameStore()
  const eyePath = useTemplateRef<SVGPathElement>('eyePath')

  const playCloseEyeAnimation = () => {
    return new Promise<void>((resolve) => {
      if (!eyePath.value) {
        resolve()
        return
      }

      const tl = $gsap.timeline({
        onComplete: resolve,
      })
      const duration = 0.3
      const isPortrait = window.matchMedia('(orientation: portrait)').matches
      const targetScale = isPortrait ? 25 : 5
      const targetDuration = isPortrait
        ? ((targetScale - 1) / (5 - 1)) * (duration * 3)
        : duration * 3

      const origin = isPortrait ? '683 200' : '683 384.5'
      tl.set(eyePath.value, { svgOrigin: origin })

      // Start from Open State
      tl.to(eyePath.value, {
        scale: 1,
        svgOrigin: origin,
        duration: targetDuration,
        ease: 'power2.inOut',
      })
        .to(eyePath.value, {
          attr: { d: eyePaths.step3 },
          y: 1,
          duration: duration,
          ease: 'power1.inOut',
        })
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step2 },
            y: 126.5,
            duration: duration,
            ease: 'power1.inOut',
          },
          '>'
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step1 },
            y: 239.08,
            duration: duration,
            ease: 'power1.inOut',
          },
          '>'
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.base },
            y: 299.74,
            duration: duration,
            ease: 'power1.inOut',
          },
          '>'
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.closed },
            duration: duration,
            ease: 'power1.inOut',
          },
          '>'
        )
        .call(() => {
          animationsStore.setCursorVariant('light')
          animationsStore.setAudiowaveVariant('light')
        })
    })
  }

  const playOpenEyeAnimation = () => {
    return new Promise<void>((resolve) => {
      if (!eyePath.value) {
        resolve()
        return
      }

      const tl = $gsap.timeline({
        onComplete: resolve,
      })
      const duration = 0.3
      const blurState = { amount: gameStore.introBlurAmount }
      const isPortrait = window.matchMedia('(orientation: portrait)').matches
      const targetScale = isPortrait ? 25 : 5
      const targetDuration = isPortrait
        ? ((targetScale - 1) / (5 - 1)) * (duration * 3)
        : duration * 3

      const origin = isPortrait ? '683 200' : '683 384.5'
      tl.set(eyePath.value, { svgOrigin: origin })

      tl.to(eyePath.value, {
        attr: { d: eyePaths.base },
        duration: duration,
        ease: 'power1.inOut',
      })
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step1 },
            y: 239.08,
            duration: duration,
            ease: 'power1.inOut',
          },
          'step1'
        )
        .to(
          blurState,
          {
            amount: 6,
            duration: duration,
            ease: 'power1.inOut',
            onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
          },
          'step1'
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step2 },
            y: 126.5,
            duration: duration,
            ease: 'power1.inOut',
          },
          'step2'
        )
        .to(
          blurState,
          {
            amount: 4,
            duration: duration,
            ease: 'power1.inOut',
            onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
          },
          'step2'
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step3 },
            y: 1,
            duration: duration,
            ease: 'power1.inOut',
          },
          'step3'
        )
        .to(
          blurState,
          {
            amount: 2,
            duration: duration,
            ease: 'power1.inOut',
            onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
          },
          'step3'
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step4 },
            y: 1,
            scale: targetScale,
            svgOrigin: origin,
            duration: targetDuration,
            ease: 'power1.inOut',
          },
          'step4'
        )
        .to(
          blurState,
          {
            amount: 0,
            duration: targetDuration,
            ease: 'power1.inOut',
            onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
          },
          'step4'
        )
        .call(() => {
          animationsStore.setCursorVariant('dark')
          animationsStore.setAudiowaveVariant('dark')
        })
    })
  }

  return {
    eyePath,
    playCloseEyeAnimation,
    playOpenEyeAnimation,
  }
}
