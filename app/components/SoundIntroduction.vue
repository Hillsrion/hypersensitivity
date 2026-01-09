<template>
  <div
    ref="containerRef"
    class="flex items-center justify-center h-svh mx-auto z-10 relative"
  >
    <div ref="wrapperRef" class="max-w-5xl px-4 opacity-0">
      <p
        ref="textRef"
        class="text-[2.75rem] text-primary leading-16 font-serif font-italic font-light"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAudioStore } from "@/stores/audio";
import { useAnimationsStore } from "@/stores/animations";

const audioStore = useAudioStore();
const { $gsap } = useNuxtApp();
const animations = useAnimationsStore();
const { animateToWhite } = useBackgroundGradient();

const containerRef = ref(null);
const wrapperRef = ref(null);
const textRef = ref(null);

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  isAnimated: {
    type: Boolean,
    default: false,
  },
  audio: {
    type: String,
    required: true,
  },
  timings: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  const scrollTl = $gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: "center center",
      end: "bottom top",
      scrub: true,
    },
  });

  scrollTl.add(animateToWhite());
});

const split = useSplitText(textRef, {
  splitBy: "lines, words",
  onComplete: (instance) => {
    if (animations.skipIntro) {
      $gsap.set(wrapperRef.value, { opacity: 1, y: 0 });
      $gsap.set(instance.lines, { opacity: 1, y: 0 });
      $gsap.set(instance.words, { opacity: 1 });
    } else {
      $gsap.set(instance.words, {
        opacity: 0.2,
      });
    }
  },
});

const tl = $gsap.timeline({
  defaults: {
    ease: "power3.out",
  },
});

tl.pause();

const timings = computed(() => {
  return (
    audioStore.list.find((item) => item.path === props.audio)?.timings ?? []
  );
});

const animate = () => {
  tl.play();

  // Initial wrapper fade in
  tl.to(wrapperRef.value, {
    opacity: 1,
    y: 0,
    duration: 1,
  });

  // Lines fade in
  tl.to(split.lines.value, {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: "power4.out",
  });

  // Create timeline for word animations based on timings
  const wordTimeline = $gsap.timeline({
    onStart: () => {
      audioStore.playAudio(props.audio);
    },
    onComplete: () => {
      animations.onIntroEntryComplete();
      audioStore.stopCurrentAudio();
    },
  });

  split.words.value.forEach((wordEl, index) => {
    const timing = timings.value[index];
    if (timing) {
      wordTimeline.to(
        wordEl,
        {
          opacity: 1,
          duration: timing.end - timing.start,
          ease: "none",
        },
        timing.start
      );
    }
  });

  // Add word timeline after the initial animations (wrapper fade in + lines fade in)
  tl.add(wordTimeline, "0");
};

watch(
  () => animations.landing.intro.entry.started,
  (started) => {
    if (started) {
      animate();
    }
  }
);
</script>