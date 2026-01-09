<template>
  <div 
    ref="containerRef"
    class="relative rounded-2xl shadow-sm overflow-hidden flex flex-col cursor-pointer p-8 transition-colors duration-300 bg-white border border-neutral-100" 
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
      <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.9008 0L0.9437 15.2943H11.6676V27H0V15.2943L8.23592 0H16.9008ZM32 0L16.1287 15.2943H26.7668V27H15.0992V15.2943L23.3351 0H32Z" fill="#0B1018"/>
      </svg>
    </div>

    <!-- Play Icon -->
    <div v-if="audio" class="absolute left-8 bottom-8 z-10">
      <div class="relative">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          class="w-7 h-7 absolute transition-all duration-300"
          :style="{ opacity: isHovered ? 0 : 1, transform: isHovered ? 'scale(0.8)' : 'scale(1)' }"
        >
          <path 
            d="M8 7v10l8-5L8 7z"
            fill="#0b1018"
            class="transition-all duration-300"
          />
        </svg>

        <!-- Wave Animation -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 21 21" 
          class="w-7 h-7 absolute transition-all duration-300"
          :style="{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'scale(1)' : 'scale(1.2)' }"
        >
          <g 
            fill="none" 
            fill-rule="evenodd" 
            stroke="#0b1018" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1.5"
          >
            <path class="wave-line wave-1" d="m6.5 8.5v4"/>
            <path class="wave-line wave-2" d="m8.5 6.5v9"/>
            <path class="wave-line wave-3" d="m10.5 9.5v2"/>
            <path class="wave-line wave-4" d="m12.5 7.5v6.814"/>
            <path class="wave-line wave-5" d="m14.5 4.5v12"/>
          </g>
        </svg>
      </div>
    </div>
    <svg 
      class="absolute inset-0 w-full h-full pointer-events-none z-20"
      :viewBox="`0 0 ${containerWidth} ${containerHeight}`"
    >
      <rect
        ref="borderRect"
        x="0"
        y="0"
        :width="containerWidth"
        :height="containerHeight"
        fill="none"
        stroke="#0b1018"
        stroke-width="9"
        opacity="0"
        :style="`stroke-dasharray: ${perimeter}; vector-effect: non-scaling-stroke;`"
        rx="1rem"
        ry="1rem"
      />
    </svg>

    <p id="textRef" ref="textRef" class="text-primary text-xl sm:text-[1.35rem] mt-12 relative lg:mb-0 mb-8 font-epilogue z-10">"{{ content }}"</p>
    <div class="flex w-full justify-end relative mt-auto z-10">
      <div class="relative">
        <p 
          ref="authorRef" 
          class="text-primary absolute inset-0 right-0 text-right w-max ml-auto"
          :class="authorClasses"
          :style="{ opacity: isHovered ? 0 : 1 }"
        >
          {{ author }}
        </p>
        <p 
          ref="authorGradientRef" 
          class="text-primary text-right w-max ml-auto"
          :class="authorClasses"
          :style="{ opacity: isHovered ? 1 : 0 }"
        >
          {{ author }}
        </p>
      </div>
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

const isPlaying = computed(() => audioStore.isPlaying && audioStore.currentAudio?.src.includes(props.audio));

const timings = computed(() => {
  return audioStore.list.find(item => item.path === props.audio)?.timings ?? [];
});
const duration = computed(() => {
  return audioStore.list.find(item => item.path === props.audio)?.duration ?? 0;
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
const authorClasses = "text-lg sm:text-xl font-semibold font-epilogue";

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
    const colorHex = style.getPropertyValue(`--color-gradient-${props.color}`).trim();
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
      paused: false // Always floating
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
      },
    );

    // Text opacity animations (Karaoke effect)
    if (splitInstance?.words.value) {
      // Immediately dim all words to inactive state
      gsap.to(splitInstance.words.value, {
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out"
      });

      const timeline = gsap.timeline();
      splitInstance.words.value.forEach((wordEl, index) => {
        const timing = timings.value[index];
        if (timing) {
          // Animate word to full opacity when it's spoken
          timeline.to(wordEl, {
            opacity: 1,
            duration: 0.1, // Quick transition to active
            ease: "none",
          }, timing.start);
        }
      });
      textAnimation = timeline;
    }
    
    if(authorRef.value && authorGradientRef.value) {
      // Author transition
      gsap.to([authorRef.value, authorGradientRef.value], {
        opacity: (_i, el) => el === authorRef.value ? 0 : 1,
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

    // Author transition
    gsap.to(authorGradientRef.value, {
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
    });
    gsap.to(authorRef.value, {
      opacity: 1,
      duration: 0.8,
      ease: "power3.inOut",
    });

    if(props.audio) {
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
  containerRef
});
</script>

<style scoped>
 @keyframes wave {
  0%, 100% {
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
