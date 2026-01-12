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
const scrollTriggerInstance = ref<any>(null);

onMounted(() => {
  if (!container.value) return;
});

onUnmounted(() => {
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
});

watch(
  [words, container],
  ([newWords, containerEl]) => {
    if (newWords && newWords.length && containerEl && textContainer.value) {
      nextTick(() => {
        const lineElements = textContainer.value?.children;
        if (!lineElements || lineElements.length === 0) return;

        if (scrollTriggerInstance.value) {
          scrollTriggerInstance.value.kill();
        }

        const mainTl = $gsap.timeline({
          scrollTrigger: {
            trigger: containerEl,
            start: "top center",
            end: "+=400%",
            scrub: true,
          },
        });

        scrollTriggerInstance.value = mainTl.scrollTrigger;

        const textTl = $gsap.timeline();

        Array.from(lineElements).forEach((lineEl) => {
          const lineWords = lineEl.querySelectorAll(".word");
          
          textTl.to(lineEl, {
            autoAlpha: 0.2,
            duration: 0.5,
            ease: "power2.out",
          });

          textTl.to(lineWords, {
            autoAlpha: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          });

          textTl.to(lineEl, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        });

        const totalDuration = textTl.duration();
        const gradientSteps = [
          { color1: "#C2D6E6", color2: "#ffffff", color3: "#ffffff", color4: "#ffffff" },
          { color1: "#A4BBD6", color2: "#C2D6E6", color3: "#ffffff", color4: "#ffffff" },
          { color1: "#627EA4", color2: "#A4BBD6", color3: "#C2D6E6", color4: "#ffffff" },
          { color1: "#2B3E5F", color2: "#627EA4", color3: "#A4BBD6", color4: "#C2D6E6" },
          { color1: "#1C2032", color2: "#2B3E5F", color3: "#627EA4", color4: "#A4BBD6" },
          { color1: "#0B1018", color2: "#1C2032", color3: "#2B3E5F", color4: "#627EA4" },
          { color1: "#0B1018", color2: "#0B1018", color3: "#1C2032", color4: "#2B3E5F" },
          { color1: "#0B1018", color2: "#0B1018", color3: "#0B1018", color4: "#1C2032" },
          { color1: "#0B1018", color2: "#0B1018", color3: "#0B1018", color4: "#0B1018" },
        ];

        const stepDuration = totalDuration / gradientSteps.length;
        const gradientTl = $gsap.timeline();

        gradientSteps.forEach((step) => {
          gradientTl.to(gradientState, {
            ...step,
            duration: stepDuration,
            ease: "none",
          });
        });

        mainTl.add(textTl, 0);
        mainTl.add(gradientTl, 0);
        mainTl.to({}, { duration: 1 });

        mainTl.eventCallback("onUpdate", () => {
          if (mainTl.progress() > 0.4) {
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
      <h2 ref="textContainer" class="relative z-10 max-w-4xl px-6 text-center grid place-items-center">
        <span
          v-for="(line, index) in lines"
          :key="index"
          class="font-epilogue text-3xl md:text-5xl lg:text-6xl text-white opacity-0 col-start-1 row-start-1 w-full"
        >
          {{ line }}
        </span>
      </h2>
    </div>
  </div>
</template>