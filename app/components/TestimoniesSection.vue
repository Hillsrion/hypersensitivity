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
  if (index === 0) {
    firstCardContentRef.value = el;
  }
};

onMounted(async () => {
  await nextTick();
  await document.fonts.ready;

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
      },
    });

    // --- 1. Calculate Geometry ---
    // We calculate the delta between the Big Hero Text and the Small Card Text
    const startRect = heroTextRef.value.getBoundingClientRect();
    const endRect = firstCardContentRef.value.getBoundingClientRect();

    const xMove = endRect.left - startRect.left;
    const yMove = endRect.top - startRect.top;

    // We use width ratio for scaling.
    // Note: Text reflow is not simulated by scale, but it's the smoothest visual transition.
    const widthScale = endRect.width / startRect.width;

    // --- 2. Build Timeline ---

    // Phase A: Shrink and Move Hero Text to position of Card 1
    tl.to(heroTextRef.value, {
      x: xMove,
      y: yMove,
      scale: widthScale,
      transformOrigin: "top left",
      ease: "power1.inOut",
      duration: 3,
    })
      // Phase B: Swap Visibility
      // Hide the floating hero text and show the actual card content
      .set(heroTextRef.value, { opacity: 0 })
      .set(firstCardContentRef.value, { opacity: 1 }, "<");

    // Phase C: Horizontal Scroll
    // Move the track to the left to reveal other cards
    const trackWidth = trackRef.value.scrollWidth;
    const windowWidth = window.innerWidth;
    // Scroll enough to see the last card + some padding
    // If trackWidth < windowWidth, no scroll needed, but likely it is larger.
    const xScroll = Math.min(0, -(trackWidth - windowWidth + 200));

    if (xScroll < 0) {
      tl.to(trackRef.value, {
        x: xScroll,
        ease: "none", // Linear movement for scroll sync
        duration: 7,
      });
    }
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
      <!-- Absolute centered initially. We remove CSS transforms on the element itself to avoid conflict with GSAP -->
      <div
        ref="heroTextRef"
        class="absolute top-0 left-0 w-[80vw] z-20 pointer-events-none origin-top-left flex items-center justify-center text-center"
        style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
      >
        <!-- Note: inline style used for initial centering, GSAP will computed-style this out or add component transform -->
        <h2 class="font-epilogue font-medium fl-text-4xl/7xl leading-tight">
          {{ testimonies[0].content }}
        </h2>
      </div>

      <!-- HORIZONTAL TRACK -->
      <div
        ref="trackRef"
        class="flex items-center gap-20 px-[10vw] w-max h-full"
      >
        <div
          v-for="(t, i) in testimonies"
          :key="i"
          class="shrink-0 w-[400px] h-[400px] bg-white border border-neutral-200 p-8 flex flex-col justify-between shadow-sm"
        >
          <!-- Inner content wrapper to measure and target -->
          <div
            :ref="(el) => setFirstCardRef(el, i)"
            :class="{ 'opacity-0': i === 0 }"
            class="h-full flex flex-col justify-between"
          >
            <p class="font-epilogue fl-text-xl/2xl leading-relaxed">
              {{ t.content }}
            </p>
            <div class="mt-6">
              <span class="block font-epilogue font-medium text-lg">{{
                t.author
              }}</span>
              <div
                v-if="t.audio"
                class="mt-2 flex items-center gap-2 text-sm text-neutral-500 font-satoshi"
              >
                <!-- Simple Play Icon SVG -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Écouter le témoignage</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Spacer -->
        <div class="w-[10vw] shrink-0"></div>
      </div>
    </div>
  </section>
</template>