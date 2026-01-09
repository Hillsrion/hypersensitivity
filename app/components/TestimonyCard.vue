<template>
  <div
    ref="containerRef"
    class="relative rounded-2xl overflow-hidden flex flex-col cursor-pointer p-8 transition-colors duration-300 bg-white"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <!-- Border Animation -->
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none z-20"
      style="overflow: visible"
    >
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx="15"
        ry="15"
        fill="none"
        stroke-width="1"
        class="stroke-primary"
      />
      <rect
        ref="borderRect"
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx="15"
        ry="15"
        fill="none"
        stroke-width="2"
        :stroke="`var(--color-gradient-${color})`"
        class="opacity-0"
      />
    </svg>

    <!-- Aurora Background -->
    <div
      ref="auroraRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 z-0 overflow-hidden will-change-opacity backface-hidden"
    >
      <div
        ref="auroraInnerRef"
        class="w-full h-full blur-[60px] scale-125 will-change-transform backface-hidden"
        :style="{
          background: `linear-gradient(180deg, #ffffff 20%, var(--aurora-middle-color) 50%, #ffffff 80%)`,
          transform: 'rotate(-3deg)',
        }"
      ></div>
    </div>

    <!-- Quote Icon -->
    <div class="absolute left-8 top-8 z-10">
      <svg
        width="32"
        height="27"
        viewBox="0 0 32 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.9008 0L0.9437 15.2943H11.6676V27H0V15.2943L8.23592 0H16.9008ZM32 0L16.1287 15.2943H26.7668V27H15.0992V15.2943L23.3351 0H32Z"
          fill="#0B1018"
        />
      </svg>
    </div>

    <p
      id="textRef"
      ref="textRef"
      class="text-primary/60 font-light font-serif text-xl leading-tight mt-12 relative lg:mb-0 mb-8 z-10"
    >
      {{ content }}
    </p>
    <div class="flex w-full items-center justify-end mt-6">
      <p
        ref="authorRef"
        class="text-primary font-medium text-xl leading-[1.4] text-right relative z-10"
      >
        {{ author }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAudioStore } from "~/stores/audio";

const { $gsap: gsap } = useNuxtApp();

const audioStore = useAudioStore();
const containerRef = ref(null);
const borderRect = ref(null);
const textRef = ref(null);
const authorRef = ref(null);
const auroraRef = ref(null);
const auroraInnerRef = ref(null);
const isHovering = ref(false);

const props = defineProps({
  content: String,
  author: String,
  audio: String,
  color: String,
});

const isPlaying = computed(
  () =>
    audioStore.isPlaying && audioStore.currentAudio?.src.includes(props.audio)
);

const timings = computed(() => {
  return (
    audioStore.list.find((item) => item.path === props.audio)?.timings ?? []
  );
});
const duration = computed(() => {
  const d = audioStore.list.find((item) => item.path === props.audio)?.duration;
  return d || 5; // Fallback to 5s if no duration found
});

let currentAnimation = null;
let splitInstance = null;
let textAnimation = null;
let auroraAnimation = null;

onMounted(() => {
  if (textRef.value) {
    splitInstance = useSplitText(textRef, {
      splitBy: "words",
    });
  }

  // Set initial Aurora color
  if (props.color && auroraInnerRef.value) {
    const style = getComputedStyle(document.documentElement);
    const colorHex = style
      .getPropertyValue(`--color-gradient-${props.color}`)
      .trim();
    if (colorHex) {
      auroraInnerRef.value.style.setProperty("--aurora-middle-color", colorHex);
    }
  }

  // Start Aurora floating animation
  if (auroraInnerRef.value) {
    auroraAnimation = gsap.to(auroraInnerRef.value, {
      xPercent: 15,
      yPercent: 20,
      rotation: 10,
      scale: 1.2,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      paused: false, // Always floating
    });
  }

  // Initialize border
  if (borderRect.value) {
    const length = borderRect.value.getTotalLength();
    gsap.set(borderRect.value, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 0,
    });
  }
});

const handleHover = async (val) => {
  isHovering.value = val;
  if (val) {
    if (props.audio) {
      // Set volume to 0.6 for testimonies
      audioStore.setVolume(0.6);
      await audioStore.playAudio(props.audio);
    }
  } else {
    if (isPlaying.value) {
      await audioStore.stopCurrentAudio();
      // Reset volume to default 0.8
      audioStore.setVolume(0.8);
    }
  }
};

const startAnimations = () => {
  // Kill all ongoing animations
  if (currentAnimation) {
    currentAnimation.kill();
  }
  if (textAnimation) {
    textAnimation.kill();
  }

  // Border animation
  if (borderRect.value) {
    const length = borderRect.value.getTotalLength();
    // Reset to start
    gsap.set(borderRect.value, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });

    currentAnimation = gsap.to(borderRect.value, {
      strokeDashoffset: 0,
      duration: duration.value,
      ease: "none",
    });
  }

  // Text opacity animations (Karaoke effect)
  if (splitInstance?.words.value) {
    // Immediately dim all words to inactive state
    gsap.to(splitInstance.words.value, {
      opacity: 0.6,
      duration: 0.3,
      ease: "power2.out",
    });

    const timeline = gsap.timeline();
    splitInstance.words.value.forEach((wordEl, index) => {
      const timing = timings.value[index];
      if (timing) {
        // Animate word to full opacity when it's spoken
        timeline.to(
          wordEl,
          {
            opacity: 1,
            duration: 0.1, // Quick transition to active
            ease: "none",
          },
          timing.start
        );
      }
    });
    textAnimation = timeline;
  }
};

const stopAnimations = () => {
  // Border animation
  if (borderRect.value) {
    const length = borderRect.value.getTotalLength();
    currentAnimation = gsap.to(borderRect.value, {
      strokeDashoffset: length,
      duration: 1,
      ease: "power3.out",
      onComplete: () => {
        gsap.to(borderRect.value, {
          opacity: 0,
          duration: 0.3,
        });
      },
    });
  }

  // Reset text opacity
  if (splitInstance?.words.value) {
    gsap.killTweensOf(splitInstance.words.value);
    textAnimation = gsap.to(splitInstance.words.value, {
      opacity: 1,
      duration: 0.4,
      stagger: {
        each: 0.01,
        from: "start",
      },
      ease: "power2.out",
    });
  }
};

// Handle Aurora visibility separately for immediate feedback
watch(isHovering, (hovering) => {
  console.log("hovering");

  if (auroraRef.value) {
    gsap.to(auroraRef.value, {
      opacity: hovering ? 1 : 0,
      duration: 1,
      ease: "power2.inOut",
    });
  }
});

watch(isPlaying, (playing) => {
  if (playing) {
    startAnimations();
  } else {
    stopAnimations();
  }
});

onUnmounted(() => {
  if (splitInstance) {
    splitInstance.revert();
  }
  if (props.audio && isPlaying.value) {
    audioStore.stopCurrentAudio();
    audioStore.setVolume(0.8);
  }
  if (auroraAnimation) {
    auroraAnimation.kill();
  }
});

defineExpose({
  textRef,
  containerRef,
});
</script>