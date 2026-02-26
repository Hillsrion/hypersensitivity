export const useCustomCursor = () => {
  const cursorRef = useTemplateRef<HTMLElement>('cursorRef')
  const mouseX = ref(0)
  const mouseY = ref(0)
  const cursorX = ref(0)
  const cursorY = ref(0)

  let rafId: number | null = null
  let isAnimating = false

  const onMouseMove = (e: MouseEvent) => {
    mouseX.value = e.clientX
    mouseY.value = e.clientY

    if (!isAnimating) {
      isAnimating = true
      animate()
    }
  }

  const animate = () => {
    if (!cursorRef.value) {
      isAnimating = false
      return
    }

    // Calculate the difference
    const dx = mouseX.value - cursorX.value
    const dy = mouseY.value - cursorY.value

    // Apply inertia with easing (adjust the factor for more/less inertia)
    // Lower factor = more inertia (slower follow)
    cursorX.value += dx * 0.08
    cursorY.value += dy * 0.08

    // Update cursor position
    cursorRef.value.style.transform = `translate(${cursorX.value}px, ${cursorY.value}px) translate(-50%, -50%)`

    // Continue animation if there's still movement (more precise threshold)
    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      rafId = requestAnimationFrame(animate)
    } else {
      // Snap to final position when very close
      cursorX.value = mouseX.value
      cursorY.value = mouseY.value
      cursorRef.value.style.transform = `translate(${cursorX.value}px, ${cursorY.value}px) translate(-50%, -50%)`
      isAnimating = false
    }
  }

  onMounted(() => {
    const isDesktop = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches
    if (!isDesktop) return

    document.addEventListener('mousemove', onMouseMove)

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
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
    isAnimating = false
  })

  return {
    cursorRef,
  }
}
