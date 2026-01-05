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

      const tl = $gsap.timeline({
        onStart: () => console.log("Timeline started"),
        onComplete: () => console.log("Timeline complete")
      });
      masterTl.value = tl;

      // DEBUG: Simple stagger to verify GSAP works
      tl.to(elements, {
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
      
      // Exit
      tl.to(elements, {
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.05,
        delay: 1
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