<script setup lang="ts">
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

const auroraSteps = {
  1: ["#C6FFE9", "#A2CCFD"],
  2: ["#A2CCFD", "#DECAFE"],
  3: ["#DECAFE", "#FFB8E4"],
  4: ["#FFB8E4", "#FFC1C3"],
  5: ["#FFC1C3", "#FAC087"],
  6: ["#FAC087", "#FDEDB3"],
  7: ["#FAC087", "#FDEDB3"],
  8: ["#FDEDB3", "#C6FFE9"],
  9: ["#C6FFE9", "#A2CCFD"],
};

onMounted(() => {
  const style = getComputedStyle(document.documentElement);
  const initialColor = style.getPropertyValue("--color-gradient-green").trim();
  if (initialColor && auroraInnerRef.value) {
    // Set initial CSS variables
    auroraInnerRef.value.style.setProperty("--aurora-color-1", "#FFFFFF");
    auroraInnerRef.value.style.setProperty(
      "--aurora-color-2",
      initialColor || "#C6FFE9"
    );
  }
});

// Watch for specific step changes (from Milestone Menu)
watch(
  () => animationsStore.aurora.colorStep,
  (step) => {
    const colors = auroraSteps[step as keyof typeof auroraSteps];
    if (colors && auroraInnerRef.value) {
      $gsap.to(auroraInnerRef.value, {
        "--aurora-color-1": colors[0],
        "--aurora-color-2": colors[1],
        duration: 2,
        ease: "power2.inOut",
      });
    }
  }
);

// Consolidated Rainbow/Auto-Animation Logic
let autoRotateTl: any = null;

const startRainbowSequence = () => {
  if (!auroraInnerRef.value) return;
  
  if (autoRotateTl) autoRotateTl.kill();
  autoRotateTl = $gsap.timeline({ repeat: -1 });

  // Cycle through all steps
  Object.values(auroraSteps).forEach((colors) => {
    autoRotateTl.to(auroraInnerRef.value, {
      "--aurora-color-1": colors[0],
      "--aurora-color-2": colors[1],
      duration: 3,
      ease: "power2.inOut",
    });
  });
};

const stopRainbowSequence = () => {
  if (autoRotateTl) {
    autoRotateTl.kill();
    autoRotateTl = null;
  }
};

const isRainbowMode = computed(() => {
  return (
    animationsStore.aurora.autoAnimate ||
    animationsStore.aurora.color === "aurora" ||
    animationsStore.aurora.color === "rainbow"
  );
});

watch(
  isRainbowMode,
  (active) => {
    if (active) {
      startRainbowSequence();
    } else {
      stopRainbowSequence();
    }
  },
  { immediate: true }
);

watch(
  () => animationsStore.aurora.color,
  (newColor) => {
    if (newColor === "aurora" || newColor === "rainbow") return; // Handled by isRainbowMode

    const style = getComputedStyle(document.documentElement);
    const newHex = style
      .getPropertyValue(`--color-gradient-${newColor}`)
      .trim();
    
    if (newHex && auroraInnerRef.value) {
      // If we are switching away from rainbow mode, we might want to ensure the timeline is stopped
      // But isRainbowMode watcher should handle that.
      // Here we just apply the single color.
      
      // Animate the CSS variable directly - fallback for single color usage
      $gsap.to(auroraInnerRef.value, {
        "--aurora-color-1": newHex,
        "--aurora-color-2": newHex,
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
    class="fixed inset-0 pointer-events-none"
    :style="{ background: backgroundGradient, zIndex: animationsStore.aurora.zIndex }"
  >
    <div
      ref="auroraRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden will-change-opacity backface-hidden"
      :class="{ 'opacity-100': animationsStore.aurora.visible, 'opacity-0': !animationsStore.aurora.visible }"
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