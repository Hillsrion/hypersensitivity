<script setup lang="ts">
import { useAnimationsStore } from "~/stores/animations";

const { $gsap } = useNuxtApp();
const container = ref<HTMLElement | null>(null);
const textContainer = ref<HTMLElement | null>(null);
const animationsStore = useAnimationsStore();

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

const lines = [
  "Parfois tout est trop fort, et tout se superpose.",
  "Tu entendras peut-être ton histoire pendant ces quelques minutes.",
];

const { words } = useSplitText(textContainer, { splitBy: "words" });
const timeline = ref<gsap.core.Timeline | null>(null);

onMounted(() => {
  if (!container.value) return;

  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: container.value,
      start: "top center",
      end: "+=400%", // Increased scroll distance to accommodate text reading
      scrub: true,
    },
  });

  timeline.value = tl;

  tl.eventCallback("onUpdate", () => {
    if (tl.progress() > 0.4) {
      if (animationsStore.cursor.variant !== "light") {
        animationsStore.setCursorVariant("light");
      }
    } else {
      if (animationsStore.cursor.variant !== "dark") {
        animationsStore.setCursorVariant("dark");
      }
    }
  });
});

watch(
  [words, timeline],
  ([newWords, tl]) => {
    if (newWords && newWords.length && tl && textContainer.value) {
      // Small delay to ensure DOM is updated
      nextTick(() => {
        const lineElements = textContainer.value?.children;
        if (!lineElements) return;

        const targetColor = "#0B1018"; // --color-primary

        Array.from(lineElements).forEach((lineEl) => {
          const lineWords = lineEl.querySelectorAll(".word");
          
          // 1. Line goes to 0.2 opacity
          tl.to(lineEl, {
            autoAlpha: 0.2,
            duration: 0.5,
            ease: "power2.out",
          });

          // 2. Words go to 1 opacity sequentially
          tl.to(lineWords, {
            autoAlpha: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          });

          // 3. Line hides
          tl.to(lineEl, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        });

        // Step 1: Transition to the "reversed" gradient (White top, Dark bottom)
        tl.to(gradientState, {
          color1: "#ffffff", // loading7
          color2: "#c2d6e6", // loading6
          color3: "#a4bbd6", // loading5
          color4: "#627ea4", // loading4
          duration: 0.5,
          ease: "none",
        });

        // Step 2: Transition to solid primary color
        tl.to(gradientState, {
          color1: targetColor,
          color2: targetColor,
          color3: targetColor,
          color4: targetColor,
          duration: 0.5,
          ease: "none",
        });

        // Add some padding at the end
        tl.to({}, { duration: 1 });
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div ref="container" class="relative h-[400svh] z-10">
    <div
      class="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
      :style="{ background: backgroundGradient }"
    >
      <!-- Content -->
      <div ref="textContainer" class="relative z-10 max-w-4xl px-6 text-center">
        <p
          v-for="(line, index) in lines"
          :key="index"
          class="font-epilogue text-3xl md:text-5xl lg:text-6xl text-white opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
        >
          {{ line }}
        </p>
      </div>
    </div>
  </div>
</template>