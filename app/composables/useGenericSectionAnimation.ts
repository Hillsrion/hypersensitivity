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

  let visibilityTimeout: ReturnType<typeof setTimeout> | null = null

  const setAuroraColorSafe = () => {
    animationsStore.setAuroraColor(getColor())
  }

  const setAuroraVisibilitySafe = (visible: boolean) => {
    if (visibilityTimeout) {
      clearTimeout(visibilityTimeout)
      visibilityTimeout = null
    }
    animationsStore.setAuroraVisibility(visible)
  }

  onMounted(() => {
    if (!containerRef.value || !titleWrapperRef.value || !contentRef.value)
      return

    const mm = $gsap.matchMedia()

    mm.add('(min-width: 360px)', () => {
      // Helper to calculate minScale based on viewport width
      const getMinScale = () => {
        const width = window.innerWidth
        if (width <= 360) return 0.65
        if (width >= 1280) return 0.46
        // Linear interpolation between 0.65 (mobile) and 0.46 (desktop)
        return 0.65 - ((width - 360) * (0.65 - 0.46)) / (1280 - 360)
      }

      const getOffset = () => (window.innerWidth < 768 ? 32 : 62)

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
        const offset = getOffset()
        let contentHeight = contentRef.value!.offsetHeight
        const minMargin = 32

        // 2. Default preferred start top (18% on desktop, 10% on mobile/tablet or landscape tablets)
        const preferredStartTopPercent =
          window.innerWidth < 1024 || window.innerHeight < 900 ? 0.1 : 0.18
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
          onToggle: (self) => {
            console.log(
              `[useGenericSection] onToggle isActive=${self.isActive}, direction=${self.direction}`
            )
            if (self.isActive && self.direction === -1) {
              // When entering from the bottom (scrolling backwards up into the section)
              setAuroraColorSafe()
              setAuroraVisibilitySafe(true)
            } else if (!self.isActive) {
              setAuroraVisibilitySafe(false)
            }
          },
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
        { backgroundColor: 'rgba(255, 255, 255, 0)' },
        '<'
      )

      // Trigger aurora when title loses background
      tl.to(
        {},
        {
          duration: 0.01,
          onComplete: () => {
            setAuroraColorSafe()
            setAuroraVisibilitySafe(true)
          },
          onReverseComplete: () => {
            setAuroraVisibilitySafe(false)
          },
        },
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
          const offset = getOffset()
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
            const offset = getOffset()
            return scaledHeight + offset
          },
          duration: 6,
          ease: 'power2.inOut',
        },
        '<'
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

      tl.to(
        {},
        { duration: 4.25 + (calculateStartTop() / window.innerHeight) * 13 },
        '>'
      )
    })
  })

  onUnmounted(() => {
    if (visibilityTimeout) {
      clearTimeout(visibilityTimeout)
    }
  })
}
