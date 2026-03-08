import type { DialogueLine } from '../../types/game'
import { areAudioPathsEquivalent, resolveTimingEnd } from './orchestration'

type SplitResult = {
  words: Ref<HTMLElement[]>
  lines: Ref<HTMLElement[]>
  chars: Ref<HTMLElement[]>
}

type MaybeElement = HTMLElement | ComponentPublicInstance | null

export function useDialogueAnimation(
  dialogue: Ref<DialogueLine | null>,
  textRef: Ref<HTMLElement | null>,
  annotationRef: Ref<MaybeElement>,
  speakerRef: Ref<MaybeElement>,
  split: SplitResult,
  emit: (event: 'animationComplete') => void,
  handleAudioEnded: () => void,
  ensureAudioPlaying: (path: string) => void,
  clearFallbackTimer: () => void
) {
  const { $gsap } = useNuxtApp()
  const audioStore = useAudioStore()
  const gameStore = useGameStore()

  const isAnimating = ref(false)
  const activeTimeline = ref<gsap.core.Timeline | null>(null)
  const currentTimedAnnotation = ref<string | null>(null)
  const isShowingOnlyAnnotation = ref(false)
  const pendingTimers = new Set<ReturnType<typeof setTimeout>>()
  let isDisposed = false

  const scheduleTimer = (callback: () => void, delay: number) => {
    const timerId = setTimeout(() => {
      pendingTimers.delete(timerId)
      if (!isDisposed) {
        callback()
      }
    }, delay)

    pendingTimers.add(timerId)
    return timerId
  }

  const clearPendingTimers = () => {
    pendingTimers.forEach((timerId) => clearTimeout(timerId))
    pendingTimers.clear()
  }

  const isInIntroAnimation = computed(() => {
    return gameStore.isFirstDialogueOfInitialScene && !gameStore.introPlayed
  })

  const sceneAudio = computed(() => {
    return gameStore.currentScene?.audio
  })

  const getEffectiveEnd = (
    end: number | 'end',
    start: number,
    audioToPlay: string | null | undefined
  ): number => {
    const audioPath =
      audioToPlay &&
      (audioToPlay.startsWith('/') ? audioToPlay : `/audios/${audioToPlay}`)
    const audioItem = audioPath
      ? audioStore.list.find((item) => item.path === audioPath)
      : undefined

    return resolveTimingEnd({
      end,
      start,
      candidateDurations: [audioItem?.audio?.duration, audioItem?.duration],
    })
  }

  const waitForAudioStoreReady = () => {
    if (audioStore.list.length > 0) return false

    console.log('LOG_DEBUG: Audio store empty, waiting...')
    const waitForAudio = () => {
      if (isDisposed) return
      if (audioStore.list.length > 0) {
        console.log('LOG_DEBUG: Audio store ready, calling animateWords')
        animateWords()
      } else {
        scheduleTimer(waitForAudio, 100)
      }
    }

    scheduleTimer(waitForAudio, 100)
    return true
  }

  const attachAudioEndedListener = () => {
    scheduleTimer(() => {
      if (audioStore.currentAudio) {
        audioStore.currentAudio.removeEventListener('ended', handleAudioEnded)
        audioStore.currentAudio.addEventListener('ended', handleAudioEnded)
      }
    }, 100)
  }

  const createWordTimeline = (audioToPlay: string | null | undefined) => {
    const timeline = $gsap.timeline({
      onStart: () => {
        if (audioToPlay && !isInIntroAnimation.value) {
          ensureAudioPlaying(audioToPlay)

          const audioPath = audioToPlay.startsWith('/')
            ? audioToPlay
            : `/audios/${audioToPlay}`
          const item = audioStore.list.find(
            (i) => i.path === audioPath || i.path?.endsWith(audioToPlay)
          )

          if (!item && !isInIntroAnimation.value) {
            console.log(
              'LOG_DEBUG: Audio item missing from list, starting 3s fallback timer'
            )
            timeline.add($gsap.delayedCall(3, handleAudioEnded), 0)
          }
        } else if (!isInIntroAnimation.value) {
          console.log('LOG_DEBUG: No audio to play, starting 3s fallback timer')
          timeline.add($gsap.delayedCall(3, handleAudioEnded), 0)
        }

        attachAudioEndedListener()
      },
      onComplete: () => {
        isAnimating.value = false
        emit('animationComplete')
      },
    })

    timeline.timeScale(audioStore.playbackRate)
    return timeline
  }

  const getEl = (refValue: MaybeElement): HTMLElement | null => {
    if (!refValue) return null
    return (
      (refValue as ComponentPublicInstance).$el || (refValue as HTMLElement)
    )
  }

  const animateShowOnlyAnnotation = (
    timeline: gsap.core.Timeline,
    timing: NonNullable<DialogueLine['timings']>[number],
    audioToPlay: string | null | undefined,
    isLastInDialogue: boolean
  ) => {
    const fadeDuration = 0.3
    const textEl = getEl(textRef.value)
    const speakerEl = getEl(speakerRef.value)
    const annotationEl = getEl(annotationRef.value)

    const elementsToHide: HTMLElement[] = []
    if (textEl) elementsToHide.push(textEl)
    if (speakerEl) elementsToHide.push(speakerEl)

    if (elementsToHide.length > 0) {
      timeline.set(elementsToHide, { transition: 'none' }, timing.start)
      timeline.to(elementsToHide, { opacity: 0, duration: 0.2 }, timing.start)
    }

    timeline.call(
      () => {
        currentTimedAnnotation.value = timing.annotation || null
        isShowingOnlyAnnotation.value = true
      },
      [],
      timing.start + 0.2
    )

    if (annotationEl) {
      timeline.set(annotationEl, { transition: 'none' }, timing.start + 0.2)

      timeline.fromTo(
        annotationEl,
        { opacity: 0 },
        { opacity: 1, duration: fadeDuration },
        timing.start + 0.2
      )

      timeline.set(
        [annotationEl, ...elementsToHide],
        { clearProps: 'transition' },
        '>'
      )
    }

    // Transition de sortie
    if (timing.end !== 'end') {
      const effectiveEnd = getEffectiveEnd(
        timing.end,
        timing.start,
        audioToPlay
      )
      const leaveStart = Math.max(
        timing.start + 0.5,
        effectiveEnd - fadeDuration
      )

      if (annotationEl) {
        timeline.to(
          annotationEl,
          { opacity: 0, duration: fadeDuration },
          leaveStart
        )
      }

      // On ne restaure les éléments QUE si ce n'est pas la fin du dialogue
      // sinon ça fait réapparaître la ligne d'avant pendant le gap entre dialogues
      if (elementsToHide.length > 0 && !isLastInDialogue) {
        timeline.to(
          elementsToHide,
          { opacity: 1, duration: fadeDuration },
          leaveStart
        )
        timeline.set(
          elementsToHide,
          { clearProps: 'opacity,transition' },
          '+=0'
        )
      }
    }
  }

  const addAnnotationTiming = (
    timeline: gsap.core.Timeline,
    timing: NonNullable<DialogueLine['timings']>[number],
    audioToPlay: string | null | undefined,
    isLastInDialogue: boolean
  ) => {
    if (timing.showOnly) {
      animateShowOnlyAnnotation(timeline, timing, audioToPlay, isLastInDialogue)
    } else {
      timeline.call(
        () => {
          currentTimedAnnotation.value = timing.annotation || null
          isShowingOnlyAnnotation.value = !!timing.showOnly
        },
        [],
        timing.start
      )
    }

    const effectiveEnd = getEffectiveEnd(timing.end, timing.start, audioToPlay)

    if (timing.end !== 'end') {
      timeline.call(
        () => {
          if (currentTimedAnnotation.value === timing.annotation) {
            currentTimedAnnotation.value = null
            isShowingOnlyAnnotation.value = false
          }
          if (isLastInDialogue) {
            console.log(
              'LOG_DEBUG: Last timing (annotation) ended, emitting animationComplete'
            )
            isAnimating.value = false
            emit('animationComplete')
          }
        },
        [],
        effectiveEnd
      )
      return
    }

    timeline.call(
      () => {
        console.log(
          'LOG_DEBUG: Last timing (annotation with end:"end") ended, emitting animationComplete'
        )
        isAnimating.value = false
        emit('animationComplete')
      },
      [],
      effectiveEnd
    )
  }

  const addWordTiming = (
    timeline: gsap.core.Timeline,
    wordEl: HTMLElement,
    timing: NonNullable<DialogueLine['timings']>[number],
    audioToPlay: string | null | undefined
  ) => {
    const effectiveEnd = getEffectiveEnd(timing.end, timing.start, audioToPlay)
    timeline.to(
      wordEl,
      {
        opacity: 1,
        duration: Math.max(0.1, effectiveEnd - timing.start),
        ease: 'none',
      },
      timing.start
    )
  }

  const addChatTiming = (
    timeline: gsap.core.Timeline,
    words: HTMLElement[],
    timing: NonNullable<DialogueLine['timings']>[number],
    audioToPlay: string | null | undefined
  ) => {
    timeline.set(words, { opacity: 1 }, timing.start)
    const effectiveEnd = getEffectiveEnd(timing.end, timing.start, audioToPlay)
    timeline.to({}, { duration: 0.1 }, effectiveEnd - 0.1)
  }

  const addDialogueTimingsToTimeline = (
    timeline: gsap.core.Timeline,
    currentDialogue: DialogueLine,
    words: HTMLElement[],
    timings: NonNullable<DialogueLine['timings']>,
    audioToPlay: string | null | undefined
  ) => {
    let wordIndex = 0

    timings.forEach((timing, index) => {
      const isLastInDialogue = index === timings.length - 1
      if (timing.annotation) {
        addAnnotationTiming(timeline, timing, audioToPlay, isLastInDialogue)
        return
      }

      if (!currentDialogue.isChat) {
        const wordEl = words[wordIndex]
        if (wordEl) {
          addWordTiming(timeline, wordEl, timing, audioToPlay)
          wordIndex++
        }
        return
      }

      addChatTiming(timeline, words, timing, audioToPlay)
      wordIndex++
    })

    const lastTiming = timings[timings.length - 1]
    const isEndingInShowOnly =
      lastTiming?.annotation &&
      lastTiming?.showOnly &&
      lastTiming?.end === 'end'

    if (
      wordIndex < words.length &&
      !isEndingInShowOnly &&
      !currentDialogue.isChat
    ) {
      timeline.to(
        words.slice(wordIndex),
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.03,
          ease: 'power2.out',
        },
        '>'
      )
    }
  }

  const syncTimelineWithCurrentAudio = (
    timeline: gsap.core.Timeline,
    audioToPlay: string | null | undefined
  ) => {
    if (!audioStore.currentAudio) return

    const currentItem = audioStore.list.find(
      (item) => item.audio === audioStore.currentAudio
    )

    if (audioToPlay && currentItem) {
      if (areAudioPathsEquivalent(audioToPlay, currentItem.path)) {
        const currentTime = audioStore.currentAudio.currentTime || 0
        if (currentTime > 0) {
          console.log(
            'LOG_DEBUG: Syncing timeline to audio position:',
            currentTime
          )
          timeline.seek(currentTime, false)
        }
      }
    } else if (isInIntroAnimation.value) {
      const currentTime = audioStore.currentAudio.currentTime || 0
      timeline.seek(currentTime, false)
    }

    audioStore.currentAudio.removeEventListener('ended', handleAudioEnded)
    audioStore.currentAudio.addEventListener('ended', handleAudioEnded)
  }

  const animateWords = async () => {
    clearPendingTimers()

    const currentDialogue = dialogue.value
    if (
      !currentDialogue ||
      (!split.words.value?.length && !currentDialogue.timings?.length)
    ) {
      emit('animationComplete')
      return
    }

    if (waitForAudioStoreReady()) return

    isAnimating.value = true
    const audioToPlay = sceneAudio.value
    console.log('LOG_DEBUG: animateWords starting. Scene Audio:', audioToPlay)

    const timings = currentDialogue.timings
    const words = split.words.value || []

    activeTimeline.value?.kill()
    clearFallbackTimer()

    const wordTimeline = createWordTimeline(audioToPlay)
    activeTimeline.value = wordTimeline

    if (currentDialogue.isChat && (!timings || timings.length === 0)) {
      wordTimeline.set(words, { opacity: 1 }, 0)
    }

    if (timings && timings.length > 0) {
      addDialogueTimingsToTimeline(
        wordTimeline,
        currentDialogue,
        words,
        timings,
        audioToPlay
      )
    } else if (words.length > 0 && !currentDialogue.isChat) {
      wordTimeline.to(words, {
        opacity: 1,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.out',
      })
    }

    syncTimelineWithCurrentAudio(wordTimeline, audioToPlay)

    if (gameStore.isMenuOpen) {
      wordTimeline.pause()
    }
  }

  watch(
    () => gameStore.isMenuOpen,
    (isOpen) => {
      if (isOpen) {
        activeTimeline.value?.pause()
      } else {
        activeTimeline.value?.resume()
      }
    }
  )

  onUnmounted(() => {
    isDisposed = true
    clearPendingTimers()
    activeTimeline.value?.kill()
    if (audioStore.currentAudio) {
      ;(audioStore.currentAudio as HTMLAudioElement).removeEventListener(
        'ended',
        handleAudioEnded
      )
    }
  })

  return {
    isAnimating,
    activeTimeline,
    currentTimedAnnotation,
    isShowingOnlyAnnotation,
    animateWords,
  }
}
