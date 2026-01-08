<script setup>
import { useAnimationsStore } from "~/stores/animations";
import { useAudioStore } from "~/stores/audio";
import { storeToRefs } from "pinia";

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();
const audioStore = useAudioStore();
const { landing } = storeToRefs(animationsStore);
const { isPlaying } = storeToRefs(audioStore);
const bottomElement = useTemplateRef("bottomElement");
const containerElement = useTemplateRef("containerElement");
const auroraRef = useTemplateRef("auroraRef");
const auroraInnerRef = useTemplateRef("auroraInnerRef");
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

watch(
  () => landing.value.intro.entry.completed,
  (completed) => {
    if (completed && auroraRef.value && auroraInnerRef.value) {
      $gsap.to(auroraRef.value, {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
      });

      $gsap.to(auroraInnerRef.value, {
        yPercent: 20,
        rotation: 5,
        scale: 1.1,
        duration: 8,
        repeat: -1,
        yoyo: true,
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
    class="h-screen w-screen flex flex-col items-center justify-center fixed inset-0"
    :style="{ background: backgroundGradient }"
    :class="{
      'z-99': !landing.mainTitle.exit.completed,
    }"
  >
    <div
      ref="auroraRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 z-0"
    >
      <div
        ref="auroraInnerRef"
        class="w-[150vw] h-[20vh] blur-[40px]"
        style="
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            var(--color-gradient-green) 50%,
            #ffffff 100%
          );
          transform: rotate(-5deg);
        "
      ></div>
    </div>
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
      <CircleAudiowave class="w-14 h-14" primary :animating="isPlaying" />
    </div>
  </div>
</template>
