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

watch(
  () => landing.value.intro.started,
  (started) => {
    if (started) {
      const tl = $gsap.timeline({ defaults: { ease: "sine.inOut", duration: 0.6 } });

      // État 1 → 2
      tl.to(gradientState, {
        color1: "#1c2032",
        color2: "#2b3e5f",
        color3: "#627ea4",
        color4: "#a4bbd6",
        stop1: 0,
        stop2: 33,
        stop3: 66,
        stop4: 100,
      });

      // État 2 → 3
      tl.to(gradientState, {
        color1: "#2b3e5f",
        color2: "#627ea4",
        color3: "#a4bbd6",
        color4: "#c2d6e6",
        stop1: 0,
        stop2: 33,
        stop3: 66,
        stop4: 100,
      });

      // État 3 → 4
      tl.to(gradientState, {
        color1: "#627ea4",
        color2: "#a4bbd6",
        color3: "#c2d6e6",
        color4: "#ffffff",
        stop1: 0,
        stop2: 33,
        stop3: 66,
        stop4: 100,
      });

      // État 4 → 5: Transition douce vers moins de stops
      // On éclaircit tout, le blanc prend plus de place (stop3 -> 100)
      tl.to(gradientState, {
        color1: "#a4bbd6",
        color2: "#c2d6e6",
        color3: "#ffffff",
        color4: "#ffffff",
        stop1: 0,
        stop2: 33,
        stop3: 100,
        stop4: 100,
      });

      // État 5 → 6: Fusion des premiers stops pour ne garder que 2 couleurs visuelles
      // On écrase le premier segment (stop2 -> 0) et on harmonise les couleurs
      tl.to(gradientState, {
        color1: "#c2d6e6",
        color2: "#c2d6e6",
        color3: "#ffffff",
        color4: "#ffffff",
        stop1: 0,
        stop2: 0,
        stop3: 75,
        stop4: 100,
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
          !landing.mainTitle.entry.completed ||
          landing.mainTitle.exit.started,
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
