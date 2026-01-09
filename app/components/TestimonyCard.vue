<template>
  <div
    ref="containerRef"
    class="relative rounded-2xl overflow-hidden flex flex-col cursor-pointer p-8 transition-colors duration-300 bg-white border border-primary"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
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
      class="text-primary/60 font-light font-serif text-xl leading-[1.4] mt-12 relative lg:mb-0 mb-8 z-10"
    >
      {{ content }}
    </p>
    <div class="flex w-full items-center justify-between mt-6">
      <svg
        width="12"
        height="14"
        viewBox="0 0 12 14"
        fill="none"
        class="transition-all duration-300"
        :style="{
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? 'scale(0.8)' : 'scale(1)',
        }"
      >
        <path
          d="M12 6.92773L3.01142e-07 13.8559L9.06825e-07 -0.000469255L12 6.92773Z"
          fill="#0B1018"
        />
      </svg>
      <p
        ref="authorRef"
        class="text-primary font-medium text-xl leading-[1.4] text-right w-max ml-auto"
        :style="{ opacity: isHovered ? 0 : 1 }"
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
const isHovered = ref(false);
const containerRef = ref(null);
const borderRect = ref(null);
const textRef = ref(null);
const containerWidth = ref(0);
const containerHeight = ref(0);
const perimeter = ref(0);
const authorRef = ref(null);
const authorGradientRef = ref(null);
const auroraRef = ref(null);
const auroraInnerRef = ref(null);

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
  return (
    audioStore.list.find((item) => item.path === props.audio)?.duration ?? 0
  );
});

const props = defineProps({
  content: String,
  author: String,
  audio: String,
  color: String,
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

  if (containerRef.value) {
    const updateDimensions = () => {
      const rect = containerRef.value.getBoundingClientRect();
      containerWidth.value = rect.width;
      containerHeight.value = rect.height;
      perimeter.value = (containerWidth.value + containerHeight.value) * 2;

      gsap.set(borderRect.value, {
        strokeDashoffset: perimeter.value,
        opacity: 0,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
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
});

const handleHover = async (_isHovered) => {
  isHovered.value = _isHovered;

  // Kill all ongoing animations
  if (currentAnimation) {
    currentAnimation.kill();
  }
  if (textAnimation) {
    textAnimation.kill();
  }

  if (_isHovered) {
    if (props.audio) {
      await audioStore.playAudio(props.audio);
    }

    // Aurora Fade In
    if (auroraRef.value) {
      gsap.to(auroraRef.value, {
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      });
    }

    currentAnimation = gsap.fromTo(
      borderRect.value,
      {
        strokeDashoffset: perimeter.value,
        opacity: 1,
      },
      {
        strokeDashoffset: 0,
        duration: duration.value,
        ease: "none",
      }
    );

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

    if (authorRef.value) {
      // Author transition
      gsap.to([authorRef.value], {
        opacity: (_i, el) => (el === authorRef.value ? 0 : 1),
        duration: 0.6,
        ease: "power2.out",
      });
    }
  } else {
    // Aurora Fade Out
    if (auroraRef.value) {
      gsap.to(auroraRef.value, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    }

    // Border animation
    currentAnimation = gsap.to(borderRect.value, {
      strokeDashoffset: perimeter.value,
      duration: 1,
      ease: "power3.out",
      onComplete: () => {
        gsap.to(borderRect.value, {
          opacity: 0,
          duration: 0.3,
        });
      },
    });

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

    gsap.to(authorRef.value, {
      opacity: 1,
      duration: 0.8,
      ease: "power3.inOut",
    });

    if (props.audio) {
      await audioStore.stopCurrentAudio();
    }
  }
};

onUnmounted(() => {
  if (splitInstance) {
    splitInstance.revert();
  }
  if (props.audio) {
    audioStore.stopCurrentAudio();
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

<style scoped>
@keyframes wave {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

.wave-line {
  transform-origin: center center;
  transform-box: fill-box;
  opacity: 1;
  transform: scaleY(1);
}

.wave-1 {
  animation: wave 0.8s ease-in-out infinite;
}

.wave-2 {
  animation: wave 1s ease-in-out infinite;
  animation-delay: 0.1s;
}

.wave-3 {
  animation: wave 0.6s ease-in-out infinite;
  animation-delay: 0.2s;
}

.wave-4 {
  animation: wave 0.9s ease-in-out infinite;
  animation-delay: 0.15s;
}

.wave-5 {
  animation: wave 0.7s ease-in-out infinite;
  animation-delay: 0.25s;
}
</style>
