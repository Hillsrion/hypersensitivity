export const useAuroraAnimation = (auroraInnerRef: Ref<HTMLElement | null>) => {
  const { $gsap } = useNuxtApp()
  const animationsStore = useAnimationsStore()

  const forceRgb = (color: string) => {
    if (color.startsWith('rgb')) return color
    let c = color.trim().replace('#', '')
    if (c.length === 3)
      c = c
        .split('')
        .map((x) => x + x)
        .join('')
    const r = parseInt(c.slice(0, 2), 16) || 0
    const g = parseInt(c.slice(2, 4), 16) || 0
    const b = parseInt(c.slice(4, 6), 16) || 0
    return `rgb(${r}, ${g}, ${b})`
  }

  const auroraSteps = {
    1: ['#C6FFE9', '#A2CCFD'].map(forceRgb),
    2: ['#A2CCFD', '#DECAFE'].map(forceRgb),
    3: ['#DECAFE', '#FFB8E4'].map(forceRgb),
    4: ['#FFB8E4', '#FFC1C3'].map(forceRgb),
    5: ['#FFC1C3', '#FAC087'].map(forceRgb),
    6: ['#FAC087', '#FDEDB3'].map(forceRgb),
    7: ['#FAC087', '#FDEDB3'].map(forceRgb),
    8: ['#FDEDB3', '#C6FFE9'].map(forceRgb),
    9: ['#C6FFE9', '#A2CCFD'].map(forceRgb),
  }

  onMounted(() => {
    const style = getComputedStyle(document.documentElement)

    // Use the current store color, not always green. This prevents showing
    // the wrong color if the store was already updated before mount.
    const storeColor = animationsStore.aurora.color || 'green'
    let initialHex = style
      .getPropertyValue(`--color-gradient-${storeColor}`)
      .trim()
    if (!initialHex) {
      const colorMap: Record<string, string> = {
        red: '#ffc1c3',
        pink: '#ffb8e4',
        blue: '#a2ccfd',
        green: '#c6ffe9',
        yellow: '#fdedb3',
        violet: '#decafe',
        white: '#FFFFFF',
      }
      initialHex = colorMap[storeColor] || '#c6ffe9'
    }

    if (auroraInnerRef.value) {
      console.log(
        `[AuroraAnim] Initial color from store: ${storeColor} -> ${initialHex} -> rgb: ${forceRgb(initialHex)}`
      )
      auroraInnerRef.value.style.setProperty(
        '--aurora-color-1',
        forceRgb(initialHex)
      )
      auroraInnerRef.value.style.setProperty(
        '--aurora-color-2',
        forceRgb(initialHex)
      )

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
    () => animationsStore.aurora.visible,
    (isVisible) => {
      if (isVisible) {
        // CRITICAL: When becoming visible, synchronously set the current color
        // on the DOM element BEFORE the CSS opacity transition starts rendering.
        // Vue's watcher ordering is non-deterministic, so the color watcher
        // might not have fired yet.
        if (auroraInnerRef.value) {
          const currentColor = animationsStore.aurora.color
          if (
            currentColor &&
            currentColor !== 'aurora' &&
            currentColor !== 'rainbow'
          ) {
            const style = getComputedStyle(document.documentElement)
            let hex = style
              .getPropertyValue(`--color-gradient-${currentColor}`)
              .trim()
            if (!hex) {
              const colorMap: Record<string, string> = {
                red: '#ffc1c3',
                pink: '#ffb8e4',
                blue: '#a2ccfd',
                green: '#c6ffe9',
                yellow: '#fdedb3',
                violet: '#decafe',
                white: '#FFFFFF',
              }
              hex = colorMap[currentColor] || ''
            }
            if (hex) {
              const rgb = forceRgb(hex)
              console.log(
                `[AuroraAnim] Pre-visibility color sync: ${currentColor} -> ${rgb}`
              )
              $gsap.killTweensOf(
                auroraInnerRef.value,
                '--aurora-color-1,--aurora-color-2'
              )
              auroraInnerRef.value.style.setProperty('--aurora-color-1', rgb)
              auroraInnerRef.value.style.setProperty('--aurora-color-2', rgb)
            }
          }
        }
      }
    },
    { immediate: true }
  )

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
        const parentEl = auroraInnerRef.value.parentElement
        const currentOpacity = parentEl
          ? parseFloat(getComputedStyle(parentEl).opacity)
          : 0
        const isCurrentlyVisible = animationsStore.aurora.visible
        const colorRgb = forceRgb(newHex)

        console.log(
          `[AuroraAnim] Color change: ${newColor} -> ${colorRgb}, visible=${isCurrentlyVisible}, opacity=${currentOpacity}`
        )

        if (isCurrentlyVisible && currentOpacity > 0.1) {
          // Aurora is already visually on screen — smooth GSAP transition
          $gsap.to(auroraInnerRef.value, {
            '--aurora-color-1': colorRgb,
            '--aurora-color-2': colorRgb,
            duration: 2,
            ease: 'power2.inOut',
          })
        } else {
          // Aurora is invisible or just about to fade in.
          // CRITICAL: use synchronous style.setProperty, NOT gsap.set or gsap.to(duration:0)
          // because GSAP defers even duration:0 tweens to the next frame,
          // and the CSS opacity transition has already started on THIS frame.
          $gsap.killTweensOf(
            auroraInnerRef.value,
            '--aurora-color-1,--aurora-color-2'
          )
          auroraInnerRef.value.style.setProperty('--aurora-color-1', colorRgb)
          auroraInnerRef.value.style.setProperty('--aurora-color-2', colorRgb)
        }
      }
    }
  )
}
