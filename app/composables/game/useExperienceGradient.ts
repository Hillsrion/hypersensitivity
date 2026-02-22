import { gradientSteps } from "~/app/constants/gradients";

export const useExperienceGradient = (
  gradientState: any,
  isDayTransition: Ref<boolean>,
  scrollTriggerInstance: Ref<any>
) => {
  const { $gsap } = useNuxtApp();
  const gameStore = useGameStore();
  const animationsStore = useAnimationsStore();

  const isGameEnd = computed(
    () => gameStore.currentScene?.id === "gameEnd" || gameStore.showQuestionnaire
  );
  const showEndContent = ref(false);

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

  return {
    backgroundGradient,
    isGameEnd,
    showEndContent,
  };
};
