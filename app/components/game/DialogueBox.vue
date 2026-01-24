<script setup lang="ts">
import type { DialogueLine } from "../../types/game";
import { useAudioStore } from "~/stores/audio";
import { useGameStore } from "~/stores/game";

const props = defineProps<{
  dialogue: DialogueLine | null;
}>();

const gameStore = useGameStore();

const emit = defineEmits<{
  animationComplete: [];
}>();

const { $gsap } = useNuxtApp();
const audioStore = useAudioStore();

const textRef = ref<HTMLElement | null>(null);
const isAnimating = ref(false);
const activeTimeline = ref<gsap.core.Timeline | null>(null);
const currentTimedAnnotation = ref<string | null>(null);
const isShowingOnlyAnnotation = ref(false);

onUnmounted(() => {
  activeTimeline.value?.kill();
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

  isAnimating.value = true;

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
        if (audioItem?.duration) return audioItem.duration;
      }
      // Fallback: 2s après le start
      return start + 2;
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
        }, [], timing.start);
        
        const effectiveEnd = getEffectiveEnd(timing.end, timing.start);
        
        wordTimeline.call(() => {
          if (currentTimedAnnotation.value === timing.annotation) {
            currentTimedAnnotation.value = null;
            isShowingOnlyAnnotation.value = false;
          }
        }, [], effectiveEnd);
      } else {
        // C'est un mot
        const wordEl = words[wordIndex];
        if (wordEl) {
          const effectiveEnd = getEffectiveEnd(timing.end, timing.start);
          wordTimeline.to(
            wordEl,
            {
              opacity: 1,
              duration: effectiveEnd - timing.start,
              ease: "none",
            },
            timing.start
          );
          wordIndex++;
        }
      }
    });

    // S'assurer que tous les mots restants sont affichés si jamais il en manque dans les timings
    if (wordIndex < words.length) {
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
  } else if (timings && timings.length > 0) {
    // Cas où on n'a que des timings d'annotation (pas de mots)
    // La timeline a déjà été peuplée par la boucle timings.forEach
  }
};

// Observer les changements de dialogue
watch(
  () => props.dialogue?.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      // Attendre que le split soit pret
      await nextTick();
      
      // Attendre un peu pour que split soit peuplé
      let attempts = 0;
      const checkSplit = () => {
        if (split.words.value?.length) {
          const words = split.words.value;
          if (isInIntroAnimation.value) {
            $gsap.set(words, { opacity: 0.2 });
          } else {
            setTimeout(() => {
              $gsap.set(words, { opacity: 0.2 });
              animateWords();
            }, 100);
          }
        } else if (attempts < 10) {
          attempts++;
          setTimeout(checkSplit, 50);
        } else {
          emit("animationComplete");
        }
      };
      
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
    if (val === 0 && isInIntroAnimation.value && !isAnimating.value) {
      // S'assurer que les mots sont là avant de lancer
      if (!split.words.value?.length) {
        await nextTick();
      }
      animateWords();
    }
  }
);

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
      class="text-primary font-medium font-satoshi text-xl/7 uppercase mb-2 transition-opacity duration-700"
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
      class="font-serif font-light text-2xl lg:text-[1.75rem] leading-normal text-primary transition-opacity duration-700"
      :class="{ 'opacity-0': !showDialogueContent }"
    >
      {{ dialogue.text }}
    </p>
  </div>
</template>
