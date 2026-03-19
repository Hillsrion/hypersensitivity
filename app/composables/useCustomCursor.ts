export const useCustomCursor = () => {
  const cursorRef = useTemplateRef<HTMLElement>('cursorRef')
  const mouseX = ref(0)
  const mouseY = ref(0)
  const cursorX = ref(0)
  const cursorY = ref(0)

  const animationsStore = useAnimationsStore()
  const route = useRoute()

  const isReady = computed(() => {
    // If we are in test mode or if the initial title animation is done
    return (
      route.query.test === 'true' ||
      route.path === '/test' ||
      animationsStore.landing.mainTitle.entry.completed
    )
  })

  const isMouseInViewport = ref(false)
  const isVisible = computed(() => isMouseInViewport.value && isReady.value)

  let rafId: number | null = null
  let isAnimating = false

  const onMouseMove = (e: MouseEvent) => {
    mouseX.value = e.clientX
    mouseY.value = e.clientY

    if (!isMouseInViewport.value) {
      isMouseInViewport.value = true
    }

    if (!isAnimating && isReady.value) {
      isAnimating = true
      animate()
    }
  }

  const onMouseEnter = () => {
    isMouseInViewport.value = true
  }

  const onMouseLeave = () => {
    isMouseInViewport.value = false
  }

  const animate = () => {
    if (!cursorRef.value) {
      isAnimating = false
      return
    }

    // Calculate the difference
    const dx = mouseX.value - cursorX.value
    const dy = mouseY.value - cursorY.value

    // Apply inertia with easing
    cursorX.value += dx * 0.08
    cursorY.value += dy * 0.08

    // Update cursor position
    cursorRef.value.style.transform = `translate(${cursorX.value}px, ${cursorY.value}px) translate(-50%, -50%)`

    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      rafId = requestAnimationFrame(animate)
    } else {
      cursorX.value = mouseX.value
      cursorY.value = mouseY.value
      cursorRef.value.style.transform = `translate(${cursorX.value}px, ${cursorY.value}px) translate(-50%, -50%)`
      isAnimating = false
    }
  }

  // Ensure animation starts when coming from loading state
  watch(isReady, (ready) => {
    if (ready && isMouseInViewport.value && !isAnimating) {
      isAnimating = true
      animate()
    }
  })

  onMounted(() => {
    const isDesktop = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches
    if (!isDesktop) return

    document.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseenter', onMouseEnter)
    window.addEventListener('mouseleave', onMouseLeave)

    // Initialize cursor position at center
    cursorX.value = window.innerWidth / 2
    cursorY.value = window.innerHeight / 2
    mouseX.value = window.innerWidth / 2
    mouseY.value = window.innerHeight / 2

    // Initialize cursor position immediately
    nextTick(() => {
      if (cursorRef.value) {
        cursorRef.value.style.transform = `translate(${cursorX.value}px, ${cursorY.value}px) translate(-50%, -50%)`
      }
    })
  })

  onUnmounted(() => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
    isAnimating = false
  })

  return {
    cursorRef,
    isVisible,
  }
}
