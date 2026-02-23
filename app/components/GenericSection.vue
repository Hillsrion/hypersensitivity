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
    const totalHeight = window.innerHeight
    const maxDistance = totalHeight * 0.525 // The bottom-most position
    const minScale = 0.46

    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 18%',
        pin: true,
        end: '+=400%',
        scrub: 1,
        invalidateOnRefresh: true, // Handle resize better
        onEnter: setAuroraColorSafe,
        onEnterBack: setAuroraColorSafe,
      },
    })

    // Phase 1: Fan Out
    // Top (0) stays, Bottom (8) moves to maxDistance.
    tl.to(
      titlesRef.value,
      {
        y: (index) => {
          if (index === 0) return 0
          return maxDistance * (index / (titlesRef.value.length - 1))
        },
        scale: (index) => {
          const total = titlesRef.value.length
          if (total <= 1) return 1
          return 1 - (index / (total - 1)) * (1 - minScale)
        },
        duration: 4,
        ease: 'power2.out',
      },
      'fanOut'
    )

    // Phase 2: Collapse Down
    // All titles move to maxDistance and minScale.
    tl.to(
      titlesRef.value,
      {
        y: maxDistance,
        scale: minScale,
        duration: 6,
        ease: 'power2.inOut',
      },
      '>'
    )

    // After Phase 2: Hide all but last, and remove bg-white
    tl.set(titlesRef.value.slice(0, -1), { autoAlpha: 0 })
    tl.set(
      titlesRef.value.map((el) => el.querySelector('span')),
      { backgroundColor: 'transparent' },
      '<'
    )

    // Phase 3: Move pack to top
    const lastTitle = titlesRef.value[titlesRef.value.length - 1]
    const scaledHeight = lastTitle.offsetHeight * minScale
    const offset = 62 // 2rem offset

    // Set initial position for content before moving up (at the bottom)
    tl.set(contentRef.value, { y: maxDistance + scaledHeight + offset })
    tl.set(titlesRef.value.slice(0, -1), { autoAlpha: 0 })
    tl.set(
      titlesRef.value.map((el) => el.querySelector('span')),
      { backgroundColor: 'transparent' },
      '<'
    )
    tl.to(
      titlesRef.value,
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
        y: scaledHeight + offset,
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
    // Content fades in later during the move up
    const listItems = contentRef.value.querySelectorAll('li')
    tl.to(
      listItems,
      { opacity: 1, duration: 1, ease: 'power2.out', stagger: 0.1 },
      'moveUp+=2'
    )

    // Phase 5: Fade Out
    // Fade out only after the moveUp phase is complete (duration was 6)
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

    // Pause finale : les animations se terminent à ~80% de la timeline
    // Durée totale des animations: ~17 unités (16 + 0.5 fade out)
    // Pour 80% de timeline: 17 / 0.8 = ~21.25 unités
    // Pause nécessaire: ~4.25 unités (20% de la timeline)
    // Position: juste après le fade out (">" = immédiatement après la dernière animation)
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
      class="relative w-full flex justify-center z-10 px-4 md:px-0"
    >
      <AppHeading
        v-for="i in 9"
        :key="i"
        ref="titlesRef"
        as="p"
        variant="display"
        class="absolute top-0 w-full font-serif font-light text-center origin-top select-none text-primary"
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
