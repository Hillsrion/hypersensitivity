<script setup lang="ts">
import { useAnimationsStore } from "~/stores/animations";
import { useGameStore } from "~/stores/game";
import { useExperienceAnimations } from "~/app/composables/useExperienceAnimations";
import GameContainer from "./game/GameContainer.vue";

const { $gsap } = useNuxtApp();
const gameStore = useGameStore();
const animationsStore = useAnimationsStore();

const container = ref<HTMLElement | null>(null);
const textContainer = ref<HTMLElement | null>(null);

const { 
  eyePath, 
  eyePaths, 
  gradientState, 
  isDayTransition, 
  playCloseEyeAnimation, 
  playOpenEyeAnimation, 
  setupIntroSequence 
} = useExperienceAnimations();

// Initial state managed by composable

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

        scrollTriggerInstance.value = setupIntroSequence(
          containerEl,
          textContainer.value!,
          lineElements
        );
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
