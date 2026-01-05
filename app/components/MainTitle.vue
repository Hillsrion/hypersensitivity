<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const { $gsap } = useNuxtApp();
const titleRef = ref(null);
const { chars } = useSplitText(titleRef, { splitBy: "chars,words" });
const masterTl = ref(null);

watch(chars, (newChars) => {
  if (newChars && newChars.length) {
    nextTick(() => {
      // Kill previous
      if (masterTl.value) masterTl.value.kill();

      const elements = toRaw(newChars);

      // Force start state
      $gsap.set(elements, { autoAlpha: 0 });

      const tl = $gsap.timeline();
      masterTl.value = tl;

      // Wave animation timing
      // Each letter takes 3 phases to fully appear
      // Stagger = 1 phase, so 3 letters animate simultaneously
      const phaseTime = 0.1;
      const letterDuration = phaseTime * 3;

      // Entry: wave effect with overlapping opacity
      // n at 20% → n at 80% + n+1 at 20% → n at 100% + n+1 at 80% + n+2 at 20%
      tl.to(elements, {
        keyframes: [
          { autoAlpha: 0.2, duration: phaseTime, ease: "power1.out" },
          { autoAlpha: 0.8, duration: phaseTime, ease: "power1.inOut" },
          { autoAlpha: 1, duration: phaseTime, ease: "power1.in" }
        ],
        stagger: phaseTime
      });

      // Pause
      tl.to({}, { duration: 1 });

      // Exit: same direction (first letter disappears first)
      tl.to(elements, {
        keyframes: [
          { autoAlpha: 0.8, duration: phaseTime, ease: "power1.out" },
          { autoAlpha: 0.2, duration: phaseTime, ease: "power1.inOut" },
          { autoAlpha: 0, duration: phaseTime, ease: "power1.in" }
        ],
        stagger: phaseTime
      });
    });
  }
}, { immediate: true });
</script>

<template>
  <h1 ref="titleRef" class="text-7xl font-bold text-white">
    {{ title }}
  </h1>
</template>