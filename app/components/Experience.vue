<script setup lang="ts">
import { useAnimationsStore } from "~/stores/animations";

const { $gsap } = useNuxtApp();
const container = ref<HTMLElement | null>(null);
const textContainer = ref<HTMLElement | null>(null);
const eyePath = ref<SVGPathElement | null>(null);
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

const eyePaths = {
  closed:
    "M1366 84.76C1129.12 84.76 912 84.76 683 84.76C454 84.76 236.88 84.76 0 84.76C236.88 84.76 454 84.76 683 84.76C912 84.76 1129.12 84.76 1366 84.76Z",
  base: "M1366 84.76C1129.12 119.3 912 169.52 683 169.52C454 169.52 236.88 119.3 0 84.76C236.88 50.22 454 0 683 0C912 0 1129.12 50.22 1366 84.76Z",
  step1:
    "M1366 145.42C1129.12 204.68 912 290.84 683 290.84C454 290.84 236.88 204.69 0 145.42C236.88 86.15 454 0 683 0C912 0 1129.12 86.15 1366 145.42Z",
  step2:
    "M1366 258C1129.12 363.137 912 516 683 516C454 516 236.88 363.155 0 258C236.88 152.845 454 0 683 0C912 0 1129.12 152.845 1366 258Z",
  step3:
    "M1366 383.5C1129.12 540.595 912 769 683 769C454 769 236.88 540.621 0 383.5C236.88 226.379 454 -2 683 -2C912 -2 1129.12 226.379 1366 383.5Z",
  step4:
    "M1366 383.5C1129.12 715.5 912 1200 683 1200C454 1200 236.88 715.5 0 383.5C236.88 51.5 454 -433 683 -433C912 -433 1129.12 51.5 1366 383.5Z",
};

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
            start: "top top",
            end: "+=400%",
            scrub: true,
          },
        });

        scrollTriggerInstance.value = mainTl.scrollTrigger;

        const textTl = $gsap.timeline();

        Array.from(lineElements).forEach((lineEl) => {
          const lineWords = lineEl.querySelectorAll(".word");

          // Set initial state of words to 0.2 opacity
          $gsap.set(lineWords, { opacity: 0.2 });

          textTl.to(lineEl, {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out",
          });

          textTl.to(lineWords, {
            opacity: 1,
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
          {
            color1: "#C2D6E6",
            color2: "#ffffff",
            color3: "#ffffff",
            color4: "#ffffff",
          },
          {
            color1: "#A4BBD6",
            color2: "#C2D6E6",
            color3: "#ffffff",
            color4: "#ffffff",
          },
          {
            color1: "#627EA4",
            color2: "#A4BBD6",
            color3: "#C2D6E6",
            color4: "#ffffff",
          },
          {
            color1: "#2B3E5F",
            color2: "#627EA4",
            color3: "#A4BBD6",
            color4: "#C2D6E6",
          },
          {
            color1: "#1C2032",
            color2: "#2B3E5F",
            color3: "#627EA4",
            color4: "#A4BBD6",
          },
          {
            color1: "#0B1018",
            color2: "#1C2032",
            color3: "#2B3E5F",
            color4: "#627EA4",
          },
          {
            color1: "#0B1018",
            color2: "#0B1018",
            color3: "#1C2032",
            color4: "#2B3E5F",
          },
          {
            color1: "#0B1018",
            color2: "#0B1018",
            color3: "#0B1018",
            color4: "#1C2032",
          },
          {
            color1: "#0B1018",
            color2: "#0B1018",
            color3: "#0B1018",
            color4: "#0B1018",
          },
        ];

        const stepDuration = totalDuration / gradientSteps.length;
        const gradientTl = $gsap.timeline();

        gradientSteps.forEach((step, index) => {
          gradientTl.to(gradientState, {
            ...step,
            duration: stepDuration,
            ease: "none",
          });

          // At step 6 (index 5), change text color to white
          if (index === 5) {
            gradientTl.to(
              lineElements,
              {
                color: "#ffffff",
                duration: stepDuration,
                ease: "none",
              },
              "<"
            );
          }
        });

        const eyeTl = $gsap.timeline();
        const eyeStepDuration = totalDuration / 5; // 5 morph steps (closed -> base -> 1 -> 2 -> 3 -> 4)

        // Set initial centered position for base path (ViewBox height 769, Base center 84.76)
        $gsap.set(eyePath.value, { y: 299.74 });

        eyeTl
          .to(eyePath.value, {
            attr: { d: eyePaths.base },
            duration: eyeStepDuration,
            ease: "power1.inOut",
          })
          .to(eyePath.value, {
            attr: { d: eyePaths.step1 },
            y: 239.08,
            duration: eyeStepDuration,
            ease: "power1.inOut",
          })
          .to(eyePath.value, {
            attr: { d: eyePaths.step2 },
            y: 126.5,
            duration: eyeStepDuration,
            ease: "power1.inOut",
          })
          .to(eyePath.value, {
            attr: { d: eyePaths.step3 },
            y: 1,
            duration: eyeStepDuration,
            ease: "power1.inOut",
          });
        // .to(eyePath.value, {
        //   attr: { d: eyePaths.step4 },
        //   y: 1,
        //   duration: eyeStepDuration,
        //   ease: "power1.inOut",
        // });

        mainTl.add(textTl, 0);
        mainTl.add(gradientTl, 0);
        mainTl.add(eyeTl, ">");
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
      <!-- Eye Animation -->
      <svg
        class="absolute top-1/2 left-0 w-full h-auto -translate-y-1/2 pointer-events-none z-0 overflow-visible"
        viewBox="0 0 1366 769"
      >
        <path ref="eyePath" :d="eyePaths.closed" fill="white" />
      </svg>

      <!-- Content -->
      <h2
        ref="textContainer"
        class="relative z-10 max-w-4xl px-6 text-center grid place-items-center"
      >
        <span
          v-for="(line, index) in lines"
          :key="index"
          class="font-serif font-light text-[1.75rem] sm:text-2xl lg:text-[2.75rem] leading-[1.45] text-primary opacity-0 col-start-1 row-start-1 w-full"
        >
          {{ line }}
        </span>
      </h2>
    </div>
  </div>
</template>