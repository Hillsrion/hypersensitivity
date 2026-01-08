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
});

const { $gsap } = useNuxtApp();
const containerRef = ref(null);
const titleWrapperRef = ref(null);
const contentRef = ref(null);
// We will have one "main" title and duplicates.
// Let's create an array for the titles to animate.
const titlesRef = ref([]);

onMounted(() => {
  if (!containerRef.value || !titleWrapperRef.value) return;

  const mm = $gsap.matchMedia();

  mm.add("(min-width: 375px)", () => {
    const totalHeight = window.innerHeight;

    const maxDistance = totalHeight * 0.625; // The bottom-most position
    const minScale = 0.46;

    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top top",
        pin: true,
        end: "+=400%",
        scrub: 1,
        invalidateOnRefresh: true, // Handle resize better
      },
    });

    // Phase 1: Fan Out
    // Top (0) stays, Bottom (8) moves to maxDistance.
    tl.to(
      titlesRef.value,
      {
        y: (index) => {
          if (index === 0) return 0;
          return maxDistance * (index / (titlesRef.value.length - 1));
        },
        scale: (index) => {
          const total = titlesRef.value.length;
          if (total <= 1) return 1;
          return 1 - (index / (total - 1)) * (1 - minScale);
        },
        duration: 4,
        ease: "power2.out",
      },
      "fanOut"
    );

    // Phase 2: Collapse Down
    // All titles move to maxDistance and minScale.
    tl.to(
      titlesRef.value,
      {
        y: maxDistance,
        scale: minScale,
        duration: 6,
        ease: "power2.inOut",
      },
      ">"
    );

    // Phase 3: Move pack to top
    const firstTitle = titlesRef.value[0];
    const scaledHeight = firstTitle.offsetHeight * minScale;
    const offset = 124; // 2rem offset

    // Set initial position for content before moving up (at the bottom)
    tl.set(contentRef.value, { y: maxDistance + scaledHeight + offset });

    tl.to(
      titlesRef.value,
      {
        y: 0,
        duration: 6,
        ease: "power2.inOut",
      },
      "moveUp"
    );

    // Sync content movement with titles
    tl.to(
      contentRef.value,
      {
        y: scaledHeight + offset,
        duration: 6,
        ease: "power2.inOut",
      },
      "<"
    );

    // Phase 4: Reveal Content
    // Content fades in later during the move up
    const listItems = contentRef.value.querySelectorAll("li");
    tl.to(
      listItems,
      { opacity: 1, duration: 1, ease: "power2.out", stagger: 0.1 },
      "moveUp+=2"
    );

    // Phase 5: Fade Out
    // Fade out only after the moveUp phase is complete (duration was 6)
    tl.to(
      containerRef.value,
      {
        opacity: 0,
        ease: "power1.inOut",
      },
      "moveUp+=6"
    );
  });
});
</script>

<template>
  <section
    ref="containerRef"
    class="h-[400svh] w-full relative overflow-hidden flex flex-col items-center justify-start pt-19 z-10"
  >
    <!-- Title Wrapper: Holds the stack of titles -->

    <div
      ref="titleWrapperRef"
      class="relative w-full flex justify-center z-10 px-4 md:px-0"
    >
      <p
        v-for="i in 9"
        :key="i"
        ref="titlesRef"
        class="absolute top-0 w-full flex text-5xl md:text-[7.5rem] font-serif font-light text-center origin-top select-none text-primary"
        :class="{
          'z-10': i === 1,
          'z-20': i > 1,
          'leading-[1.13]': i < 3,
          'leading-[1.2]': i < 5,
          'leading-[1.28]': i > 5,
        }"
        aria-hidden="true"
      >
        <span class="bg-white max-w-7xl mx-auto">{{ title }}</span>
      </p>

      <span class="sr-only">{{ title }}</span>
    </div>

    <!-- Content Paragraphs -->
    <div ref="contentRef" class="absolute top-0 w-full max-w-lg px-6 z-30">
      <ul class="flex flex-col gap-y-6">
        <li v-for="(item, index) in content" :key="index" class="opacity-0">
          <!-- Start hidden for GSAP to control -->

          <p
            class="text-xl text-primary/60 font-satoshi font-light leading-[1.4]"
          >
            {{ item }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

  