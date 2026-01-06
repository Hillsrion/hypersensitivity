<script setup>
import { useAnimationsStore } from "~/stores/animations";
import { storeToRefs } from "pinia";

const animationsStore = useAnimationsStore();
const { landing } = storeToRefs(animationsStore);
const bottomElement = useTemplateRef("bottomElement");
const containerElement = useTemplateRef("containerElement");
const isHovered = ref(false);

const { backgroundGradient, animate } = useBackgroundGradient();

watch(
  () => landing.value.intro.entry.started,
  (started) => {
    if (started) {
      animate();
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
    class="h-screen w-screen flex flex-col items-center justify-center fixed inset-0"
    :style="{ background: backgroundGradient }"
    :class="{
      'z-99': !landing.mainTitle.exit.completed,
      'z-10': landing.mainTitle.exit.completed,
    }"
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
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <p class="text-white uppercase leading-5">Cliquer pour écouter</p>
      <CircleAudiowave class="w-18 h-18" :animating="isHovered" />
    </button>
    <div
      class="absolute top-10 right-16 transition-opacity duration-500"
      :class="{
        'opacity-0': !landing.intro.entry.started,
      }"
    >
      <CircleAudiowave class="w-14 h-14" primary />
    </div>
  </div>
</template>
