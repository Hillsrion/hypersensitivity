<template>
  <div class="flex items-center justify-center h-svh mx-auto z-10 relative">
    <div ref="wrapperRef" class="max-w-5xl px-4 opacity-0 translate-y-5">
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

const split = useSplitText(textRef, {
  splitBy: "lines, words",
  onComplete: (instance) => {
    $gsap.set(instance.lines, {
      y: 35,
      opacity: 0,
    });
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
      // todo
    },
  });
  split.words.value.forEach((wordEl, index) => {
    const timing = timings.value[index];
    if (timing) {
      wordTimeline.to(
        wordEl,
        {
          color: "#ffffff",
          duration: timing.end - timing.start,
          ease: "none",
        },
        timing.start
      );
    }
  });

  // Add word timeline to main timeline at the start
  tl.add(wordTimeline, "0");

  // Final fade out
  tl.to(split.lines.value, {
    y: -10,
    duration: 0.8,
    stagger: 0.03,
    opacity: 0,
    ease: "power4.out",
    onComplete: () => {
      animations.onIntroductionComplete();
      audioStore.stopCurrentAudio();
    },
  });
};

watch(
  () => animations.landing.intro.started,
  (started) => {
    if (started) {
      animate();
    }
  }
);

onBeforeUnmount(() => {
  split.revert();
});
</script>