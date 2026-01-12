<script setup lang="ts">
const { $gsap } = useNuxtApp();
const container = ref<HTMLElement | null>(null);

// Initial state is all white to match the end of the previous section (SoundIntroduction)
const gradientState = reactive({
  color1: "#ffffff",
  color2: "#ffffff",
  color3: "#ffffff",
  color4: "#ffffff",
  stop1: 0,
  stop2: 33,
  stop3: 66,
  stop4: 100,
});

const backgroundGradient = computed(() => {
  return `linear-gradient(180deg, ${gradientState.color1} ${gradientState.stop1}%, ${gradientState.color2} ${gradientState.stop2}%, ${gradientState.color3} ${gradientState.stop3}%, ${gradientState.color4} ${gradientState.stop4}%)`;
});

onMounted(() => {
  if (!container.value) return;

  const targetColor = "#0B1018"; // --color-primary

  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: container.value,
      start: "top center",
      end: "+=200%", // Scroll distance for the timeline
      scrub: true,
    },
  });

  // Step 1: Transition to the "reversed" gradient (White top, Dark bottom)
  // This reveal of colors takes the first portion of the scroll
  tl.to(gradientState, {
    color1: "#ffffff", // loading7
    color2: "#c2d6e6", // loading6
    color3: "#a4bbd6", // loading5
    color4: "#627ea4", // loading4
    duration: 0.5,
    ease: "none",
  });

  // Step 2: Transition to solid primary color
  // The animation completes here (total 100svh if duration 1 equals 200svh)
  tl.to(gradientState, {
    color1: targetColor,
    color2: targetColor,
    color3: targetColor,
    color4: targetColor,
    duration: 0.5,
    ease: "none",
  });

  // Placeholder for other animations in the remaining 100svh of scroll
  tl.to({}, { duration: 1 });
});
</script>

<template>
  <div ref="container" class="relative h-[400svh] z-10">
    <div
      class="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
      :style="{ background: backgroundGradient }"
    >
      <!-- Content -->
      <h2 class="text-white font-epilogue text-4xl relative z-10">
        Experience Section
      </h2>
    </div>
  </div>
</template>