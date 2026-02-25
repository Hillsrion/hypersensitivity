export const useAuroraAnimation = (auroraInnerRef: Ref<HTMLElement | null>) => {
  const { $gsap } = useNuxtApp()
  const animationsStore = useAnimationsStore()

  const auroraSteps = {
    1: ['#C6FFE9', '#A2CCFD'],
    2: ['#A2CCFD', '#DECAFE'],
    3: ['#DECAFE', '#FFB8E4'],
    4: ['#FFB8E4', '#FFC1C3'],
    5: ['#FFC1C3', '#FAC087'],
    6: ['#FAC087', '#FDEDB3'],
    7: ['#FAC087', '#FDEDB3'],
    8: ['#FDEDB3', '#C6FFE9'],
    9: ['#C6FFE9', '#A2CCFD'],
  }

  onMounted(() => {
    const style = getComputedStyle(document.documentElement)
    const initialColor =
      style.getPropertyValue('--color-gradient-green').trim() || '#c6ffe9'
    if (auroraInnerRef.value) {
      // Set initial CSS variables so it displays correctly before the watcher ever fires
      auroraInnerRef.value.style.setProperty('--aurora-color-1', initialColor)
      auroraInnerRef.value.style.setProperty('--aurora-color-2', initialColor)

      // Start Breathing Animation immediately
      $gsap.to(auroraInnerRef.value, {
        xPercent: 15,
        yPercent: 20,
        rotation: 10,
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }
  })

  // Watch for specific step changes (from Milestone Menu)
  watch(
    () => animationsStore.aurora.colorStep,
    (step) => {
      const colors = auroraSteps[step as keyof typeof auroraSteps]
      if (colors && auroraInnerRef.value) {
        $gsap.to(auroraInnerRef.value, {
          '--aurora-color-1': colors[0],
          '--aurora-color-2': colors[1],
          duration: 2,
          ease: 'power2.inOut',
        })
      }
    }
  )

  // Consolidated Rainbow/Auto-Animation Logic
  let autoRotateTl: gsap.core.Timeline | null = null

  const startRainbowSequence = () => {
    if (!auroraInnerRef.value) return

    // Kill any existing animation
    if (autoRotateTl) {
      autoRotateTl.kill()
      autoRotateTl = null
    }

    // Phase 1: Entry - Smoothly transition to the start of the loop (Step 1)
    const step1Colors = auroraSteps[1]

    autoRotateTl = $gsap.timeline()

    // Tween to start position
    autoRotateTl.to(auroraInnerRef.value, {
      '--aurora-color-1': step1Colors[0],
      '--aurora-color-2': step1Colors[1],
      duration: 3,
      ease: 'power2.inOut',
    })

    // Phase 2: Infinite Loop
    const loopTl = $gsap.timeline({ repeat: -1 })

    // Add steps 2 through 9 to the loop
    for (let i = 2; i <= 9; i++) {
      const colors = auroraSteps[i as keyof typeof auroraSteps]
      loopTl.to(auroraInnerRef.value, {
        '--aurora-color-1': colors[0],
        '--aurora-color-2': colors[1],
        duration: 3,
        ease: 'linear',
      })
    }

    autoRotateTl.add(loopTl)
  }

  const stopRainbowSequence = () => {
    if (autoRotateTl) {
      autoRotateTl.kill()
      autoRotateTl = null
    }
  }

  const isRainbowMode = computed(() => {
    return (
      animationsStore.aurora.autoAnimate ||
      animationsStore.aurora.color === 'aurora' ||
      animationsStore.aurora.color === 'rainbow'
    )
  })

  watch(
    isRainbowMode,
    (active) => {
      if (active) {
        startRainbowSequence()
      } else {
        stopRainbowSequence()
      }
    },
    { immediate: true }
  )

  watch(
    () => animationsStore.aurora.color,
    (newColor) => {
      if (newColor === 'aurora' || newColor === 'rainbow') return // Handled by isRainbowMode

      const style = getComputedStyle(document.documentElement)
      let newHex = style.getPropertyValue(`--color-gradient-${newColor}`).trim()

      // Fallback map if CSS var is missing
      if (!newHex) {
        const colorMap: Record<string, string> = {
          red: '#ffc1c3',
          pink: '#ffb8e4',
          blue: '#a2ccfd',
          green: '#c6ffe9',
          yellow: '#fdedb3',
          violet: '#decafe',
          white: '#FFFFFF',
        }
        newHex = colorMap[newColor] || ''
      }

      if (newHex && auroraInnerRef.value) {
        const isCurrentlyVisible = animationsStore.aurora.visible

        $gsap.to(auroraInnerRef.value, {
          '--aurora-color-1': newHex,
          '--aurora-color-2': newHex,
          duration: isCurrentlyVisible ? 2 : 0,
          ease: 'power2.inOut',
        })
      }
    }
  )
}
