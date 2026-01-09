<script setup>
import mainData from "~/app/data/main.json";

const { $gsap } = useNuxtApp();

const sectionRef = ref(null);
const stickyRef = ref(null);
const heroTextRef = ref(null);
const trackRef = ref(null);
const firstCardContentRef = ref(null); // Will hold the inner content div of the first card

const testimonies = mainData.testimonies;

// Function ref to capture the first card's content element reliably
const setFirstCardRef = (el, index) => {
  if (index === 0 && el) {
    // el is the component instance, we want the textRef element
    firstCardContentRef.value = el.textRef;
  }
};

onMounted(async () => {
  await nextTick();
  await document.fonts.ready;

  // Wait a bit more for the components to be fully ready and measured
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (
    !sectionRef.value ||
    !stickyRef.value ||
    !heroTextRef.value ||
    !trackRef.value ||
    !firstCardContentRef.value
  )
    return;

  const mm = $gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // --- 1. Calculate Geometry ---
    // We calculate the delta between the Big Hero Text and the Small Card Text
    const endRect = firstCardContentRef.value.getBoundingClientRect();

    // Force the Hero Text to have the exact same width as the target text
    // This ensures line breaks (wrapping) are identical.
    heroTextRef.value.style.width = `${endRect.width}px`;

    // Re-measure Hero Text after width adjustment
    const startRect = heroTextRef.value.getBoundingClientRect();

    // Calculate initial scale to fit screen width (with some padding)
    const fitScale = (window.innerWidth * 0.9) / startRect.width;

    // Calculate initial centering offsets
    // We want the text to appear centered on screen initially
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    // We calculate position relative to sticky container to avoid scroll offset issues
    const stickyRect = stickyRef.value.getBoundingClientRect();
    const relativeTop = startRect.top - stickyRect.top;
    const relativeLeft = startRect.left - stickyRect.left;

    const startCenterX = relativeLeft + startRect.width / 2;
    const startCenterY = relativeTop + startRect.height / 2;

    const initialX = screenCenterX - startCenterX;
    const initialY = screenCenterY - startCenterY;

    // Calculate final position (relative to initial startRect position)
    const finalX = endRect.left - startRect.left;
    const finalY = endRect.top - startRect.top;

    // --- 2. Build Timeline ---

    // Set initial state: Scaled up and centered
    tl.set(heroTextRef.value, {
      scale: fitScale,
      x: initialX,
      y: initialY,
      transformOrigin: "center center",
      immediateRender: true,
    });

    // Phase A: Move Hero Text to position of Card 1
    // We animate from the "Big Centered" state to the "Small Card" state (scale: 1, x: finalX, y: finalY)
    tl.to(heroTextRef.value, {
      opacity: 1,
      duration: 0.5,
    })
      .to(heroTextRef.value, {
        x: finalX,
        y: finalY,
        scale: 1,
        transformOrigin: "center center", // Scale from center
        ease: "power2.inOut",
        duration: 3,
      })
      // Phase B: Swap Visibility (Smoother Cross-fade)
      // As the hero text reaches its final spot, we fade it out while fading in the track and the card content.
      .to(heroTextRef.value, {
        autoAlpha: 0,
        duration: 0.2, // Quick fade out at the end
        ease: "power2.inOut",
      })
      .to(
        trackRef.value,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.inOut",
        },
        "<"
      )
      .to(
        firstCardContentRef.value,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.inOut",
        },
        "<"
      );

    // Phase C: Horizontal Scroll
    // Move the track to the left until it completely leaves the screen
    tl.to(trackRef.value, {
      x: () => -trackRef.value.scrollWidth,
      ease: "none", // Linear movement for scroll sync
      duration: 10,
    });
  });
});
</script>

<template>
  <section ref="sectionRef" class="relative h-[400svh]">
    <div
      ref="stickyRef"
      class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
    >
      <!-- HERO TEXT (The big one) -->
      <div
        class="absolute inset-0 px-[7%] py-[29px] z-20 pointer-events-none flex items-center"
      >
        <h2
          ref="heroTextRef"
          class="text-xl text-primary/60 font-serif font-light leading-tight origin-center opacity-0"
        >
          {{ testimonies[0].content }}
        </h2>
      </div>

      <!-- HORIZONTAL TRACK -->
      <div
        ref="trackRef"
        class="opacity-0 flex items-center gap-6 px-[10vw] w-max h-full"
      >
        <TestimonyCard
          v-for="(t, i) in testimonies"
          :key="i"
          :ref="(el) => setFirstCardRef(el, i)"
          :content="t.content"
          :author="t.author"
          :audio="t.audio"
          :color="t.color"
          class="shrink-0 w-100"
          :class="{ 'opacity-0-content': i === 0 }"
        />

        <!-- Spacer -->
        <div class="w-[10vw] shrink-0"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom class to hide ONLY the content of the first card initially */
:deep(.opacity-0-content #textRef),
:deep(.opacity-0-content p) {
  opacity: 0;
}
</style>
