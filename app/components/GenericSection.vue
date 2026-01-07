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
    const minScale = 0.4;

    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top top",
        pin: true,
        end: "+=200%", // Increased scroll distance
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
          return 1 - (index / (total - 1)) * 0.6;
        },
        duration: 5,
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
        duration: 5,
        ease: "power2.inOut",
      },
      ">"
    );

    // Phase 3: Move pack to top
    tl.to(
      titlesRef.value,
      {
        y: 0,
        duration: 5,
        ease: "power2.inOut",
      },
      ">"
    );

    // Phase 4: Reveal Content
    // Content fades in after titles are back at top
    const listItems = contentRef.value.querySelectorAll("li");
    tl.to(listItems, { opacity: 1, duration: 1, ease: "power2.out" }, ">");

    // Phase 5: Fade Out
    tl.to(
      containerRef.value,
      {
        opacity: 0,
        ease: "power1.inOut",
      },
      ">"
    );
  });
});
</script>

<template>
  <section
    ref="containerRef"
    class="h-[300svh] w-full relative overflow-hidden flex flex-col items-center justify-start pt-19 z-10"
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
        class="absolute top-0 w-full flex text-5xl md:text-[7.5rem] leading-[1.13] font-serif font-light text-center origin-top select-none text-primary"
        :class="{ 'z-20': i === 1, 'z-10': i > 1 }"
        aria-hidden="true"
      >
        <span class="bg-white max-w-7xl mx-auto">{{ title }}</span>
      </p>

      <span class="sr-only">{{ title }}</span>
    </div>

    <!-- Content Paragraphs -->
    <div
      ref="contentRef"
      class="absolute top-0 w-full max-w-lg px-6 z-30 text-center"
    >
      <ul class="flex flex-col gap-y-6">
        <li v-for="(item, index) in content" :key="index" class="opacity-0">
          <!-- Start hidden for GSAP to control -->

          <p
            class="text-xl md:text-2xl text-primary font-satoshi font-light leading-relaxed"
          >
            {{ item }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

  