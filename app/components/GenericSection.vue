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
    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top top",
        end: "+=200%", // Scroll distance to complete animation
        scrub: 1,
        pin: true,
        // markers: true, // For debugging
      },
    });

    // Initial State: All titles are at the top (y: 0, scale: 1).
    // We want to fan them out.
    // The first title (index 0) stays at the top (or moves slightly?).
    // "Title moves towards the bottom, leaving the bigger duplicated behind."
    // This implies the element at index 0 (Top visual) should be the "Bigger" one.
    // The element moving down (index N) should be smaller.
    
    // Let's assume titlesRef[0] is the top one.
    // titlesRef[length-1] is the one that goes furthest down.
    
    // Animate the fan-out
    tl.to(titlesRef.value, {
      y: (index) => {
        // Distribute them downwards.
        // Index 0 stays at 0.
        // Index 1 moves down a bit.
        // Last index moves to "25% of the bottom" -> roughly 75vh?
        // Let's explicitly calculate or use percentages.
        // If container is 100vh. Bottom 25% starts at 75vh.
        if (index === 0) return 0;
        const totalHeight = window.innerHeight; // approximate
        const targetY = (totalHeight * 0.6) * (index / (titlesRef.value.length - 1)); 
        return targetY;
      },
      scale: (index) => {
        // Index 0 is Scale 1.
        // Last index is smaller.
        // "duplicating in smaller sizes"
        return 1 - (index * 0.15);
      },
      opacity: (index) => {
        // Maybe fading out the lower ones or keeping them visible?
        // "starts duplicating... leaving bigger behind".
        // Usually trail effects might have transparency.
        // Let's keep them relatively visible but maybe slight fade.
        return 1 - (index * 0.1); 
      },
      duration: 5,
      ease: "power2.out",
    }, "start");

    // Reveal Content
    tl.fromTo(contentRef.value, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2, ease: "power2.out" },
      "-=2" // Overlap slightly with the end of fan-out
    );

    // Fade out whole section at the end
    tl.to(containerRef.value, {
      opacity: 0,
      duration: 2,
      ease: "power1.inOut"
    });
  });
});
</script>

<template>
  <section ref="containerRef" class="h-svh w-full relative overflow-hidden flex flex-col items-center justify-start pt-20">
    
    <!-- Title Wrapper: Holds the stack of titles -->
    <!-- "When title reaches top of viewport" -> We pin the section. 
         So the titles should be positioned near the top. -->
    <div ref="titleWrapperRef" class="relative w-full flex justify-center z-10">
      <!-- 
        We render the main title and duplicates.
        We can just render N copies.
        Let's render 5 copies.
        Copy 0 is the "Anchor" (Top, Big).
        Copy 4 is the "Lead" (Bottom, Small).
      -->
      <h2
        v-for="i in 5"
        :key="i"
        ref="titlesRef"
        class="absolute top-0 text-[7.5rem] leading-none font-serif font-light text-center origin-top select-none text-primary whitespace-nowrap"
        :class="{ 'z-20': i === 1, 'z-10': i > 1 }"
        aria-hidden="true"
      >
        {{ title }}
      </h2>
      <!-- One accessible title for screen readers (hidden visually or mapped to the first one) -->
      <span class="sr-only">{{ title }}</span>
    </div>

    <!-- Content Paragraphs -->
    <!-- Positioned absolutely or flex-end? 
         "Once it reaches 25% of bottom... content appears".
         The content shouldn't be covered by titles.
         Let's place it in the center/bottom area.
    -->
    <div ref="contentRef" class="absolute bottom-[15%] w-full max-w-lg px-6 z-30 opacity-0 text-center">
      <ul class="flex flex-col gap-y-6">
        <li v-for="(item, index) in content" :key="index">
          <p class="text-xl md:text-2xl text-primary font-satoshi font-light leading-relaxed">
            {{ item }}
          </p>
        </li>
      </ul>
    </div>

  </section>
</template>