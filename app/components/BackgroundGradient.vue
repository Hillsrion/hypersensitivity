<script setup lang="ts">
import { useAuroraAnimation } from "~/app/composables/useAuroraAnimation";

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();
const { landing } = storeToRefs(animationsStore);

const auroraRef = useTemplateRef("auroraRef");
const auroraInnerRef = useTemplateRef("auroraInnerRef");

const { backgroundGradient, animate } = useBackgroundGradient();

// Handle the gradient animation based on landing state
watch(
  () => landing.value.intro.entry.started,
  (started) => {
    if (started && import.meta.client) {
      animate(animationsStore.skipIntro ? 0 : 2);
    }
  },
  { immediate: true }
);

// Initialize Aurora Animation
useAuroraAnimation(auroraInnerRef, auroraRef);
</script>

<template>
  <div
    class="fixed inset-0 pointer-events-none"
    :style="{ background: backgroundGradient, zIndex: animationsStore.aurora.zIndex }"
  >
    <div
      ref="auroraRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden will-change-opacity backface-hidden opacity-0"
    >
      <div
        ref="auroraInnerRef"
        class="w-full h-full blur-[80px] scale-125 will-change-transform backface-hidden"
        :style="{
          background: `linear-gradient(180deg, #FFFFFF 0%, var(--aurora-color-1) 33%, var(--aurora-color-2) 66%, #FFFFFF 100%)`,
          transform: 'rotate(-3deg)',
        }"
      ></div>
    </div>
  </div>
</template>