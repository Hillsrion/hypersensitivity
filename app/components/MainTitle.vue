<script setup>
import { useAnimationsStore } from "~/stores/animations";
import { storeToRefs } from "pinia";

defineProps({
  title: {
    type: String,
    required: true,
  },
});

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();
const { landing } = storeToRefs(animationsStore);
const titleRef = ref(null);
const { chars } = useSplitText(titleRef, { splitBy: "chars,words" });

watch(
  chars,
  (newChars) => {
    if (newChars && newChars.length) {
      nextTick(() => {
        const elements = toRaw(newChars);

        // Force start state
        $gsap.set(elements, { autoAlpha: 0 });

        // Wave animation timing
        // Each letter takes 3 phases to fully appear
        // Stagger = 1 phase, so 3 letters animate simultaneously
        const phaseTime = 0.1;

        // Entry: wave effect with overlapping opacity
        // n at 20% → n at 80% + n+1 at 20% → n at 100% + n+1 at 80% + n+2 at 20%
        $gsap.to(elements, {
          keyframes: [
            { autoAlpha: 0.2, duration: phaseTime, ease: "power1.out" },
            { autoAlpha: 0.8, duration: phaseTime, ease: "power1.inOut" },
            { autoAlpha: 1, duration: phaseTime, ease: "power1.in" },
          ],
          stagger: phaseTime,
          onComplete: () => {
            animationsStore.onTitleEntryComplete();
          },
        });
      });
    }
  },
  { immediate: true }
);

watch(
  () => landing.value.mainTitle.exit.started,
  (started) => {
    if (started && chars.value && chars.value.length) {
      const elements = toRaw(chars.value);
      const phaseTime = 0.1;

      // Exit: same direction (first letter disappears first)
      $gsap.to(elements, {
        keyframes: [
          { autoAlpha: 0.8, duration: phaseTime, ease: "power1.out" },
          { autoAlpha: 0.2, duration: phaseTime, ease: "power1.inOut" },
          { autoAlpha: 0, duration: phaseTime, ease: "power1.in" },
        ],
        stagger: phaseTime,
        onComplete: () => {
          animationsStore.onTitleExitComplete();
        },
      });
    }
  }
);
</script>

<template>
  <h1 ref="titleRef" class="text-[5rem] font-epilogue font-semibold text-white">
    {{ title }}
  </h1>
</template>