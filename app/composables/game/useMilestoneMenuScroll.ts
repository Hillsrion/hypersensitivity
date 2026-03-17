import { horizontalLoop } from '../../utils/gsap'

export function useMilestoneMenuScroll(
  itemsRef: Ref<HTMLElement[]>,
  isOpen: Ref<boolean>
) {
  const { $gsap } = useNuxtApp()
  let loopTimeline: gsap.core.Timeline | null = null

  // Drag / Touch Support
  let isDragging = false
  let startX = 0
  let startProgress = 0
  let dragVelocity = 0
  let lastX = 0
  let lastTime = 0

  const onPointerDown = (e: PointerEvent) => {
    if (!loopTimeline) return
    isDragging = true
    startX = e.clientX
    lastX = e.clientX
    lastTime = Date.now()
    startProgress = loopTimeline.progress()
    loopTimeline.pause()
    dragVelocity = 0
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || !loopTimeline) return

    const now = Date.now()
    const dt = now - lastTime
    const dx = e.clientX - lastX

    if (dt > 0) {
      dragVelocity = dx / dt // px/ms
    }

    lastX = e.clientX
    lastTime = now

    const totalDeltaX = e.clientX - startX
    // Map pixels to progress. Negative deltaX = forward progress (scroll left)
    const progressDelta = -totalDeltaX / (window.innerWidth * 2)

    let newProgress = startProgress + progressDelta
    // Wrap progress for infinite loop
    newProgress = newProgress - Math.floor(newProgress)

    loopTimeline.progress(newProgress)
  }

  const onPointerUp = (_e: PointerEvent) => {
    if (!isDragging || !loopTimeline) return
    isDragging = false

    // Calculate flick direction and apply inertia
    if (Math.abs(dragVelocity) > 0.2) {
      const direction = dragVelocity < 0 ? 1 : -1
      const speed = Math.min(Math.abs(dragVelocity) * 3, 5) // cap speed multiplier
      loopTimeline.timeScale(direction * speed)
      loopTimeline.play()

      $gsap.to(loopTimeline, {
        timeScale: 1,
        duration: 1.5,
        ease: 'power2.out',
      })
    } else {
      loopTimeline.timeScale(1)
      loopTimeline.play()
    }
  }

  const stopLoop = (clearPositions = true) => {
    if (loopTimeline) {
      loopTimeline.kill()
      loopTimeline = null
    }
    if (clearPositions && itemsRef.value) {
      $gsap.set(itemsRef.value, { clearProps: 'xPercent,x' })
    }
  }

  const startLoop = () => {
    if (!itemsRef.value || itemsRef.value.length === 0) return

    const items = itemsRef.value
    const container = items[0]?.parentElement
    if (!container) return

    // Only start loop if content overflows
    const totalItemWidth = Array.from(items).reduce(
      (sum, el) => sum + el.offsetWidth,
      0
    )
    const viewportWidth = window.innerWidth

    if (totalItemWidth > viewportWidth) {
      loopTimeline = horizontalLoop($gsap, items, {
        speed: 0.5,
        repeat: -1,
        wrapBuffer: 200,
      })
    }
  }

  const handleResize = () => {
    if (!isOpen.value) return
    stopLoop()
    nextTick(() => startLoop())
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    stopLoop()
  })

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    startLoop,
    stopLoop,
  }
}
