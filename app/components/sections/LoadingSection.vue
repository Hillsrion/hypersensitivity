<script setup>
import { useAnimationsStore } from "~/stores/animations";
import { useAudioStore } from "~/stores/audio";
import { storeToRefs } from "pinia";

const animationsStore = useAnimationsStore();
const audioStore = useAudioStore();
const { landing } = storeToRefs(animationsStore);
const { isPlaying } = storeToRefs(audioStore);
const bottomElement = useTemplateRef("bottomElement");
const containerElement = useTemplateRef("containerElement");
const isHovered = ref(false);

const onBottomElementClick = () => {
  animationsStore.startTitleExit();
};
</script>

<template>
  <div
    ref="containerElement"
    class="h-screen w-screen flex flex-col items-center justify-center fixed inset-0"
    :class="{
      'z-99': !landing.mainTitle.exit.completed,
      'pointer-events-none': landing.mainTitle.exit.started,
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
      <CircleAudiowave
        class="w-14 h-14"
        :primary="animationsStore.audiowave.variant === 'dark'"
        :animating="isPlaying"
      />
    </div>
  </div>
</template>
