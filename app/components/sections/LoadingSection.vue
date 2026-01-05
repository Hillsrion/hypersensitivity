<script setup>
import circleAudiowave from "~/assets/images/circle-audiowave.svg";
import { useAnimationsStore } from "~/stores/animations";
import { storeToRefs } from "pinia";

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();
const { landing } = storeToRefs(animationsStore);
const bottomElement = useTemplateRef("bottomElement");
const containerElement = useTemplateRef("containerElement");

const gradientColors = reactive({
  start: "#242124",
  third: "#1c2032",
  twoThirds: "#2b3e5f",
  end: "#627ea4",
  stopThird: 33,
  stopTwoThirds: 66,
});

const backgroundGradient = computed(() => {
  return `linear-gradient(to bottom, ${gradientColors.start} 0%, ${gradientColors.third} ${gradientColors.stopThird}%, ${gradientColors.twoThirds} ${gradientColors.stopTwoThirds}%, ${gradientColors.end} 100%)`;
});

watch(
  () => landing.value.intro.started,
  (started) => {
    if (started) {
      $gsap.to(gradientColors, {
        start: "#a4bbd6",
        third: "#c2d6e6",
        twoThirds: "#ffffff",
        end: "#ffffff",
        stopThird: 33,
        stopTwoThirds: 66,
        duration: 1.5,
        ease: "power2.inOut",
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
