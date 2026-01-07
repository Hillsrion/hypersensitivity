<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Array,
    required: true,
  },
});

const { $gsap } = useNuxtApp();
const containerRef = ref(null);
const duplicatesRef = ref([]);

onMounted(() => {
  if (!containerRef.value || duplicatesRef.value.length === 0) return;

  duplicatesRef.value.forEach((el, index) => {
    const scale = 0.85;
    const finalScale = Math.pow(scale, index + 1);
    const initialScale = 1 + (index + 1) * 0.15;

    $gsap.fromTo(
      el,
      { scale: initialScale },
      {
        scale: finalScale,
        ease: "power2.out",
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: containerRef.value,
          start: "top center",
          end: "bottom top",
          scrub: 1,
        },
      }
    );
  });
});
</script>

<template>
  <section>
    <div
      class="container mx-auto max-w-3xl h-svh flex flex-col items-center justify-center"
    >
      <div ref="containerRef" class="relative w-full mb-8 flex justify-center">
        <!-- Main Title -->
        <h2
          class="relative z-10 text-[3.5rem] leading-18 font-serif font-light text-center bg-white"
        >
          {{ title }}
        </h2>
        <!-- Duplicates -->
        <h2
          v-for="i in 4"
          :key="i"
          ref="duplicatesRef"
          class="absolute top-0 w-full z-0 bg-white text-[3.5rem] leading-18 font-serif font-light text-center select-none pointer-events-none opacity-40"
          aria-hidden="true"
        >
          {{ title }}
        </h2>
      </div>

      <ul class="max-w-lg mx-auto flex flex-col gap-y-4 relative z-10">
        <li v-for="(item, index) in content" :key="index">
          <p class="text-xl text-primary/80">
            {{ item }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
