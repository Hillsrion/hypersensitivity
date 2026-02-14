import type { DialogueLine } from "../../types/game";
import { useAudioStore } from "~/stores/audio";
import { useGameStore } from "~/stores/game";

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
  const audioStore = useAudioStore();
  const gameStore = useGameStore();

  // State
  const isAnimating = ref(false);
  const activeTimeline = ref<gsap.core.Timeline | null>(null);
  const currentTimedAnnotation = ref<string | null>(null);
  const isShowingOnlyAnnotation = ref(false);
  const isReady = ref(false); // Controls visibility of the text to prevent FOUC
  const fallbackTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  // Split Text
  const split = useSplitText(textRef, {
    splitBy: "lines,words",
    onComplete: (instance: any) => {
      console.log("LOG_DEBUG: useSplitText onComplete. Words found:", instance.words?.length);
      // Initialiser tous les mots avec opacite reduite
      if (instance.words) {
        $gsap.set(instance.words, { opacity: 0.2 });
      }
    },
  });

  const clearFallbackTimer = () => {
    if (fallbackTimer.value) {
      clearTimeout(fallbackTimer.value);
      fallbackTimer.value = null;
    }
  };

  // Computed
  const isPensees = computed(() => {
    return dialogue.value?.speakerType === "pensees";
  });

  const isRightAligned = computed(() => {
    if (!dialogue.value) return false;
    if (isPensees.value) return false;
    const speaker = dialogue.value.speaker.toLowerCase();
    return !speaker.includes("lucie");
  });

  const sceneAudio = computed(() => {
    return gameStore.currentScene?.audio;
  });

  const isInIntroAnimation = computed(() => {
    return gameStore.isFirstDialogueOfInitialScene && !gameStore.introPlayed;
  });

  const displayAnnotation = computed(() => {
    return currentTimedAnnotation.value || dialogue.value?.annotation || "";
  });

  const showAnnotation = computed(() => {
    if (currentTimedAnnotation.value) return true;
    if (!dialogue.value?.annotation) return false;

    if (gameStore.isFirstDialogueOfInitialScene) {
      return false;
    }

    return true;
  });

  const showDialogueContent = computed(() => {
    if (isShowingOnlyAnnotation.value && currentTimedAnnotation.value) return false;
    
    if (!isInIntroAnimation.value) return true;
    return (
      gameStore.introAnimationPhase === "revealing" ||
      gameStore.introAnimationPhase === "complete"
    );
  });

  const annotationClasses = computed(() => {
    const phase = gameStore.introAnimationPhase;
    return {
      "blur-xs":
        isInIntroAnimation.value &&
        (phase === "annotation" ||
          (phase !== "revealing" && phase !== "complete")),
      "opacity-100":
        isInIntroAnimation.value &&
        (phase === "annotation" || phase === "revealing" || phase === "complete"),
      "blur-0":
        isInIntroAnimation.value &&
        (phase === "revealing" || phase === "complete"),
      "opacity-0":
        isInIntroAnimation.value &&
        phase !== "annotation" &&
        phase !== "revealing" &&
        phase !== "complete",
    };
  });

  // Methods
  const handleAudioEnded = () => {
    console.log("LOG_DEBUG: handleAudioEnded called");
    clearFallbackTimer();
    
    if (gameStore.isLastDialogue && gameStore.hasChoices) {
      console.log("LOG_DEBUG: Last dialogue with choices, showing choices instead of advancing");
      gameStore.showChoices = true;
      return;
    }
    console.log("LOG_DEBUG: Advancing dialogue");
    gameStore.advanceDialogue();
  };

  const ensureAudioPlaying = (path: string) => {
    const currentItem = (audioStore.list as any[]).find(item => item.audio === audioStore.currentAudio);
    
    // Normalize paths for comparison (remove leading slash if present)
    const normPath = path.startsWith("/") ? path.substring(1) : path;
    const normCurrentPath = currentItem?.path.startsWith("/") ? currentItem.path.substring(1) : currentItem?.path;

    // Check simple equality or if path ends with the other (handle relative/absolute confusion)
    const isSamePath = normCurrentPath === normPath || 
                       normCurrentPath?.endsWith(normPath) || 
                       normPath?.endsWith(normCurrentPath || "___");

    if (currentItem && isSamePath && audioStore.isPlaying) {
       console.log("LOG_DEBUG: Audio already playing:", path);
       
       // NEW: If shared audio, ensure we are at the right position if just switched
       const timings = dialogue.value?.timings;
       const firstTiming = timings?.find((t) => t.start !== undefined);

       if (firstTiming) {
          const audio = audioStore.currentAudio as any;
          
          if (audio && audio.currentTime < (firstTiming.start - 0.5)) {
             console.log("LOG_DEBUG: Seeking shared audio to:", firstTiming.start);
             audio.currentTime = firstTiming.start;
          }
       }
       return;
    }
    
    const audioPath = path.startsWith('/') ? path : `/audios/${path}`;
    console.log("LOG_DEBUG: Starting new audio:", audioPath);
    audioStore.playAudio(audioPath);
    
    // Seek if we have timings and just started
    const firstTiming = dialogue.value?.timings?.find((t) => t.start !== undefined);
    if (firstTiming) {
        setTimeout(() => {
            const audio = audioStore.currentAudio as any;
            if (audio && audio.currentTime < firstTiming.start) {
                audio.currentTime = firstTiming.start;
            }
        }, 50);
    }
  };

  const animateWords = async () => {
    const currentDialogue = dialogue.value;
    if (!currentDialogue || (!split.words.value?.length && !currentDialogue.timings?.length)) {
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
    console.log("LOG_DEBUG: animateWords starting. Scene Audio:", audioToPlay);

    const timings = currentDialogue.timings;
    const words = split.words.value || [];

    activeTimeline.value?.kill();
    clearFallbackTimer();

    const wordTimeline = $gsap.timeline({
      onStart: () => {
        if (audioToPlay && !isInIntroAnimation.value) {
          ensureAudioPlaying(audioToPlay);
          
          const audioPath = audioToPlay.startsWith('/') ? audioToPlay : `/audios/${audioToPlay}`;
          const item = (audioStore.list as any[]).find(i => i.path === audioPath || i.path?.endsWith(audioToPlay));
          
          if (!item && !isInIntroAnimation.value) {
            console.log("LOG_DEBUG: Audio item missing from list, starting 3s fallback timer");
            fallbackTimer.value = setTimeout(handleAudioEnded, 3000);
          }
        } else if (!isInIntroAnimation.value) {
          console.log("LOG_DEBUG: No audio to play, starting 3s fallback timer");
          fallbackTimer.value = setTimeout(handleAudioEnded, 3000);
        }
        
        setTimeout(() => {
          if (audioStore.currentAudio) {
            (audioStore.currentAudio as HTMLAudioElement).removeEventListener('ended', handleAudioEnded);
            (audioStore.currentAudio as HTMLAudioElement).addEventListener('ended', handleAudioEnded);
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

    if (currentDialogue.isChat) {
      wordTimeline.set(words, { opacity: 1 }, 0);
    }
    
    const getEffectiveEnd = (end: number | "end", start: number): number => {
      if (end === "end") {
        if (audioToPlay) {
          const audioPath = audioToPlay.startsWith("/")
            ? audioToPlay
            : `/audios/${audioToPlay}`;
          const audioItem = (audioStore.list as any[]).find((item: any) => item.path === audioPath);
          
          if (audioItem?.audio?.duration && !isNaN(audioItem.audio.duration) && audioItem.audio.duration > start) {
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

    if (timings && timings.length > 0) {
      let wordIndex = 0;
      timings.forEach((timing) => {
        if (timing.annotation) {
          if (timing.showOnly) {
             const fadeOutDuration = 0.2; // Faster transition as requested
             const elementsToFadeOut: HTMLElement[] = [];
             
             if (textRef.value) elementsToFadeOut.push(textRef.value);
             if (speakerRef.value) elementsToFadeOut.push(speakerRef.value);
             // Also fade out current annotation if visible, to prepare for new one
             if (annotationRef.value && showAnnotation.value) elementsToFadeOut.push(annotationRef.value);

             if (elementsToFadeOut.length > 0) {
                 // Force remove CSS transitions to prevent interference with GSAP
                 wordTimeline.set(elementsToFadeOut, { transition: 'none' }, timing.start);
                 wordTimeline.to(elementsToFadeOut, { opacity: 0, duration: fadeOutDuration }, timing.start);
             }

             // Update state after fade out
             wordTimeline.call(() => {
                 currentTimedAnnotation.value = timing.annotation || null;
                 isShowingOnlyAnnotation.value = true;
             }, [], timing.start + fadeOutDuration);

             // Fade in new annotation
             if (annotationRef.value) {
                  wordTimeline.set(annotationRef.value, { transition: 'none' }, timing.start + fadeOutDuration);
                  wordTimeline.fromTo(annotationRef.value, 
                      { opacity: 0 }, 
                      { opacity: 1, duration: 0.3 }, 
                      timing.start + fadeOutDuration
                  );
                  // Restore transitions after animation (optional, but good practice if reused)
                  wordTimeline.set([annotationRef.value, ...elementsToFadeOut], { clearProps: 'transition' }, ">");
             }
          } else {
              wordTimeline.call(() => {
                currentTimedAnnotation.value = timing.annotation || null;
                isShowingOnlyAnnotation.value = !!timing.showOnly;
              }, [], timing.start);
          }
          
          const effectiveEnd = getEffectiveEnd(timing.end, timing.start);
          
          if (timing.end !== "end") {
            wordTimeline.call(() => {
              if (currentTimedAnnotation.value === timing.annotation) {
                currentTimedAnnotation.value = null;
                isShowingOnlyAnnotation.value = false;
              }
            }, [], effectiveEnd);
          } else {
               wordTimeline.call(() => {
                   isAnimating.value = false;
                   emit("animationComplete");
               }, [], effectiveEnd);
          }
        } else if (!currentDialogue.isChat) {
          const wordEl = words[wordIndex];
          if (wordEl) {
            const effectiveEnd = getEffectiveEnd(timing.end, timing.start);
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
          wordIndex++;
        }
      });


      const lastTiming = timings[timings.length - 1];
      const isEndingInShowOnly = lastTiming?.annotation && lastTiming?.showOnly && lastTiming?.end === "end";

      if (wordIndex < words.length && !isEndingInShowOnly && !currentDialogue.isChat) {
        wordTimeline.to(words.slice(wordIndex), {
          opacity: 1,
          duration: 0.3,
          stagger: 0.03,
          ease: "power2.out",
        }, ">");
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
        const currentItem = (audioStore.list as any[]).find(item => item.audio === audioStore.currentAudio);
        
        if (audioToPlay && currentItem) {
            const normPath = audioToPlay.startsWith("/") ? audioToPlay.substring(1) : audioToPlay;
            const normCurrentPath = currentItem.path.startsWith("/") ? currentItem.path.substring(1) : currentItem.path;
            
            if (normCurrentPath.endsWith(normPath) || normPath.endsWith(normCurrentPath)) {
                 const currentTime = (audioStore.currentAudio as HTMLAudioElement).currentTime || 0;
                 if (currentTime > 0) {
                      console.log("LOG_DEBUG: Syncing timeline to audio position:", currentTime);
                      wordTimeline.seek(currentTime, false);
                 }
            }
        } else if (isInIntroAnimation.value) {
            const currentTime = (audioStore.currentAudio as HTMLAudioElement).currentTime || 0;
            wordTimeline.seek(currentTime, false);
        }

      (audioStore.currentAudio as HTMLAudioElement).removeEventListener('ended', handleAudioEnded);
      (audioStore.currentAudio as HTMLAudioElement).addEventListener('ended', handleAudioEnded);
    }
  };

  // Watchers
  watch(
    isSelecting,
    (selecting) => {
      if (selecting && contentRef.value) {
        $gsap.to(contentRef.value, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.inOut",
        });
      }
    }
  );

  watch(
    () => dialogue.value?.id,
    async (newId, oldId) => {
      console.log("LOG_DEBUG: Watch dialogue ID fired. New:", newId, "Old:", oldId);
      if (newId && newId !== oldId) {
        isReady.value = false;
        currentTimedAnnotation.value = null;
        isShowingOnlyAnnotation.value = false;
        isAnimating.value = false;
        activeTimeline.value?.kill();
        clearFallbackTimer();

        if (contentRef.value) {
          $gsap.to(contentRef.value, { opacity: 1, duration: 0.15, ease: "power2.out" });
        }
        if (textRef.value) {
          $gsap.set(textRef.value, { opacity: 0 });
        }

        await nextTick();
        
        // Attendre un peu pour que split soit peuplé
        let attempts = 0;
        const checkSplit = () => {
          console.log("LOG_DEBUG: checkSplit check", attempts, split.words.value?.length);
          
          if (split.words.value?.length) {
            const words = split.words.value;
            console.log("LOG_DEBUG: Split ready with words:", words.length);

            if (isInIntroAnimation.value) {
              $gsap.set(words, { opacity: 0.2 });
            } else {
               $gsap.set(words, { opacity: 0.2 });
            }

            if (textRef.value) {
               $gsap.to(textRef.value, { opacity: 1, duration: 0.2 });
            }
            currentTimedAnnotation.value = null; 
            isShowingOnlyAnnotation.value = false;
            
            isReady.value = true; 

            if (!isInIntroAnimation.value) {
               console.log("LOG_DEBUG: Calling animateWords from checkSplit success");
               setTimeout(animateWords, 20);
            }
          } else if (attempts < 60) {
            attempts++;
            setTimeout(checkSplit, 25);
          } else {
            console.warn("LOG_DEBUG: Split timed out, forcing visibility and animation start anyway.");
            isReady.value = true;
            if (!isInIntroAnimation.value) {
              animateWords();
            }
          }
        };
        
        console.log("LOG_DEBUG: Starting checkSplit for new dialogue ID:", newId);
        checkSplit();
        return;
      }
    },
    { immediate: true }
  );

  watch(
    () => gameStore.introAnimationPhase,
    async (phase) => {
      console.log("LOG_DEBUG: introAnimationPhase changed:", phase, "isInIntro:", isInIntroAnimation.value, "isAnimating:", isAnimating.value);
      if (phase === "revealing" && isInIntroAnimation.value && !isAnimating.value) {
        let attempts = 0;
        const waitForSplit = async () => {
          if (split.words.value?.length) {
            console.log("LOG_DEBUG: Split ready, launching animateWords from intro watcher");
            animateWords();
          } else if (attempts < 30) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 25));
            waitForSplit();
          } else {
            console.warn("LOG_DEBUG: Split timed out in intro watcher, forcing animateWords");
            animateWords();
          }
        };
        await nextTick();
        waitForSplit();
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    activeTimeline.value?.kill();
    currentTimedAnnotation.value = null;
    isShowingOnlyAnnotation.value = false;
    clearFallbackTimer();
    if (audioStore.currentAudio) {
      (audioStore.currentAudio as HTMLAudioElement).removeEventListener('ended', handleAudioEnded);
    }
  });

  return {
    isPensees,
    isRightAligned,
    displayAnnotation,
    showAnnotation,
    showDialogueContent,
    annotationClasses,
    isReady,
    animateWords, // Exposed in case needed, but mainly handled internally
    split, // Exposing split result if needed, though mostly internal
    currentTimedAnnotation,
    isShowingOnlyAnnotation
  };
}
