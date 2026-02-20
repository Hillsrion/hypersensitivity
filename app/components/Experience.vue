<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAnimationsStore } from "~/stores/animations";
import { useGameStore } from "~/stores/game";
import { useExperienceAnimations } from "~/app/composables/useExperienceAnimations";
import { gradientSteps } from "~/app/constants/gradients";
// GameContainer reference is used in template
import GameContainer from "./game/GameContainer.vue";
import ChoiceButtons from "./game/ChoiceButtons.vue";
import type { Choice } from "~/app/types/game";

const { $gsap } = useNuxtApp();
const gameStore = useGameStore();
const animationsStore = useAnimationsStore();

const endGameChoices = computed<Choice[]>(() => [
  { id: "yes", text: "OUI", nextSceneId: "questionnaire" },
  { id: "no", text: "NON", nextSceneId: "reset" },
]);

const handleEndChoiceSelect = (choice: Choice) => {
  if (choice.id === "yes") {
    showQuestionnaire();
  } else {
    gameStore.resetGame();
  }
};

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
  const visible = animationsStore.aurora.visible;
  const zIndex = animationsStore.aurora.zIndex;
  
  if (isGameEnd.value) {
    return `linear-gradient(180deg, ${gradientState.color1} ${gradientState.stop1}%, ${gradientState.color2} ${gradientState.stop2}%, ${gradientState.color3} ${gradientState.stop3}%, ${gradientState.color4} ${gradientState.stop4}%)`;
  }

  if (visible && zIndex > 0) {
    return "transparent";
  }
  // We want the gradient to run during the end sequence or day transition
  if (gameStore.introPlayed && !isDayTransition.value) {
    if (gameStore.currentDay === 2) {
      return "var(--color-primary)";
    }
    return "white";
  }

  return `linear-gradient(180deg, ${gradientState.color1} ${gradientState.stop1}%, ${gradientState.color2} ${gradientState.stop2}%, ${gradientState.color3} ${gradientState.stop3}%, ${gradientState.color4} ${gradientState.stop4}%)`;
});

const isGameEnd = computed(() => gameStore.currentScene?.id === "gameEnd" || gameStore.showQuestionnaire);
const showEndContent = ref(false);

watch(isGameEnd, (newVal) => {
  if (newVal) {
    if (animationsStore.cursor.variant !== "light") {
        animationsStore.setCursorVariant("light");
        animationsStore.setAudiowaveVariant("light");
    }
    
    // Kill conflicting tweens and scroll trigger
    $gsap.killTweensOf(gradientState);
    if (scrollTriggerInstance.value) {
      scrollTriggerInstance.value.kill();
      scrollTriggerInstance.value = null;
    }

    // Reset gradient to start from Pure White
    // This prevents jumping if the state was modified by scroll or if step 0 is not white
    Object.assign(gradientState, {
        color1: "#ffffff",
        color2: "#ffffff",
        color3: "#ffffff",
        color4: "#ffffff",
    });
    
    const tl = $gsap.timeline();
    const stepDuration = 0.5;

    gradientSteps.forEach((step) => {
      tl.to(gradientState, {
        ...step,
        duration: stepDuration,
        ease: "none",
      });
    });

    tl.call(() => {
      showEndContent.value = true;
    });
  } else {
    showEndContent.value = false;
  }
});

const lines = [
  "Parfois tout est trop fort, et tout se superpose.",
  "Tu entendras peut-être ton histoire pendant ces quelques minutes.",
];

const { words } = useSplitText(textContainer, { splitBy: "words" });
const scrollTriggerInstance = ref<any>(null);
const autoRevealStarted = ref(false);



// Logic moved to useIntroSequence.ts to sync with audio
// This watcher is no longer needed as the timeline handles the phases



watch(
  () => gameStore.isDayTransitioning,
  async (isTransitioning) => {
    // We only trigger when it turns true automatically by gameStore.goToScene
    if (!isTransitioning || isGameEnd.value) return;

    // 1. Hide Game UI
    isDayTransition.value = true;

    // Reset gradient to white first to avoid snappy transitions
    Object.assign(gradientState, {
      color1: "#ffffff",
      color2: "#ffffff",
      color3: "#ffffff",
      color4: "#ffffff",
    });

    // Animate background to black over the UI fade time
    $gsap.to(gradientState, { ...gradientSteps[8], duration: 1, ease: "power2.inOut" });

    // Wait for UI to fade out
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. Play Close Eye Animation
    await playCloseEyeAnimation();

    // The eye is fully closed. Safely advance the game state to Day 2 in the background.
    gameStore.completeDayTransition();
    
    // Small pause closed
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Prepare to show the new scene's annotation blurred behind the closed eye
    gameStore.setIntroBlurAmount(8);
    isDayTransition.value = false; // Mounts the UI behind the eye
    
    // Let Vue render the UI
    await nextTick();

    // 3. Play Open Eye Animation (This will also animate introBlurAmount down to 0)
    await playOpenEyeAnimation();

    // 4. Finish Transition
    gameStore.setDayTransitioning(false);

    // 5. Start entry annotation timer now that the UI is visible
    if (
      gameStore.introAnimationPhase === "annotation" ||
      gameStore.introAnimationPhase === "milestoneAnnotation"
    ) {
      gameStore.startAnnotationTimer(4000); // Increased from 3000 to match user request
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

const showQuestionnaire = () => {
  showEndContent.value = false;
  
  setTimeout(() => {
    gameStore.setShowQuestionnaire(true);
  }, 1000);
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
        class="absolute top-1/2 left-0 w-full h-auto -translate-y-1/2 pointer-events-none z-0 overflow-visible blur-sm transition-opacity duration-1000"
        :class="{ 'opacity-0': (animationsStore.aurora.visible && !isDayTransition) || isGameEnd }"
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
          v-if="showEndContent && !gameStore.showQuestionnaire" 
          class="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto"
        >
          <div class="max-w-2xl px-6 text-center h-full flex flex-col items-center justify-center pb-32">
            <h2 class="font-serif italic text-title text-white leading-tight">
              Souhaitez-vous évaluer votre spectre de l'Hypersensibilité ?
            </h2>
          </div>
            
          <ChoiceButtons
            :choices="endGameChoices"
            variant="light"
            @select="handleEndChoiceSelect"
          />
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
