<script setup lang="ts">
import { useAnimationsStore } from "~/stores/animations";
import { useGameStore } from "~/stores/game";
import { useAudioStore } from "~/stores/audio";
import MenuIcon from "./MenuIcon.vue";
import EnergyBar from "./EnergyBar.vue";
import GameContainer from "./game/GameContainer.vue";

const { $gsap } = useNuxtApp();
const gameStore = useGameStore();

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
  step5:
    "M1366 383.5 C1366 1500 683 1500 683 1500 C683 1500 0 1500 0 383.5 C0 -1000 683 -1000 683 -1000 C683 -1000 1366 -1000 1366 383.5 Z",
};

const backgroundGradient = computed(() => {
  if (isGameEnd.value) return "var(--color-primary)";
  return `linear-gradient(180deg, ${gradientState.color1} ${gradientState.stop1}%, ${gradientState.color2} ${gradientState.stop2}%, ${gradientState.color3} ${gradientState.stop3}%, ${gradientState.color4} ${gradientState.stop4}%)`;
});

const isGameEnd = computed(() => gameStore.currentScene?.id === "gameEnd");

watch(isGameEnd, (newVal) => {
  if (newVal) {
    if (animationsStore.cursor.variant !== "light") {
        animationsStore.setCursorVariant("light");
        animationsStore.setAudiowaveVariant("light");
    }
    
    $gsap.to(gradientState, {
      color1: "#0b1018",
      color2: "#0b1018",
      color3: "#0b1018",
      color4: "#0b1018",
      duration: 2,
      ease: "power2.inOut",
    });
  }
});

const lines = [
  "Parfois tout est trop fort, et tout se superpose.",
  "Tu entendras peut-être ton histoire pendant ces quelques minutes.",
];

const { words } = useSplitText(textContainer, { splitBy: "words" });
const scrollTriggerInstance = ref<any>(null);
const autoRevealStarted = ref(false);

const audioStore = useAudioStore();

watch(
  () => gameStore.introBlurAmount,
  (val) => {
    if (
      val === 0 &&
      !autoRevealStarted.value &&
      gameStore.introAnimationPhase === "annotation"
    ) {
      autoRevealStarted.value = true;

      const revealTl = $gsap.timeline();



      // Le minuteur de 6 secondes
      revealTl.to(
        {},
        {
          duration: 6,
          onComplete: () => {
            gameStore.setIntroAnimationPhase("revealing");
            $gsap.delayedCall(1, () => {
              gameStore.setIntroAnimationPhase("complete");
              gameStore.setIntroPlayed();
            });
          },
        }
      );
    }
  }
);

const isDayTransition = ref(false);

const playCloseEyeAnimation = () => {
  return new Promise<void>((resolve) => {
    if (!eyePath.value) {
      resolve();
      return;
    }

    const tl = $gsap.timeline({
      onComplete: resolve,
    });
    const duration = 0.3;

    // Start from Open State (Scale 5, Step 4)
    tl.to(eyePath.value, {
      scale: 1,
      duration: duration * 3,
      ease: "power2.inOut",
    })
      .to(eyePath.value, {
        attr: { d: eyePaths.step3 },
        y: 1,
        duration: duration,
        ease: "power1.inOut",
      })
      .to(
        eyePath.value,
        {
          attr: { d: eyePaths.step2 },
          y: 126.5,
          duration: duration,
          ease: "power1.inOut",
        },
        ">"
      )
      .to(
        eyePath.value,
        {
          attr: { d: eyePaths.step1 },
          y: 239.08,
          duration: duration,
          ease: "power1.inOut",
        },
        ">"
      )
      .to(
        eyePath.value,
        {
          attr: { d: eyePaths.base },
          y: 299.74,
          duration: duration,
          ease: "power1.inOut",
        },
        ">"
      )
      .to(
        eyePath.value,
        {
          attr: { d: eyePaths.closed },
          duration: duration,
          ease: "power1.inOut",
        },
        ">"
      )
      .call(() => {
        animationsStore.setCursorVariant("light");
        animationsStore.setAudiowaveVariant("light");
      });
  });
};

const playOpenEyeAnimation = () => {
  return new Promise<void>((resolve) => {
    if (!eyePath.value) {
      resolve();
      return;
    }

    const tl = $gsap.timeline({
      onComplete: resolve,
    });
    const duration = 0.3;

    tl.to(eyePath.value, {
      attr: { d: eyePaths.base },
      duration: duration,
      ease: "power1.inOut",
    })
      .to(
        eyePath.value,
        {
          attr: { d: eyePaths.step1 },
          y: 239.08,
          duration: duration,
          ease: "power1.inOut",
        },
        ">"
      )
      .to(
        eyePath.value,
        {
          attr: { d: eyePaths.step2 },
          y: 126.5,
          duration: duration,
          ease: "power1.inOut",
        },
        ">"
      )
      .to(
        eyePath.value,
        {
          attr: { d: eyePaths.step3 },
          y: 1,
          duration: duration,
          ease: "power1.inOut",
        },
        ">"
      )
      .to(
        eyePath.value,
        {
          attr: { d: eyePaths.step4 },
          y: 1,
          scale: 5,
          duration: duration * 3,
          ease: "power1.inOut",
        },
        ">"
      )
      .call(() => {
        animationsStore.setCursorVariant("dark");
        animationsStore.setAudiowaveVariant("dark");
      });
  });
};

watch(
  () => gameStore.currentDay,
  async (newDay, oldDay) => {
    if (oldDay === 1 && newDay === 2) {
      // 1. Hide Game UI
      isDayTransition.value = true;

      // Wait for UI to fade out
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Play Close Eye Animation
      await playCloseEyeAnimation();
      
      // Small pause closed
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3. Play Open Eye Animation
      await playOpenEyeAnimation();

      // 4. Show Game UI
      isDayTransition.value = false;
    }
  }
);

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
            end: "+=700%",
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
        const eyeStepDuration = 0.3; // Reduced duration for eye animation

        // State for blur animation
        const blurState = { amount: 8 };

        // Set initial centered position for base path (ViewBox height 769, Base center 84.76)
        $gsap.set(eyePath.value, {
          y: 299.74,
          scale: 1,
          transformOrigin: "center center",
          transformBox: "fill-box",
        });

        // Initialiser le blur (mais garder l'annotation cachée)
        gameStore.setIntroBlurAmount(8);

        eyeTl
          .to(eyePath.value, {
            attr: { d: eyePaths.base },
            duration: eyeStepDuration,
            ease: "power1.inOut",
          })
          .call(() => {
            gameStore.setIntroAnimationPhase("annotation");
            // Lancer l'audio du premier dialogue maintenant car DialogueBox n'est pas encore monté
            const currentScene = gameStore.currentScene;
            const audioToPlay = currentScene?.audio || gameStore.currentDialogue?.audio;
            
            if (audioToPlay) {
              const audioPath = audioToPlay.startsWith("/")
                ? audioToPlay
                : `/audios/${audioToPlay}`;
              audioStore.playAudio(audioPath);
            }
          })
          .to(
            eyePath.value,
            {
              attr: { d: eyePaths.step1 },
              y: 239.08,
              duration: eyeStepDuration,
              ease: "power1.inOut",
            },
            "step1"
          )
          .to(
            blurState,
            {
              amount: 6,
              duration: eyeStepDuration,
              ease: "power1.inOut",
              onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
            },
            "step1"
          )
          .to(
            eyePath.value,
            {
              attr: { d: eyePaths.step2 },
              y: 126.5,
              duration: eyeStepDuration,
              ease: "power1.inOut",
            },
            "step2"
          )
          .to(
            blurState,
            {
              amount: 4,
              duration: eyeStepDuration,
              ease: "power1.inOut",
              onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
            },
            "step2"
          )
          .to(
            eyePath.value,
            {
              attr: { d: eyePaths.step3 },
              y: 1,
              duration: eyeStepDuration,
              ease: "power1.inOut",
            },
            "step3"
          )
          .to(
            blurState,
            {
              amount: 2,
              duration: eyeStepDuration,
              ease: "power1.inOut",
              onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
            },
            "step3"
          )
          .to({}, { duration: eyeStepDuration }) // Pause pour l'animation de l'annotation
          .to(eyePath.value, {
            attr: { d: eyePaths.step4 },
            y: 1,
            scale: 5,
            duration: eyeStepDuration * 3, // Increased from eyeStepDuration
            ease: "power1.inOut",
          })
          .to(
            blurState,
            {
              amount: 0,
              duration: eyeStepDuration * 3,
              ease: "power1.inOut",
              onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
            },
            "<"
          );

        mainTl.add(textTl, 0);
        mainTl.add(gradientTl, 0);
        mainTl.add(eyeTl, ">");
        
        // Callback to lock scroll when animation completes
        mainTl.eventCallback("onComplete", () => {
             animationsStore.setScrollLocked(true);
        });

        mainTl.eventCallback("onUpdate", () => {
          const progress = mainTl.progress();
          if (progress > 0.9) {
            if (animationsStore.cursor.variant !== "light") {
              animationsStore.setCursorVariant("light");
              animationsStore.setAudiowaveVariant("light");
            }
          } else if (progress > 0.4) {
            if (animationsStore.cursor.variant !== "light") {
              animationsStore.setCursorVariant("light");
              animationsStore.setAudiowaveVariant("light");
            }
          } else {
            if (animationsStore.cursor.variant !== "dark") {
              animationsStore.setCursorVariant("dark");
              animationsStore.setAudiowaveVariant("dark");
            }
          }
        });
      });
    }
  },
  { immediate: true }
);

const scrollToQuestionnaire = () => {
  $gsap.to(window, {
    duration: 1.5,
    scrollTo: "#hsp-questionnaire",
    ease: "power2.inOut",
  });
};
</script>

<template>
  <div ref="container" class="relative h-[800svh] z-10">
    <div
      class="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
      :style="{ background: backgroundGradient }"
    >
      <!-- Eye Animation -->
      <svg
        class="absolute top-1/2 left-0 w-full h-auto -translate-y-1/2 pointer-events-none z-0 overflow-visible blur-sm"
        viewBox="0 0 1366 769"
      >
        <path ref="eyePath" :d="eyePaths.closed" fill="white" />
      </svg>

      <!-- Game Container - Affiche dans l'oeil, l'annotation apparait avec l'animation -->
      <div 
        class="absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000"
        :class="{ 'opacity-0': isGameEnd || isDayTransition }"
      >
        <GameContainer class="h-full pointer-events-auto" />
      </div>

      <!-- End Screen Overlay -->
      <Transition name="fade">
        <div 
          v-if="isGameEnd" 
          class="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto"
        >
          <div class="max-w-2xl px-6 text-center">
            <h2 class="font-serif italic text-3xl md:text-5xl text-white mb-24 leading-tight">
              Souhaitez-vous évaluer votre spectre de l'Hypersensibilité ?
            </h2>
            
            <div class="flex items-center justify-center gap-12 text-sm tracking-[0.2em]">
              <button 
                class="text-white/60 hover:text-white transition-colors duration-300 uppercase cursor-pointer"
                @click="scrollToQuestionnaire"
              >
                OUI
              </button>
              
              <div class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                <div class="w-px h-4 bg-white/40"></div>
              </div>
              
              <button 
                class="text-white/60 hover:text-white transition-colors duration-300 uppercase cursor-pointer"
                @click="gameStore.resetGame()"
              >
                NON
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Content -->
      <h2
        ref="textContainer"
        class="relative z-10 max-w-4xl px-6 text-center grid place-items-center"
      >
        <span
          v-for="(line, index) in lines"
          :key="index"
          class="font-serif font-light text-title sm:text-2xl lg:text-[2.75rem] leading-[1.45] text-primary opacity-0 col-start-1 row-start-1 w-full"
        >
          {{ line }}
        </span>
      </h2>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
