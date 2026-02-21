<script setup lang="ts">

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
  
  // Kill any existing animation
  if (autoRotateTl) {
    autoRotateTl.kill();
    autoRotateTl = null;
  }

  // Phase 1: Entry - Smoothly transition to the start of the loop (Step 1)
  // We use a simple tween first to ensure we get to the starting block of our loop
  // from wherever we currently are.
  const step1Colors = auroraSteps[1];
  
  autoRotateTl = $gsap.timeline();
  
  // Tween to start position
  autoRotateTl.to(auroraInnerRef.value, {
    "--aurora-color-1": step1Colors[0],
    "--aurora-color-2": step1Colors[1],
    duration: 3,
    ease: "power2.inOut",
  });

  // Phase 2: Infinite Loop
  // We construct a looping timeline that goes from Step 2 -> ... -> Step 9
  // Since Step 9 is identical to Step 1, this creates a seamless loop.
  const loopTl = $gsap.timeline({ repeat: -1 });
  
  // Add steps 2 through 9 to the loop
  // keys are strings "1", "2"... so we iterate carefully
  for (let i = 2; i <= 9; i++) {
    const colors = auroraSteps[i as keyof typeof auroraSteps];
    loopTl.to(auroraInnerRef.value, {
      "--aurora-color-1": colors[0],
      "--aurora-color-2": colors[1],
      duration: 3,
      ease: "linear", // Linear ease for the loop segments to keep constant speed
    });
  }

  // Append the loop to the main timeline
  autoRotateTl.add(loopTl);
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
    let newHex = style
      .getPropertyValue(`--color-gradient-${newColor}`)
      .trim();
    
    // Fallback map if CSS var is missing
    if (!newHex) {
      const colorMap: Record<string, string> = {
        red: "#ffc1c3",
        pink: "#ffb8e4",
        blue: "#a2ccfd",
        green: "#c6ffe9",
        yellow: "#fdedb3",
        violet: "#decafe",
        white: "#FFFFFF",
      };
      newHex = colorMap[newColor] || "";
    }

    if (newHex && auroraInnerRef.value) {
      // If the aurora is not currently visible, we set the color immediately 
      // so it's ready when the opacity animation starts.
      const isCurrentlyVisible = animationsStore.aurora.visible;
      
      $gsap.to(auroraInnerRef.value, {
        "--aurora-color-1": newHex,
        "--aurora-color-2": newHex,
        duration: isCurrentlyVisible ? 2 : 0,
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
  },
  { immediate: true }
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