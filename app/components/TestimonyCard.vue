<template>
  <div 
    ref="containerRef"
    class="relative rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer p-5 transition-colors duration-300" 
    :style="{ backgroundColor: `var(--color-gradient-${color})` }"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <!-- Play Icon -->
    <div v-if="audio" class="absolute left-5 bottom-[2.75rem] z-10">
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
      class="absolute inset-0 w-full h-full pointer-events-none"
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

    <p id="textRef" ref="textRef" class="text-primary text-xl sm:text-[1.35rem] mt-4 relative lg:mb-0 mb-8 font-epilogue">"{{ content }}"</p>
    <div class="flex w-full justify-end relative mt-auto">
      <div class="relative">
        <p 
          ref="authorRef" 
          class="text-primary absolute inset-0"
          :class="authorClasses"
          :style="{ opacity: isHovered ? 0 : 1 }"
        >
          {{ author }}
        </p>
        <p 
          ref="authorGradientRef" 
          class="text-primary"
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

    // Text color animations
    if (splitInstance?.words.value) {
      const timeline = gsap.timeline();
      splitInstance.words.value.forEach((wordEl, index) => {
        const timing = timings.value[index];
        if (timing) {
          timeline.to(wordEl, {
            color: "#ffffff", // White text highlighting
            duration: (timing.end - timing.start),
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

    // Text color animations
    if (splitInstance?.words.value) {
      gsap.killTweensOf(splitInstance.words.value);
      textAnimation = gsap.to(splitInstance.words.value, {
        color: "#0b1018", // Reset to primary color
        duration: 0.4,
        stagger: {
          each: 0.02,
          from: "end",
        },
        ease: "power4.out",
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
