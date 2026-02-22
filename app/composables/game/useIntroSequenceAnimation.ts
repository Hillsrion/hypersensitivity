import { gradientSteps } from '~/app/constants/gradients'
import { eyePaths } from '~/app/constants/eyePaths'
import {
  getCursorVariantForProgress,
  shouldTriggerIntroAutoScroll,
} from './orchestration'

export const useIntroSequenceAnimation = (
  eyePathRef: Ref<SVGPathElement | null>
) => {
  const { $gsap } = useNuxtApp()
  const gameStore = useGameStore()
  const animationsStore = useAnimationsStore()
  const audioStore = useAudioStore()

  const audioTriggered = ref(false)
  let stopAutoScrollWatch: (() => void) | null = null
  let stopAudioCatchupWatch: (() => void) | null = null

  const gradientState = reactive({
    color1: '#ffffff',
    color2: '#ffffff',
    color3: '#ffffff',
    color4: '#ffffff',
    stop1: 0,
    stop2: 33,
    stop3: 66,
    stop4: 100,
  })

  const stopWatcher = (stopper: (() => void) | null) => {
    stopper?.()
    return null
  }

  const cleanupActiveWatchers = () => {
    stopAutoScrollWatch = stopWatcher(stopAutoScrollWatch)
    stopAudioCatchupWatch = stopWatcher(stopAudioCatchupWatch)
  }

  const setCursorThemeForProgress = (progress: number) => {
    const nextVariant = getCursorVariantForProgress(progress)
    if (animationsStore.cursor.variant !== nextVariant) {
      animationsStore.setCursorVariant(nextVariant)
      animationsStore.setAudiowaveVariant(nextVariant)
    }
  }

  const waitForAudioThenReveal = () => {
    console.log('LOG_DEBUG: Intro timeline buffer complete')
    if (gameStore.introPlayed) {
      console.log('LOG_DEBUG: Intro already played, skipping phase update')
      return
    }

    const firstDialogue = gameStore.currentScene?.dialogues[0]
    const firstWordStart = firstDialogue?.timings?.[0]?.start || 0
    const currentTime = audioStore.currentTime

    if (currentTime < firstWordStart) {
      console.log('LOG_DEBUG: Waiting for audio to catch up...', {
        currentTime,
        firstWordStart,
      })

      stopAudioCatchupWatch = stopWatcher(stopAudioCatchupWatch)
      stopAudioCatchupWatch = watch(
        () => audioStore.currentTime,
        (time) => {
          if (time >= firstWordStart) {
            console.log('LOG_DEBUG: Audio caught up, setting revealing')
            gameStore.setIntroAnimationPhase('revealing')
            stopAudioCatchupWatch = stopWatcher(stopAudioCatchupWatch)
          }
        }
      )
      return
    }

    console.log('LOG_DEBUG: Audio ready, setting revealing immediately')
    gameStore.setIntroAnimationPhase('revealing')
  }

  const createTextTimeline = (lineElements: HTMLCollection) => {
    const textTl = $gsap.timeline()

    Array.from(lineElements).forEach((lineEl) => {
      const lineWords = lineEl.querySelectorAll('.word')

      $gsap.set(lineWords, { opacity: 0.2 })

      textTl.to(lineEl, {
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.out',
      })

      textTl.to(lineWords, {
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
      })

      textTl.to(lineEl, {
        autoAlpha: 0,
        duration: 0.5,
        ease: 'power2.in',
      })
    })

    return textTl
  }

  const createGradientTimeline = (
    lineElements: HTMLCollection,
    totalDuration: number
  ) => {
    const stepDuration = totalDuration / gradientSteps.length
    const gradientTl = $gsap.timeline()

    gradientSteps.forEach((step, index) => {
      gradientTl.to(gradientState, {
        ...step,
        duration: stepDuration,
        ease: 'none',
      })

      if (index === 5) {
        gradientTl.to(
          lineElements,
          {
            color: '#ffffff',
            duration: stepDuration,
            ease: 'none',
          },
          '<'
        )
      }
    })

    return gradientTl
  }

  const createEyeTimeline = () => {
    const eyeTl = $gsap.timeline()
    const eyeStepDuration = 0.3
    const blurState = { amount: 8 }

    if (eyePathRef.value) {
      $gsap.set(eyePathRef.value, {
        y: 299.74,
        scale: 1,
        transformOrigin: 'center center',
        transformBox: 'fill-box',
      })
    }

    gameStore.setIntroBlurAmount(8)

    eyeTl
      .call(() => {
        if (gameStore.introPlayed) return
        console.log('LOG_DEBUG: eyeTl started, setting phase to annotation')
        gameStore.setIntroAnimationPhase('annotation')
      })
      .to(eyePathRef.value, {
        attr: { d: eyePaths.base },
        duration: eyeStepDuration,
        ease: 'power1.inOut',
      })
      .call(() => {
        if (gameStore.introPlayed) return

        const currentScene = gameStore.currentScene
        const audioToPlay =
          currentScene?.audio || gameStore.currentDialogue?.audio

        console.log(
          'LOG_DEBUG: eyeTl mid call. Scene:',
          currentScene?.id,
          'Audio:',
          audioToPlay
        )

        if (audioToPlay) {
          const audioPath = audioToPlay.startsWith('/')
            ? audioToPlay
            : `/audios/${audioToPlay}`
          audioStore.playAudio(audioPath)
          audioTriggered.value = true
          console.log('LOG_DEBUG: audioTriggered set to true')
        }
      })
      .to(
        eyePathRef.value,
        {
          attr: { d: eyePaths.step1 },
          y: 239.08,
          duration: eyeStepDuration,
          ease: 'power1.inOut',
        },
        'step1'
      )
      .to(
        blurState,
        {
          amount: 6,
          duration: eyeStepDuration,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (!gameStore.introPlayed)
              gameStore.setIntroBlurAmount(blurState.amount)
          },
        },
        'step1'
      )
      .to(
        eyePathRef.value,
        {
          attr: { d: eyePaths.step2 },
          y: 126.5,
          duration: eyeStepDuration,
          ease: 'power1.inOut',
        },
        'step2'
      )
      .to(
        blurState,
        {
          amount: 4,
          duration: eyeStepDuration,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (!gameStore.introPlayed)
              gameStore.setIntroBlurAmount(blurState.amount)
          },
        },
        'step2'
      )
      .to(
        eyePathRef.value,
        {
          attr: { d: eyePaths.step3 },
          y: 1,
          duration: eyeStepDuration,
          ease: 'power1.inOut',
        },
        'step3'
      )
      .to(
        blurState,
        {
          amount: 2,
          duration: eyeStepDuration,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (!gameStore.introPlayed)
              gameStore.setIntroBlurAmount(blurState.amount)
          },
        },
        'step3'
      )
      .to({}, { duration: eyeStepDuration })
      .to(eyePathRef.value, {
        attr: { d: eyePaths.step4 },
        y: 1,
        scale: 5,
        duration: eyeStepDuration * 3,
        ease: 'power1.inOut',
      })
      .to(
        blurState,
        {
          amount: 0,
          duration: eyeStepDuration * 3,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (!gameStore.introPlayed)
              gameStore.setIntroBlurAmount(blurState.amount)
          },
        },
        '<'
      )
      .to(
        {},
        {
          duration: eyeStepDuration * 3,
          onComplete: waitForAudioThenReveal,
        }
      )

    return eyeTl
  }

  const setupAutoScrollWatcher = (
    mainTl: gsap.core.Timeline,
    containerEl: HTMLElement
  ) => {
    stopAutoScrollWatch = stopWatcher(stopAutoScrollWatch)

    stopAutoScrollWatch = watch(
      () => audioStore.currentTime,
      (time) => {
        const firstDialogue = gameStore.currentScene?.dialogues[0]
        if (!firstDialogue) return

        const firstWordStart = firstDialogue.timings?.[0]?.start
        if (typeof firstWordStart !== 'number') return

        if (
          !shouldTriggerIntroAutoScroll({
            audioTriggered: audioTriggered.value,
            introPlayed: gameStore.introPlayed,
            isAutoScrolling: gameStore.isAutoScrolling,
            progress: mainTl.progress(),
            currentTime: time,
            firstWordStart,
          })
        ) {
          return
        }

        const scrollDuration = 1.5
        console.log('LOG_DEBUG: Auto-scrolling to bottom (user too slow)')
        gameStore.setAutoScrolling(true)

        $gsap.to(window, {
          scrollTo: {
            y: containerEl.offsetTop + 7 * window.innerHeight,
          },
          duration: scrollDuration,
          ease: 'power2.inOut',
          onComplete: () => {
            gameStore.setAutoScrolling(false)
            if (!gameStore.introPlayed) {
              gameStore.setIntroAnimationPhase('complete')
              gameStore.setIntroPlayed()
            }
          },
        })
      }
    )
  }

  const setupIntroSequence = (
    containerEl: HTMLElement,
    lineElements: HTMLCollection
  ) => {
    cleanupActiveWatchers()
    audioTriggered.value = false

    const mainTl = $gsap.timeline({
      scrollTrigger: {
        trigger: containerEl,
        start: 'top top',
        end: '+=700%',
        scrub: true,
      },
    })

    const scrollTriggerInstance = mainTl.scrollTrigger
    const textTl = createTextTimeline(lineElements)
    const gradientTl = createGradientTimeline(lineElements, textTl.duration())
    const eyeTl = createEyeTimeline()

    mainTl.add(textTl, 0)
    mainTl.add(gradientTl, 0)
    mainTl.add(eyeTl, '>')

    mainTl.eventCallback('onComplete', () => {
      animationsStore.setScrollLocked(true)
    })

    mainTl.eventCallback('onUpdate', () => {
      if (gameStore.introPlayed) return
      setCursorThemeForProgress(mainTl.progress())
    })

    setupAutoScrollWatcher(mainTl, containerEl)

    return scrollTriggerInstance
  }

  onUnmounted(() => {
    cleanupActiveWatchers()
  })

  return {
    gradientState,
    setupIntroSequence,
  }
}
