<script setup>
import { useAnimationsStore } from "~/stores/animations";
import { storeToRefs } from "pinia";

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

onMounted(() => {
  const style = getComputedStyle(document.documentElement);
  const initialColor = style.getPropertyValue("--color-gradient-green").trim();
  if (initialColor && auroraInnerRef.value) {
    // Set initial CSS variable
    auroraInnerRef.value.style.setProperty(
      "--aurora-middle-color",
      initialColor
    );
  }
});

watch(
  () => animationsStore.aurora.color,
  (newColor) => {
    const style = getComputedStyle(document.documentElement);
    const newHex = style
      .getPropertyValue(`--color-gradient-${newColor}`)
      .trim();
    if (newHex && auroraInnerRef.value) {
      // Animate the CSS variable directly
      $gsap.to(auroraInnerRef.value, {
        "--aurora-middle-color": newHex,
        duration: 2,
        ease: "power2.inOut",
      });
    }
  }
);

watch(
  () => animationsStore.aurora.visible,
  (visible) => {
    if (auroraRef.value) {
      $gsap.to(auroraRef.value, {
        opacity: visible ? 1 : 0,
        duration: 1,
        ease: "power2.inOut",
      });
    }
  }
);

watch(
  () => landing.value.intro.entry.completed,
  (completed) => {
    if (completed && auroraInnerRef.value) {
      $gsap.to(auroraInnerRef.value, {
        xPercent: 15,
        yPercent: 20,
        rotation: 10,
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }
);
</script>

<template>
  <div
    class="fixed inset-0 pointer-events-none z-0"
    :style="{ background: backgroundGradient }"
  >
    <div
      ref="auroraRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 z-0 overflow-hidden will-change-opacity backface-hidden"
    >
      <div
        ref="auroraInnerRef"
        class="w-full h-full blur-[80px] scale-125 will-change-transform backface-hidden"
        :style="{
          background: `linear-gradient(180deg, #ffffff 20%, var(--aurora-middle-color) 50%, #ffffff 80%)`,
          transform: 'rotate(-3deg)',
        }"
      ></div>
    </div>
  </div>
</template>