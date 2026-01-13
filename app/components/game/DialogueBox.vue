<script setup lang="ts">
import type { DialogueLine } from "../../types/game";
import { useAudioStore } from "~/stores/audio";

const props = defineProps<{
  dialogue: DialogueLine | null;
}>();

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

// Formater le speaker
const formattedSpeaker = computed(() => {
  if (!props.dialogue) return "";
  const speaker = props.dialogue.speaker;
  const type = props.dialogue.speakerType;
  return type === "pensees" ? `${speaker} (pensees)` : speaker;
});
</script>

<template>
  <div v-if="dialogue" class="max-w-4xl text-center px-8">
    <!-- Annotation -->
    <p
      v-if="dialogue.annotation"
      class="text-primary/50 font-serif text-sm italic mb-6"
    >
      {{ dialogue.annotation }}
    </p>

    <!-- Speaker Name -->
    <p
      class="text-primary/60 font-satoshi text-xs tracking-[0.3em] uppercase mb-4"
    >
      {{ formattedSpeaker }}
    </p>

    <!-- Dialogue Text -->
    <p
      ref="textRef"
      class="font-serif font-light text-2xl lg:text-3xl leading-relaxed text-primary"
    >
      {{ dialogue.text }}
    </p>
  </div>
</template>
