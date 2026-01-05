<script setup>
import circleAudiowave from "~/assets/images/circle-audiowave.svg";
import { useAnimationsStore } from "~/stores/animations";
import { storeToRefs } from "pinia";

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();
const { landing } = storeToRefs(animationsStore);
const bottomElement = useTemplateRef("bottomElement");
const containerElement = useTemplateRef("containerElement");

// Gradient state with 4 color stops and their positions
const gradientState = reactive({
  color1: "#242124",
  color2: "#1c2032",
  color3: "#2b3e5f",
  color4: "#627ea4",
  stop1: 0,
  stop2: 33,
  stop3: 66,
  stop4: 100,
});

const backgroundGradient = computed(() => {
  return `linear-gradient(to bottom, ${gradientState.color1} ${gradientState.stop1}%, ${gradientState.color2} ${gradientState.stop2}%, ${gradientState.color3} ${gradientState.stop3}%, ${gradientState.color4} ${gradientState.stop4}%)`;
});

// Palette pour stocker les valeurs calculées des variables CSS
const palette = {};

onMounted(() => {
  // On récupère les valeurs Hex réelles depuis le CSS pour permettre à GSAP d'interpoler
  const style = getComputedStyle(document.documentElement);
  for (let i = 1; i <= 7; i++) {
    palette[`loading${i}`] = style
      .getPropertyValue(`--color-bg-loading-${i}`)
      .trim();
  }

  // On met à jour l'état initial avec les valeurs exactes du CSS
  gradientState.color1 = palette.loading1;
  gradientState.color2 = palette.loading2;
  gradientState.color3 = palette.loading3;
  gradientState.color4 = palette.loading4;
});

watch(
  () => landing.value.intro.started,
  (started) => {
    if (started) {
      const tl = $gsap.timeline();

      // Utilisation des valeurs Hex résolues (palette) pour une interpolation fluide
      tl.to(gradientState, {
        keyframes: [
          // Étape 1 : Décalage vers le haut
          {
            color1: palette.loading2,
            color2: palette.loading3,
            color3: palette.loading4,
            color4: palette.loading5,
            stop2: 33,
            stop3: 66,
          },
          // Étape 2
          {
            color1: palette.loading3,
            color2: palette.loading4,
            color3: palette.loading5,
            color4: palette.loading6,
          },
          // Étape 3
          {
            color1: palette.loading4,
            color2: palette.loading5,
            color3: palette.loading6,
            color4: palette.loading7,
          },
          // Étape 4
          {
            color1: palette.loading5,
            color2: palette.loading6,
            color3: palette.loading7,
            color4: palette.loading7,
            stop3: 75,
          },
          // Étape 5
          {
            color1: palette.loading6,
            color2: palette.loading6,
            color3: palette.loading7,
            color4: palette.loading7,
            stop2: 0,
            stop3: 75,
          },
        ],
        duration: 2,
        ease: "sine.inOut",
      });
    }
  }
);

const onBottomElementClick = () => {
  animationsStore.startTitleExit();
};
</script>

<template>
  <div
    ref="containerElement"
    class="h-screen w-screen flex flex-col items-center justify-center fixed inset-0 z-10"
    :style="{ background: backgroundGradient }"
  >
    <MainTitle title="Hypersensibles" />
    <button
      ref="bottomElement"
      class="flex flex-col place-items-center gap-y-4 absolute left-1/2 bottom-10 -translate-x-1/2 transition-opacity duration-500 cursor-pointer"
      :class="{
        'opacity-0':
          !landing.mainTitle.entry.completed || landing.mainTitle.exit.started,
      }"
      @click="onBottomElementClick"
    >
      <p class="text-white uppercase leading-5">Cliquer pour écouter</p>
      <img :src="circleAudiowave" alt="Circle Audio Wave" class="w-18 h-18" />
    </button>
    <div
      class="absolute top-10 right-16 transition-opacity duration-500"
      :class="{
        'opacity-0': !landing.intro.started,
      }"
    >
      <img :src="circleAudiowave" alt="Circle Audio Wave" class="w-14 h-14" />
    </div>
  </div>
</template>
