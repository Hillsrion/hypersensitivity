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
  if (!props.dialogue || !split.words.value?.length) {
    emit("animationComplete");
    return;
  }

  isAnimating.value = true;

  const timings = props.dialogue.timings;
  const words = split.words.value;

  // Creer la timeline d'animation
  const wordTimeline = $gsap.timeline({
    onStart: () => {
      // Jouer l'audio si present
      if (props.dialogue?.audio) {
        audioStore.playAudio(props.dialogue.audio);
      }
    },
    onComplete: () => {
      isAnimating.value = false;
      emit("animationComplete");
    },
  });

  if (timings && timings.length > 0) {
    // Animation basee sur les timings audio (style SoundIntroduction)
    words.forEach((wordEl, index) => {
      const timing = timings[index];
      if (timing) {
        wordTimeline.to(
          wordEl,
          {
            opacity: 1,
            duration: timing.end - timing.start,
            ease: "none",
          },
          timing.start
        );
      } else {
        // Si pas de timing pour ce mot, l'animer a la fin
        wordTimeline.to(
          wordEl,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          ">"
        );
      }
    });
  } else {
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
    if (newId && newId !== oldId) {
      // Attendre que le split soit pret
      await nextTick();
      // Petit delai pour laisser le DOM se mettre a jour
      setTimeout(() => {
        if (split.words.value?.length) {
          // Reset l'opacite des mots
          $gsap.set(split.words.value, { opacity: 0.2 });
          animateWords();
        } else {
          emit("animationComplete");
        }
      }, 100);
    }
  },
  { immediate: true }
);

// Est-ce que c'est une pensée ?
const isPensees = computed(() => {
  return props.dialogue?.speakerType === "pensees";
});

// Est-ce qu'on est dans l'animation d'intro (premier dialogue de la scene initiale)
const isInIntroAnimation = computed(() => {
  return gameStore.isFirstDialogueOfInitialScene && !gameStore.introPlayed;
});

// Afficher l'annotation pendant l'intro ou normalement
const showAnnotation = computed(() => {
  if (!props.dialogue?.annotation) return false;
  // Pendant l'intro, on affiche toujours l'annotation (elle sera animee)
  if (isInIntroAnimation.value) {
    return gameStore.introAnimationPhase !== "hidden";
  }
  // Apres l'intro, on cache l'annotation du premier dialogue car elle a deja ete vue
  if (gameStore.isFirstDialogueOfInitialScene && gameStore.introPlayed) {
    return false;
  }
  return true;
});

// Afficher le contenu du dialogue (speaker + texte) seulement apres la phase "revealing"
const showDialogueContent = computed(() => {
  if (!isInIntroAnimation.value) return true;
  return (
    gameStore.introAnimationPhase === "revealing" ||
    gameStore.introAnimationPhase === "complete"
  );
});

// Classes pour l'animation du blur sur l'annotation pendant l'intro
const annotationClasses = computed(() => {
  if (!isInIntroAnimation.value) {
    return "text-primary/50 font-serif text-sm italic mb-6";
  }
  // Pendant l'intro, style similaire a Experience.vue
  const phase = gameStore.introAnimationPhase;
  const baseClasses =
    "font-serif text-xl text-gray-400 transition-all duration-300";
  if (phase === "annotation") {
    return `${baseClasses} blur-xs opacity-100`;
  }
  if (phase === "revealing" || phase === "complete") {
    return `${baseClasses} blur-0 opacity-100`;
  }
  return `${baseClasses} blur-xs opacity-0`;
});
</script>

<template>
  <div v-if="dialogue" class="max-w-4xl px-8">
    <!-- Annotation (avec animation blur pendant l'intro) -->
    <p v-if="showAnnotation" :class="annotationClasses">
      {{ dialogue.annotation }}
    </p>

    <!-- Speaker Name (cache pendant l'intro jusqu'a la phase revealing) -->
    <p
      v-if="showDialogueContent"
      class="text-primary font-medium leading-[1.4] font-satoshi text-xl uppercase mb-4"
    >
      {{ dialogue.speaker }}
      <span v-if="isPensees" class="font-serif text-primary/60 lowercase"
        >(en pensées)</span
      >
    </p>

    <!-- Dialogue Text (cache pendant l'intro jusqu'a la phase revealing) -->
    <p
      v-if="showDialogueContent"
      ref="textRef"
      class="font-serif font-light text-2xl lg:text-3xl leading-relaxed text-primary"
    >
      {{ dialogue.text }}
    </p>
  </div>
</template>
