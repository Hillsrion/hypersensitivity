<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Array,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
})

const { $gsap } = useNuxtApp()
const animationsStore = useAnimationsStore()
const containerRef = useTemplateRef('containerRef')
const titleWrapperRef = useTemplateRef('titleWrapperRef')
const contentRef = useTemplateRef('contentRef')
// We will have one "main" title and duplicates.
// Let's create an array for the titles to animate.
const titlesRef = useTemplateRef('titlesRef')

let lastColorChangeTime = 0
let visibilityTimeout = null

const setAuroraColorSafe = () => {
  animationsStore.setAuroraColor(props.color)
  lastColorChangeTime = Date.now()
}

const setAuroraVisibilitySafe = (visible) => {
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
  if (!containerRef.value || !titleWrapperRef.value) return

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
      .map((el) => (el && '$el' in el ? el.$el : el))
      .filter((el) => el instanceof HTMLElement)

    if (titlesEl.length === 0) return

    const listItems = contentRef.value.querySelectorAll('li')

    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 18%',
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
        y: (index) => {
          if (index === 0) return 0
          const maxDistance = window.innerHeight * 0.525
          return maxDistance * (index / (titlesEl.length - 1))
        },
        scale: (index) => {
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
        const lastTitle = titlesEl[titlesEl.length - 1]
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
          const lastTitle = titlesEl[titlesEl.length - 1]
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
      null,
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
      null,
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
</script>

<template>
  <section
    ref="containerRef"
    class="h-[400svh] w-full relative overflow-hidden flex flex-col items-center justify-start z-10"
  >
    <!-- Title Wrapper: Holds the stack of titles -->

    <div
      ref="titleWrapperRef"
      class="relative w-full grid place-items-center z-10 px-4 md:px-0"
    >
      <AppHeading
        v-for="i in 9"
        :key="i"
        ref="titlesRef"
        as="p"
        variant="display"
        class="col-start-1 row-start-1 w-full font-serif font-light text-center origin-top select-none text-primary"
        :class="{
          'z-10': i === 1,
          'z-20': i > 1,
          'leading-[1.13]': i < 3,
          'leading-[1.2]': i < 5,
          'leading-[1.28]': i > 5,
        }"
        aria-hidden="true"
      >
        <span
          class="bg-white max-w-7xl mx-auto py-[0.2em] px-[0.2em] [box-decoration-break:clone]"
          >{{ title }}</span
        >
      </AppHeading>

      <span class="sr-only">{{ title }}</span>
    </div>

    <!-- Content Paragraphs -->
    <div ref="contentRef" class="absolute top-0 w-full max-w-lg px-6 z-30">
      <ul class="flex flex-col gap-y-6">
        <li v-for="(item, index) in content" :key="index" class="opacity-0">
          <!-- Start hidden for GSAP to control -->

          <AppText
            as="p"
            variant="body"
            class="text-primary/60 font-sans font-light"
          >
            {{ item }}
          </AppText>
        </li>
      </ul>
    </div>
  </section>
</template>
