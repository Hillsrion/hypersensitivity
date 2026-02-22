import type { DialogueLine } from "../../types/game";
import { useDialogueDisplay } from "./useDialogueDisplay";
import { useDialogueAudio } from "./useDialogueAudio";
import { useDialogueAnimation } from "./useDialogueAnimation";

export function useDialogueBox(
  dialogue: Ref<DialogueLine | null>,
  textRef: Ref<HTMLElement | null>,
  contentRef: Ref<HTMLElement | null>,
  annotationRef: Ref<HTMLElement | null>,
  speakerRef: Ref<HTMLElement | null>,
  isSelecting: Ref<boolean | undefined>,
  emit: (event: "animationComplete", ...args: any[]) => void
) {
  const { $gsap } = useNuxtApp();
  const gameStore = useGameStore();

  const isReady = ref(false); // Controls visibility of the text to prevent FOUC

  // Split Text
  const split = useSplitText(textRef, {
    splitBy: "lines,words",
    shouldRevert: false, // Prevent flash of unstyled text on unmount (e.g. menu open)
    onComplete: (instance: any) => {
      // Initialiser tous les mots avec opacite reduite
      if (instance.words) {
        $gsap.set(instance.words, { opacity: 0.2 });
      }
    },
  });

  // Sub-composables
  const {
    isPensees,
    isRightAligned,
    isInIntroAnimation,
    showAnnotation: getShowAnnotation,
    showDialogueContent: getShowDialogueContent,
    annotationClasses,
  } = useDialogueDisplay(dialogue);

  const {
    clearFallbackTimer,
    handleAudioEnded,
    ensureAudioPlaying,
  } = useDialogueAudio(dialogue);


  const {
    isAnimating,
    currentTimedAnnotation,
    isShowingOnlyAnnotation,
    animateWords,
  } = useDialogueAnimation(
    dialogue,
    textRef,
    annotationRef,
    speakerRef,
    split,
    emit,
    handleAudioEnded,
    ensureAudioPlaying,
    clearFallbackTimer
  );

  // Computed
  // Computed
  const showDialogueContent = getShowDialogueContent(
    isShowingOnlyAnnotation,
    currentTimedAnnotation
  );

  const showAnnotation = getShowAnnotation(currentTimedAnnotation);

  const displayAnnotation = computed(() => {
    return currentTimedAnnotation.value || dialogue.value?.annotation || "";
  });

  // Watchers
  watch(isSelecting, (selecting) => {
    if (selecting && contentRef.value) {
      $gsap.to(contentRef.value, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      });
    }
  });

  watch(
    () => dialogue.value?.id,
    async (newId, oldId) => {
      console.log(
        "LOG_DEBUG: Watch dialogue ID fired. New:",
        newId,
        "Old:",
        oldId
      );
      if (newId && newId !== oldId) {

        if (contentRef.value) {
          $gsap.to(contentRef.value, {
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
          });
        }
        if (textRef.value) {
          $gsap.set(textRef.value, { opacity: 0 });
        }

        await nextTick();

        // Attendre un peu pour que split soit peuplé
        let attempts = 0;
        const checkSplit = () => {
          if (split.words.value?.length) {
            const words = split.words.value;
            $gsap.set(words, { opacity: 0.2 });

            if (textRef.value) {
              $gsap.to(textRef.value, { opacity: 1, duration: 0.2 });
            }
            currentTimedAnnotation.value = null;
            isShowingOnlyAnnotation.value = false;

            isReady.value = true;

            if (!isInIntroAnimation.value && !gameStore.isDayTransitioning) {
              setTimeout(animateWords, 20);
            }
          } else if (attempts < 60) {
            attempts++;
            setTimeout(checkSplit, 25);
          } else {
            isReady.value = true;
            if (!isInIntroAnimation.value && !gameStore.isDayTransitioning) {
              animateWords();
            }
          }
        };

        checkSplit();
        return;
      }
    },
    { immediate: true }
  );

  watch(
    () => gameStore.introAnimationPhase,
    async (phase) => {
      console.log(
        "LOG_DEBUG: introAnimationPhase changed:",
        phase,
        "isInIntro:",
        isInIntroAnimation.value,
        "isAnimating:",
        isAnimating.value
      );
      if (
        phase === "revealing" &&
        isInIntroAnimation.value &&
        !isAnimating.value
      ) {
        let attempts = 0;
        const waitForSplit = async () => {
          if (split.words.value?.length) {
            console.log(
              "LOG_DEBUG: Split ready, launching animateWords from intro watcher"
            );
            animateWords();
          } else if (attempts < 30) {
            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 25));
            waitForSplit();
          } else {
            console.warn(
              "LOG_DEBUG: Split timed out in intro watcher, forcing animateWords"
            );
            animateWords();
          }
        };
        await nextTick();
        waitForSplit();
      }
    },
    { immediate: true }
  );

  watch(
    () => gameStore.isDayTransitioning,
    (isTransitioning) => {
      if (!isTransitioning && isReady.value && !isInIntroAnimation.value) {
        animateWords();
      }
    }
  );

  onUnmounted(() => {
    clearFallbackTimer();
  });

  return {
    isPensees,
    isRightAligned,
    displayAnnotation,
    showAnnotation,
    showDialogueContent,
    annotationClasses,
    isReady,
    animateWords,
    split,
    currentTimedAnnotation,
    isShowingOnlyAnnotation,
  };
}
