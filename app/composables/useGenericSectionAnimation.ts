import type { Ref, ComponentPublicInstance } from 'vue'

export function useGenericSectionAnimation(
  getColor: () => string,
  containerRef: Readonly<Ref<HTMLElement | null>>,
  titleWrapperRef: Readonly<Ref<HTMLElement | null>>,
  contentRef: Readonly<Ref<HTMLElement | null>>,
  titlesRef: Readonly<Ref<Array<HTMLElement | ComponentPublicInstance> | null>>
) {
  const { $gsap } = useNuxtApp()
  const animationsStore = useAnimationsStore()

  let lastColorChangeTime = 0
  let visibilityTimeout: ReturnType<typeof setTimeout> | null = null

  const setAuroraColorSafe = () => {
    animationsStore.setAuroraColor(getColor())
    lastColorChangeTime = Date.now()
  }

  const setAuroraVisibilitySafe = (visible: boolean) => {
    if (visibilityTimeout) {
      clearTimeout(visibilityTimeout)
      visibilityTimeout = null
    }

    if (visible) {
      const elapsed = Date.now() - lastColorChangeTime
      const delay = Math.max(0, 2000 - elapsed)
      if (delay > 0) {
        visibilityTimeout = setTimeout(() => {
          animationsStore.setAuroraVisibility(true)
        }, delay)
      } else {
        animationsStore.setAuroraVisibility(true)
      }
    } else {
      animationsStore.setAuroraVisibility(false)
    }
  }

  onMounted(() => {
    if (!containerRef.value || !titleWrapperRef.value || !contentRef.value)
      return

    const mm = $gsap.matchMedia()

    mm.add('(min-width: 375px)', () => {
      // Helper to calculate minScale based on viewport width
      const getMinScale = () => {
        const width = window.innerWidth
        if (width <= 375) return 0.65
        if (width >= 1280) return 0.46
        // Linear interpolation between 0.65 (mobile) and 0.46 (desktop)
        return 0.65 - ((width - 375) * (0.65 - 0.46)) / (1280 - 375)
      }

      // Collect DOM elements from component instances safely
      const titlesEl = (titlesRef.value || [])
        .map((el) =>
          el && '$el' in el ? (el as ComponentPublicInstance).$el : el
        )
        .filter((el): el is HTMLElement => el instanceof HTMLElement)

      if (titlesEl.length === 0) return

      const listItems = contentRef.value!.querySelectorAll('li')

      const calculateStartTop = () => {
        const paragraphs = contentRef.value!.querySelectorAll('p')
        // 1. Reset compact class before measuring to get natural height
        paragraphs.forEach((p) => {
          p.classList.remove('fl-text-sm/base')
        })

        const minScale = getMinScale()
        const lastTitle = titlesEl[titlesEl.length - 1] as HTMLElement
        const scaledHeight = lastTitle.offsetHeight * minScale
        const offset = 62
        let contentHeight = contentRef.value!.offsetHeight
        const minMargin = 32

        // 2. Default preferred start top (18% on desktop, 10% on mobile/tablet)
        const preferredStartTopPercent = window.innerWidth < 1024 ? 0.1 : 0.18
        let startTop = window.innerHeight * preferredStartTopPercent

        const neededHeight =
          startTop + scaledHeight + offset + contentHeight + minMargin

        if (neededHeight > window.innerHeight) {
          // Adjust startTop down to minMargin
          let neededStartTop =
            window.innerHeight -
            (scaledHeight + offset + contentHeight + minMargin)

          if (neededStartTop >= minMargin) {
            startTop = neededStartTop
          } else {
            // Apply compact class directly to the DOM for synchronous measurement
            paragraphs.forEach((p) => {
              p.classList.add('fl-text-sm/base')
            })

            // Re-measure content height now that text is smaller
            contentHeight = contentRef.value!.offsetHeight
            neededStartTop =
              window.innerHeight -
              (scaledHeight + offset + contentHeight + minMargin)

            startTop = Math.max(
              minMargin,
              Math.min(
                window.innerHeight * preferredStartTopPercent,
                neededStartTop
              )
            )
          }
        }
        return startTop
      }

      const tl = $gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: () => `top ${calculateStartTop()}px`,
          pin: true,
          end: '+=400%',
          scrub: 1,
          invalidateOnRefresh: true,
          onEnter: setAuroraColorSafe,
          onEnterBack: setAuroraColorSafe,
        },
      })

      // Phase 1: Fan Out
      tl.to(
        titlesEl,
        {
          y: (index: number) => {
            if (index === 0) return 0
            const maxDistance = window.innerHeight * 0.525
            return maxDistance * (index / (titlesEl.length - 1))
          },
          scale: (index: number) => {
            const total = titlesEl.length
            if (total <= 1) return 1
            const minScale = getMinScale()
            return 1 - (index / (total - 1)) * (1 - minScale)
          },
          duration: 4,
          ease: 'power2.out',
        },
        'fanOut'
      )

      // Phase 2: Collapse Down
      tl.to(
        titlesEl,
        {
          y: () => window.innerHeight * 0.525,
          scale: () => getMinScale(),
          duration: 6,
          ease: 'power2.inOut',
        },
        '>'
      )

      // After Phase 2: Hide all but last, and remove bg-white
      tl.set(titlesEl.slice(0, -1), { autoAlpha: 0 })
      tl.set(
        titlesEl.map((el) => el.querySelector('span')).filter(Boolean),
        { backgroundColor: 'transparent' },
        '<'
      )

      // Phase 3: Move pack to top
      // Set initial position for content before moving up
      tl.set(contentRef.value, {
        y: () => {
          const minScale = getMinScale()
          const lastTitle = titlesEl[titlesEl.length - 1] as HTMLElement
          const scaledHeight = lastTitle.offsetHeight * minScale
          const maxDistance = window.innerHeight * 0.525
          const offset = 62 // 2rem offset
          return maxDistance + scaledHeight + offset
        },
      })

      tl.to(
        titlesEl,
        {
          y: 0,
          duration: 6,
          ease: 'power2.inOut',
        },
        'moveUp'
      )

      // Sync content movement with titles
      tl.to(
        contentRef.value,
        {
          y: () => {
            const minScale = getMinScale()
            const lastTitle = titlesEl[titlesEl.length - 1] as HTMLElement
            const scaledHeight = lastTitle.offsetHeight * minScale
            const offset = 62 // 2rem offset
            return scaledHeight + offset
          },
          duration: 6,
          ease: 'power2.inOut',
        },
        '<'
      )

      // Update Aurora State
      tl.call(
        () => {
          setAuroraVisibilitySafe(true)
        },
        undefined,
        'moveUp'
      )

      // Phase 4: Reveal Content
      tl.to(
        listItems,
        { opacity: 1, duration: 1, ease: 'power2.out', stagger: 0.1 },
        'moveUp+=2'
      )

      // Phase 5: Fade Out
      tl.to(
        containerRef.value,
        {
          autoAlpha: 0,
          duration: 1,
          ease: 'power1.inOut',
        },
        'moveUp+=6'
      )

      tl.call(
        () => {
          setAuroraVisibilitySafe(false)
        },
        undefined,
        'moveUp+=6'
      )

      tl.to({}, { duration: 4.25 }, '>')
    })
  })

  onUnmounted(() => {
    if (visibilityTimeout) {
      clearTimeout(visibilityTimeout)
    }
  })
}
