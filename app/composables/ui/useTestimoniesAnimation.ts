import type { ComponentPublicInstance, Ref } from 'vue'

export function useTestimoniesAnimation(
  sectionRef: Readonly<Ref<HTMLElement | null>>,
  stickyRef: Readonly<Ref<HTMLElement | null>>,
  heroTextRef: Readonly<Ref<ComponentPublicInstance | HTMLElement | null>>,
  trackRef: Readonly<Ref<HTMLElement | null>>,
  firstCardContentRef: Readonly<Ref<HTMLElement | null>>
) {
  const { $gsap } = useNuxtApp()

  onMounted(async () => {
    await nextTick()
    await document.fonts.ready

    // Wait a bit more for the components to be fully ready and measured
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (
      !sectionRef.value ||
      !stickyRef.value ||
      !heroTextRef.value ||
      !trackRef.value ||
      !firstCardContentRef.value
    )
      return

    const heroTextEl =
      heroTextRef.value && '$el' in heroTextRef.value
        ? heroTextRef.value.$el
        : heroTextRef.value
    if (!heroTextEl || !(heroTextEl instanceof HTMLElement)) return

    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    // --- 1. Calculate Geometry ---
    // We calculate the delta between the Big Hero Text and the Small Card Text
    const endRect = firstCardContentRef.value.getBoundingClientRect()

    // Force the Hero Text to have the exact same width as the target text
    // This ensures line breaks (wrapping) are identical.
    heroTextEl.style.width = `${endRect.width}px`

    // Re-measure Hero Text after width adjustment
    const startRect = heroTextEl.getBoundingClientRect()

    // Calculate final position (relative to initial startRect position)
    const finalX = endRect.left - startRect.left
    const finalY = endRect.top - startRect.top

    // Calculate initial offsets
    // We want the text to appear vertically centered on screen initially,
    // but horizontally aligned to its final left position.
    const screenCenterY = window.innerHeight / 2
    const stickyRect = stickyRef.value.getBoundingClientRect()
    const relativeTop = startRect.top - stickyRect.top
    const startCenterY = relativeTop + startRect.height / 2

    const initialX = finalX // Align to final left edge continually
    const initialY = screenCenterY - startCenterY

    // Calculate initial scale. Taking the max of width/height proportion
    // ensures a dramatic zoom effect even on portrait screens (like mobile).
    // The width available starts from the actual left edge where it will be anchored.
    // The width available starts from the actual left edge where it will be anchored.
    // We use the available width to calculate scaleX, making sure it doesn't leak out unreadably if possible
    const scaleX = (window.innerWidth * 0.9) / startRect.width
    const scaleY = (window.innerHeight * 0.8) / startRect.height
    const fitScale = Math.max(scaleX, scaleY)

    // --- 2. Build Timeline ---

    // Set initial state: Scaled up and centered
    tl.set(heroTextEl, {
      scale: fitScale,
      x: initialX,
      y: initialY,
      transformOrigin: 'left center',
      immediateRender: true,
    })

    // Phase A: Move Hero Text to position of Card 1
    // We animate from the "Big Centered" state to the "Small Card" state (scale: 1, x: finalX, y: finalY)
    tl.to(heroTextEl, {
      opacity: 0.6,
      duration: 0.5,
    })
      .to(heroTextEl, {
        x: finalX,
        y: finalY,
        scale: 1,
        transformOrigin: 'left center', // Scale from left edge
        ease: 'power2.inOut',
        duration: 3,
      })
      // Phase B: Swap Visibility (Smoother Cross-fade)
      // As the hero text reaches its final spot, we fade it out while fading in the track and the card content.
      .to(heroTextEl, {
        autoAlpha: 0,
        duration: 0.2, // Quick fade out at the end
        ease: 'power2.inOut',
      })
      .to(
        trackRef.value,
        {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.inOut',
          onUpdate() {
            if (!trackRef.value) return
            const currentOpacity = parseFloat(
              trackRef.value.style.opacity || '0'
            )
            trackRef.value.style.pointerEvents =
              currentOpacity > 0.9 ? 'auto' : 'none'
          },
        },
        '<'
      )
      .to(
        firstCardContentRef.value,
        {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.inOut',
        },
        '<'
      )

    // Phase C: Horizontal Scroll
    // Move the track to the left until it completely leaves the screen
    tl.to(trackRef.value, {
      x: () => -trackRef.value!.scrollWidth,
      ease: 'none', // Linear movement for scroll sync
      duration: 10,
    })
  })
}
