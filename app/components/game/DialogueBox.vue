<script setup lang="ts">
import type { DialogueLine } from "../../types/game";
import { useAudioStore } from "~/stores/audio";
import { useGameStore } from "~/stores/game";

const props = defineProps<{
  dialogue: DialogueLine | null;
}>();

console.log("LOG_DEBUG: DialogueBox setup called", props.dialogue?.id);

const gameStore = useGameStore();

const emit = defineEmits<{
  animationComplete: [];
}>();

onMounted(() => {
    console.log("LOG_DEBUG: DialogueBox Mounted", props.dialogue?.id);
});

const { $gsap } = useNuxtApp();
const audioStore = useAudioStore();

const textRef = ref<HTMLElement | null>(null);
const isAnimating = ref(false);
const activeTimeline = ref<gsap.core.Timeline | null>(null);
const currentTimedAnnotation = ref<string | null>(null);
const isShowingOnlyAnnotation = ref(false);
const isReady = ref(false); // Controls visibility of the text to prevent FOUC

// Est-ce que c'est une pensée ?
const isPensees = computed(() => {
  return props.dialogue?.speakerType === "pensees";
});

// Est-ce qu'on est dans l'animation d'intro (premier dialogue de la scene initiale)
const isInIntroAnimation = computed(() => {
  return gameStore.isFirstDialogueOfInitialScene && !gameStore.introPlayed;
});

// Texte de l'annotation à afficher (priorité au timing)
const displayAnnotation = computed(() => {
  return currentTimedAnnotation.value || props.dialogue?.annotation || "";
});

// Afficher l'annotation pendant l'intro ou normalement
const showAnnotation = computed(() => {
  if (currentTimedAnnotation.value) return true;
  if (!props.dialogue?.annotation) return false;

  // Si c'est le tout premier dialogue de la scene initiale, on ne l'affiche pas dans la boite de dialogue
  // car elle est affichee par le composant IntroAnnotation avant
  if (gameStore.isFirstDialogueOfInitialScene) {
    return false;
  }

  return true;
});

// Afficher le contenu du dialogue (speaker + texte) seulement apres la phase "revealing"
// Et le masquer si on affiche une annotation seule
const showDialogueContent = computed(() => {
  if (isShowingOnlyAnnotation.value && currentTimedAnnotation.value) return false;
  
  if (!isInIntroAnimation.value) return true;
  return (
    gameStore.introAnimationPhase === "revealing" ||
    gameStore.introAnimationPhase === "complete"
  );
});

// Classes pour l'animation du blur sur l'annotation pendant l'intro
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

onUnmounted(() => {
  activeTimeline.value?.kill();
  currentTimedAnnotation.value = null;
  isShowingOnlyAnnotation.value = false;
});

// Utiliser useSplitText pour decouper le texte en mots
const split = useSplitText(textRef, {
  splitBy: "lines, words",
  onComplete: (instance) => {
    // Initialiser tous les mots avec opacite reduite
    $gsap.set(instance.words, { opacity: 0.2 });
  },
});

// Animation des mots
const animateWords = async () => {
  if (!props.dialogue || (!split.words.value?.length && !props.dialogue.timings?.length)) {
    emit("animationComplete");
    return;
  }

  // Ensure audio store is ready
  if (audioStore.list.length === 0) {
      console.log("LOG_DEBUG: Audio store empty, waiting...");
      // Simple wait loop
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
  console.log("LOG_DEBUG: animateWords starting. Dialogue Audio:", props.dialogue?.audio);

  const timings = props.dialogue.timings;
  const words = split.words.value || [];

  // Creer la timeline d'animation
  activeTimeline.value?.kill();
  const wordTimeline = $gsap.timeline({
    onStart: () => {
      // Jouer l'audio si présent
      if (props.dialogue?.audio) {
        const audioPath = props.dialogue.audio.startsWith("/")
          ? props.dialogue.audio
          : `/audios/${props.dialogue.audio}`;
        audioStore.playAudio(audioPath);
      }
    },
    onComplete: () => {
      isAnimating.value = false;
      emit("animationComplete");
    },
  });
  activeTimeline.value = wordTimeline;
  
  const getEffectiveEnd = (end: number | "end", start: number): number => {
    if (end === "end") {
      // Tenter de trouver la durée dans le store audio
      if (props.dialogue?.audio) {
        const audioPath = props.dialogue.audio.startsWith("/")
          ? props.dialogue.audio
          : `/audios/${props.dialogue.audio}`;
        const audioItem = (audioStore.list as any[]).find((item: any) => item.path === audioPath);
        
        // Si l'audio a une durée valide (chargée) et supérieure au start
        if (audioItem?.audio?.duration && !isNaN(audioItem.audio.duration) && audioItem.audio.duration > start) {
           return audioItem.audio.duration;
        }
        // Fallback sur la durée pré-calculée si l'audio n'est pas encore chargé mais qu'on a une estimation
        if (audioItem?.duration && audioItem.duration > start) {
            return audioItem.duration;
        }
      }
      // Fallback ultime: on laisse 5s pour lire si on a pas l'info
      return start + 5;
    }
    return end;
  };

  if (timings && timings.length > 0) {
    // Animation basee sur les timings audio
    let wordIndex = 0;
    timings.forEach((timing) => {
      if (timing.annotation) {
        // Annotation temporaire pendant le dialogue
        wordTimeline.call(() => {
          currentTimedAnnotation.value = timing.annotation || null;
          isShowingOnlyAnnotation.value = !!timing.showOnly;
          
          // Force reset opacity of text container if showOnly is active
          if (timing.showOnly && textRef.value) {
            $gsap.set(textRef.value, { opacity: 0 });
          }

          // Si l'annotation va jusqu'à la fin ("end"), on permet à l'utilisateur de cliquer tout de suite
          // pour passer à la suite, on ne bloque pas le state "isAnimating"
          if (timing.end === "end") {
             console.log("LOG_DEBUG: Force unlocking animation for 'end' annotation", timing);
             isAnimating.value = false;
             emit("animationComplete");
          }
        }, [], timing.start);
        
        const effectiveEnd = getEffectiveEnd(timing.end, timing.start);
        
        // On ne retire l'annotation que si ce n'est pas "end"
        // Si c'est "end", on laisse l'annotation jusqu'au prochain dialogue
        if (timing.end !== "end") {
          wordTimeline.call(() => {
            if (currentTimedAnnotation.value === timing.annotation) {
              currentTimedAnnotation.value = null;
              isShowingOnlyAnnotation.value = false;
            }
          }, [], effectiveEnd);
        } else {
             // For "end" annotations, we consider the animation "complete" when it starts
             // so user can click to advance if manual, OR we rely on audio onended.
             // But here we want to ensure the state is permissive.
             wordTimeline.call(() => {
                 // Nothing specific visuals to change, but maybe signal completion?
                 // Actually, if it's "end", we wait for user click indefinitely usually,
                 // but we need to make sure isAnimating becomes false so clicks are registered.
                 isAnimating.value = false;
                 emit("animationComplete");
             }, [], effectiveEnd);
        }
      } else {
        // C'est un mot
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
      }
    });

    // S'assurer que tous les mots restants sont affichés si jamais il en manque dans les timings
    // SAUF si on est en mode "showOnly" à la fin (c'est à dire si la dernière annotation est showOnly et "end")
    const lastTiming = timings[timings.length - 1];
    const isEndingInShowOnly = lastTiming?.annotation && lastTiming?.showOnly && lastTiming?.end === "end";

    if (wordIndex < words.length && !isEndingInShowOnly) {
      wordTimeline.to(words.slice(wordIndex), {
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      }, ">");
    }
  } else if (words.length > 0) {
    // Animation par defaut avec stagger (pas de timings)
    wordTimeline.to(words, {
      opacity: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
    });
  }
};

// Observer les changements de dialogue
watch(
  () => props.dialogue?.id,
  async (newId, oldId) => {
    console.log("LOG_DEBUG: Watch dialogue ID fired. New:", newId, "Old:", oldId);
    if (newId && newId !== oldId) {
      // RESET STATE
      isReady.value = false;
      currentTimedAnnotation.value = null;
      isShowingOnlyAnnotation.value = false;
      isAnimating.value = false;
      activeTimeline.value?.kill();

      // Masquer le contenu texte temporairement pour éviter le flash de l'ancien texte
      if (textRef.value) {
        $gsap.set(textRef.value, { opacity: 0 });
      }

      // Attendre que le split soit pret
      await nextTick();
      
      // Attendre un peu pour que split soit peuplé
      let attempts = 0;
      const checkSplit = () => {
        // Debug
        console.log("LOG_DEBUG: checkSplit check", attempts, split.words.value?.length);
        
        if (split.words.value?.length) {
          const words = split.words.value;
          console.log("LOG_DEBUG: Split ready with words:", words.length);

          // IMPORTANT: Reset visibility state from previous dialogue if it ended in showOnly
          // Order matters: Set words to dimmed state BEFORE revealing the container
          if (isInIntroAnimation.value) {
            $gsap.set(words, { opacity: 0.2 });
          } else {
             $gsap.set(words, { opacity: 0.2 });
          }

          // Restore opacity of container NOW that content is ready and dimmed
          if (textRef.value) {
             $gsap.set(textRef.value, { opacity: 1 });
          }
          currentTimedAnnotation.value = null; 
          isShowingOnlyAnnotation.value = false;
          
          isReady.value = true; // Text is now ready to be shown safely

          if (!isInIntroAnimation.value) {
             console.log("LOG_DEBUG: Calling animateWords from checkSplit success");
             // Small delay to ensure DOM is ready before animating
             setTimeout(() => {
                animateWords();
             }, 50);
          }
        } else if (attempts < 60) { // Increased to 60 (3s)
          attempts++;
          setTimeout(checkSplit, 50);
        } else {
          console.warn("LOG_DEBUG: Split timed out, forcing animation/audio start anyway.");
          // Fallback: lance quand meme l'animation (l'audio se jouera, le texte apparaitra peut-etre d'un bloc)
          animateWords();
        }
      };
      
      console.log("LOG_DEBUG: Starting checkSplit for new dialogue ID:", newId);
      checkSplit();
      return;
    }
  },
  { immediate: true }
);

// Watcher pour lancer l'animation pendant l'intro
watch(
  () => gameStore.introBlurAmount,
  async (val) => {
    console.log("LOG_DEBUG: introBlurAmount changed:", val, "isInIntro:", isInIntroAnimation.value, "isAnimating:", isAnimating.value);
    if (val === 0 && isInIntroAnimation.value && !isAnimating.value) {
      // S'assurer que les mots sont là avant de lancer
      if (!split.words.value?.length) {
        console.log("LOG_DEBUG: waiting for split in intro watcher");
        await nextTick();
      }
      console.log("LOG_DEBUG: Launching animateWords from intro watcher");
      animateWords();
    }
  },
  { immediate: true }
);

// End of script setup
// No computed properties here, they are moved to top.
</script>

<template>
  <div v-if="dialogue" class="max-w-4xl px-8">
    <!-- Annotation (utilisée aussi pour les timings temporaires) -->
    <p
      v-if="showAnnotation"
      class="mb-6 font-serif text-primary/60 text-xl/7 transition-all duration-300"
      :class="[
        annotationClasses
      ]"
    >
      {{ displayAnnotation }}
    </p>

    <!-- Speaker Name (caché via opacité pendant l'intro ou si showOnly est actif) -->
    <p
      class="text-primary font-medium font-satoshi text-xl/7 uppercase mb-2"
      :class="{ 'opacity-0': !showDialogueContent }"
    >
      {{ dialogue.speaker }}
      <span v-if="isPensees" class="font-serif text-primary/60 lowercase"
        >(en pensées)</span
      >
    </p>

    <!-- Dialogue Text (caché via opacité pendant l'intro ou si showOnly est actif) -->
    <p
      ref="textRef"
      class="font-serif font-light text-2xl lg:text-[1.75rem] leading-normal text-primary"
      style="opacity: 0"
      :class="{ 'opacity-0': !showDialogueContent || !isReady }"
    >
      {{ dialogue.text }}
    </p>
  </div>
</template>
