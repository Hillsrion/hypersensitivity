import type { DialogueLine } from "../../types/game";
import { useAudioStore } from "~/stores/audio";
import { useGameStore } from "~/stores/game";

export function useDialogueAnimator(
  dialogue: Ref<DialogueLine | null>,
  textRef: Ref<HTMLElement | null>,
  contentRef: Ref<HTMLElement | null>,
  annotationRef: Ref<HTMLElement | null>,
  speakerRef: Ref<HTMLElement | null>,
  split: any,
  emit: (event: "animationComplete", ...args: any[]) => void,
  handleAudioEnded: () => void,
  ensureAudioPlaying: (path: string) => void,
  clearFallbackTimer: () => void,
  fallbackTimer: Ref<ReturnType<typeof setTimeout> | null>
) {
  const { $gsap } = useNuxtApp();
  const audioStore = useAudioStore();
  const gameStore = useGameStore();

  const isAnimating = ref(false);
  const activeTimeline = ref<gsap.core.Timeline | null>(null);
  const currentTimedAnnotation = ref<string | null>(null);
  const isShowingOnlyAnnotation = ref(false);

  const isInIntroAnimation = computed(() => {
    return (
      gameStore.isFirstDialogueOfInitialScene && !gameStore.introPlayed
    );
  });

  const sceneAudio = computed(() => {
    return gameStore.currentScene?.audio;
  });

  const getEffectiveEnd = (
    end: number | "end",
    start: number,
    audioToPlay: string | null | undefined
  ): number => {
    if (end === "end") {
      if (audioToPlay) {
        const audioPath = audioToPlay.startsWith("/")
          ? audioToPlay
          : `/audios/${audioToPlay}`;
        const audioItem = (audioStore.list as any[]).find(
          (item: any) => item.path === audioPath
        );

        if (
          audioItem?.audio?.duration &&
          !isNaN(audioItem.audio.duration) &&
          audioItem.audio.duration > start
        ) {
          return audioItem.audio.duration;
        }
        if (audioItem?.duration && audioItem.duration > start) {
          return audioItem.duration;
        }
      }
      return start + 5;
    }
    return end;
  };

  const animateWords = async () => {
    const currentDialogue = dialogue.value;
    if (
      !currentDialogue ||
      (!split.words.value?.length && !currentDialogue.timings?.length)
    ) {
      emit("animationComplete");
      return;
    }

    // Ensure audio store is ready
    if (audioStore.list.length === 0) {
      console.log("LOG_DEBUG: Audio store empty, waiting...");
      const waitForAudio = () => {
        if (audioStore.list.length > 0) {
          console.log("LOG_DEBUG: Audio store ready, calling animateWords");
          animateWords();
        } else {
          setTimeout(waitForAudio, 100);
        }
      };
      setTimeout(waitForAudio, 100);
      return;
    }

    isAnimating.value = true;
    const audioToPlay = sceneAudio.value || currentDialogue.audio;
    console.log(
      "LOG_DEBUG: animateWords starting. Scene Audio:",
      audioToPlay
    );

    const timings = currentDialogue.timings;
    const words = split.words.value || [];

    activeTimeline.value?.kill();
    clearFallbackTimer();

    const wordTimeline = $gsap.timeline({
      onStart: () => {
        if (audioToPlay && !isInIntroAnimation.value) {
          ensureAudioPlaying(audioToPlay);

          const audioPath = audioToPlay.startsWith("/")
            ? audioToPlay
            : `/audios/${audioToPlay}`;
          const item = (audioStore.list as any[]).find(
            (i) => i.path === audioPath || i.path?.endsWith(audioToPlay)
          );

          if (!item && !isInIntroAnimation.value) {
            console.log(
              "LOG_DEBUG: Audio item missing from list, starting 3s fallback timer"
            );
            fallbackTimer.value = setTimeout(handleAudioEnded, 3000);
          }
        } else if (!isInIntroAnimation.value) {
          console.log(
            "LOG_DEBUG: No audio to play, starting 3s fallback timer"
          );
          fallbackTimer.value = setTimeout(handleAudioEnded, 3000);
        }

        setTimeout(() => {
          if (audioStore.currentAudio) {
            (audioStore.currentAudio as HTMLAudioElement).removeEventListener(
              "ended",
              handleAudioEnded
            );
            (audioStore.currentAudio as HTMLAudioElement).addEventListener(
              "ended",
              handleAudioEnded
            );
          }
        }, 100);
      },
      onComplete: () => {
        isAnimating.value = false;
        emit("animationComplete");
      },
    });

    wordTimeline.timeScale(audioStore.playbackRate);
    activeTimeline.value = wordTimeline;

    if (currentDialogue.isChat && (!timings || timings.length === 0)) {
      wordTimeline.set(words, { opacity: 1 }, 0);
    }

    if (timings && timings.length > 0) {
      let wordIndex = 0;
      timings.forEach((timing) => {
        if (timing.annotation) {
          if (timing.showOnly) {
            const fadeOutDuration = 0.2;
            const elementsToFadeOut: HTMLElement[] = [];

            if (textRef.value) elementsToFadeOut.push(textRef.value);
            if (speakerRef.value) elementsToFadeOut.push(speakerRef.value);
            // Also fade out current annotation if visible
            if (annotationRef.value) elementsToFadeOut.push(annotationRef.value);

            if (elementsToFadeOut.length > 0) {
              wordTimeline.set(
                elementsToFadeOut,
                { transition: "none" },
                timing.start
              );
              wordTimeline.to(
                elementsToFadeOut,
                { opacity: 0, duration: fadeOutDuration },
                timing.start
              );
            }

            wordTimeline.call(
              () => {
                currentTimedAnnotation.value = timing.annotation || null;
                isShowingOnlyAnnotation.value = true;
              },
              [],
              timing.start + fadeOutDuration
            );

            if (annotationRef.value) {
              wordTimeline.set(
                annotationRef.value,
                { transition: "none" },
                timing.start + fadeOutDuration
              );
              wordTimeline.fromTo(
                annotationRef.value,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 },
                timing.start + fadeOutDuration
              );
              wordTimeline.set(
                [annotationRef.value, ...elementsToFadeOut],
                { clearProps: "transition" },
                ">"
              );
            }
          } else {
            wordTimeline.call(
              () => {
                currentTimedAnnotation.value = timing.annotation || null;
                isShowingOnlyAnnotation.value = !!timing.showOnly;
              },
              [],
              timing.start
            );
          }

          const effectiveEnd = getEffectiveEnd(
            timing.end,
            timing.start,
            audioToPlay
          );

          if (timing.end !== "end") {
            wordTimeline.call(
              () => {
                if (currentTimedAnnotation.value === timing.annotation) {
                  currentTimedAnnotation.value = null;
                  isShowingOnlyAnnotation.value = false;
                }
              },
              [],
              effectiveEnd
            );
          } else {
            wordTimeline.call(
              () => {
                isAnimating.value = false;
                emit("animationComplete");
              },
              [],
              effectiveEnd
            );
          }
        } else if (!currentDialogue.isChat) {
          const wordEl = words[wordIndex];
          if (wordEl) {
            const effectiveEnd = getEffectiveEnd(
              timing.end,
              timing.start,
              audioToPlay
            );
            wordTimeline.to(
              wordEl,
              {
                opacity: 1,
                duration: Math.max(0.1, effectiveEnd - timing.start),
                ease: "none",
              },
              timing.start
            );
            wordIndex++;
          }
        } else {
          wordTimeline.set(words, { opacity: 1 }, timing.start);
          const effectiveEnd = getEffectiveEnd(
            timing.end,
            timing.start,
            audioToPlay
          );
          wordTimeline.to({}, { duration: 0.1 }, effectiveEnd - 0.1);
          wordIndex++;
        }
      });

      const lastTiming = timings[timings.length - 1];
      const isEndingInShowOnly =
        lastTiming?.annotation &&
        lastTiming?.showOnly &&
        lastTiming?.end === "end";

      if (
        wordIndex < words.length &&
        !isEndingInShowOnly &&
        !currentDialogue.isChat
      ) {
        wordTimeline.to(
          words.slice(wordIndex),
          {
            opacity: 1,
            duration: 0.3,
            stagger: 0.03,
            ease: "power2.out",
          },
          ">"
        );
      }
    } else if (words.length > 0 && !currentDialogue.isChat) {
      wordTimeline.to(words, {
        opacity: 1,
        duration: 0.3,
        stagger: 0.03,
        ease: "power2.out",
      });
    }

    if (audioStore.currentAudio) {
      const currentItem = (audioStore.list as any[]).find(
        (item) => item.audio === audioStore.currentAudio
      );

      if (audioToPlay && currentItem) {
        const normPath = audioToPlay.startsWith("/")
          ? audioToPlay.substring(1)
          : audioToPlay;
        const normCurrentPath = currentItem.path.startsWith("/")
          ? currentItem.path.substring(1)
          : currentItem.path;

        if (
          normCurrentPath.endsWith(normPath) ||
          normPath.endsWith(normCurrentPath)
        ) {
          const currentTime =
            (audioStore.currentAudio as HTMLAudioElement).currentTime || 0;
          if (currentTime > 0) {
            console.log(
              "LOG_DEBUG: Syncing timeline to audio position:",
              currentTime
            );
            wordTimeline.seek(currentTime, false);
          }
        }
      } else if (isInIntroAnimation.value) {
        const currentTime =
          (audioStore.currentAudio as HTMLAudioElement).currentTime || 0;
        wordTimeline.seek(currentTime, false);
      }

      (audioStore.currentAudio as HTMLAudioElement).removeEventListener(
        "ended",
        handleAudioEnded
      );
      (audioStore.currentAudio as HTMLAudioElement).addEventListener(
        "ended",
        handleAudioEnded
      );
    }
  };

  onUnmounted(() => {
    activeTimeline.value?.kill();
    if (audioStore.currentAudio) {
      (audioStore.currentAudio as HTMLAudioElement).removeEventListener(
        "ended",
        handleAudioEnded
      );
    }
  });

  return {
    isAnimating,
    activeTimeline,
    currentTimedAnnotation,
    isShowingOnlyAnnotation,
    animateWords,
  };
}
