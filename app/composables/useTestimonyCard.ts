import type { AudioItem } from '@/app/stores/audio'

export function useTestimonyCard(props: {
  content?: string
  author?: string
  audio?: string
  color?: string
}) {
  const { $gsap: gsap } = useNuxtApp()
  const audioStore = useAudioStore()

  const containerRef = useTemplateRef<HTMLElement>('containerRef')
  const borderRect = useTemplateRef<SVGRectElement>('borderRect')
  const textRef = useTemplateRef<HTMLElement>('textRef')
  const auroraRef = useTemplateRef<HTMLElement>('auroraRef')
  const auroraInnerRef = useTemplateRef<HTMLElement>('auroraInnerRef')

  const isHovering = ref(false)

  const isPlaying = computed(
    () =>
      audioStore.isPlaying &&
      props.audio &&
      audioStore.currentAudio?.src.includes(props.audio)
  )

  const timings = computed(() => {
    return (
      audioStore.list.find((item: AudioItem) => item.path === props.audio)
        ?.timings ?? []
    )
  })
  const duration = computed(() => {
    const d = audioStore.list.find(
      (item: AudioItem) => item.path === props.audio
    )?.duration
    return d || 5 // Fallback to 5s if no duration found
  })

  let currentAnimation: gsap.core.Tween | null = null
  let splitInstance: ReturnType<typeof useSplitText> | null = null
  let textAnimation: gsap.core.Tween | gsap.core.Timeline | null = null
  let auroraAnimation: gsap.core.Tween | null = null

  onMounted(() => {
    if (textRef.value) {
      splitInstance = useSplitText(textRef, {
        splitBy: 'words',
      })
    }

    // Set initial Aurora color
    if (props.color && auroraInnerRef.value) {
      const style = getComputedStyle(document.documentElement)
      const colorHex = style
        .getPropertyValue(`--color-gradient-${props.color}`)
        .trim()
      if (colorHex) {
        auroraInnerRef.value.style.setProperty(
          '--aurora-middle-color',
          colorHex
        )
      }
    }

    // Start Aurora floating animation
    if (auroraInnerRef.value) {
      auroraAnimation = gsap.to(auroraInnerRef.value, {
        xPercent: 15,
        yPercent: 20,
        rotation: 10,
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: false, // Always floating
      })
    }

    // Initialize border
    if (borderRect.value) {
      const length = borderRect.value.getTotalLength()
      gsap.set(borderRect.value, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      })
    }
  })

  const handleHover = async (val: boolean) => {
    isHovering.value = val
    if (val) {
      if (props.audio) {
        // Set volume to 0.6 for testimonies
        audioStore.setVolume(0.6)
        await audioStore.playAudio(props.audio)
      }
    } else {
      if (isPlaying.value) {
        await audioStore.stopCurrentAudio()
        // Reset volume to default 0.8
        audioStore.setVolume(0.8)
      }
    }
  }

  const startAnimations = () => {
    // Kill all ongoing animations
    if (currentAnimation) {
      currentAnimation.kill()
    }
    if (textAnimation) {
      textAnimation.kill()
    }

    // Border animation
    if (borderRect.value) {
      const length = borderRect.value.getTotalLength()
      // Reset to start
      gsap.set(borderRect.value, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      })

      currentAnimation = gsap.to(borderRect.value, {
        strokeDashoffset: 0,
        duration: duration.value,
        ease: 'none',
      })
    }

    // Text opacity animations (Karaoke effect)
    if (splitInstance?.words.value) {
      // Immediately dim all words to inactive state
      gsap.to(splitInstance.words.value, {
        opacity: 0.6,
        duration: 0.3,
        ease: 'power2.out',
      })

      const timeline = gsap.timeline()
      splitInstance.words.value.forEach(
        (wordEl: HTMLElement, index: number) => {
          const timing = timings.value[index]
          if (timing) {
            // Animate word to full opacity when it's spoken
            timeline.to(
              wordEl,
              {
                opacity: 1,
                duration: 0.1, // Quick transition to active
                ease: 'none',
              },
              timing.start
            )
          }
        }
      )
      textAnimation = timeline
    }
  }

  const stopAnimations = () => {
    // Border animation
    if (borderRect.value) {
      const length = borderRect.value.getTotalLength()
      currentAnimation = gsap.to(borderRect.value, {
        strokeDashoffset: length,
        duration: 1,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(borderRect.value, {
            opacity: 0,
            duration: 0.3,
          })
        },
      })
    }

    // Reset text opacity
    if (splitInstance?.words.value) {
      gsap.killTweensOf(splitInstance.words.value)
      textAnimation = gsap.to(splitInstance.words.value, {
        opacity: 0.6,
        duration: 0.4,
        stagger: {
          each: 0.01,
          from: 'start',
        },
        ease: 'power2.out',
      })
    }
  }

  // Handle Aurora visibility separately for immediate feedback
  watch(isHovering, (hovering) => {
    if (auroraRef.value) {
      gsap.to(auroraRef.value, {
        opacity: hovering ? 1 : 0,
        duration: 1,
        ease: 'power2.inOut',
      })
    }
  })

  watch(isPlaying, (playing) => {
    if (playing) {
      startAnimations()
    } else {
      stopAnimations()
    }
  })

  onUnmounted(() => {
    if (splitInstance) {
      splitInstance.revert()
    }
    if (props.audio && isPlaying.value) {
      audioStore.stopCurrentAudio()
      audioStore.setVolume(0.8)
    }
    if (auroraAnimation) {
      auroraAnimation.kill()
    }
  })

  return {
    isHovering,
    handleHover,
    containerRef,
    borderRect,
    textRef,
    auroraRef,
    auroraInnerRef,
  }
}
