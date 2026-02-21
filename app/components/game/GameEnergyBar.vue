<script setup lang="ts">

const gameStore = useGameStore();
const { $gsap } = useNuxtApp();

const fillRef = useTemplateRef('fillRef');
const animatedEnergy = ref(gameStore.energyPercentage);

// Animation de la barre d'energie quand elle change
watch(
  () => gameStore.energyPercentage,
  (newEnergy) => {
    $gsap.to(animatedEnergy, {
      value: newEnergy,
      duration: 1.5,
      ease: "expo.out",
    });
  }
);
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="border border-current p-0.5 rounded-full">
      <div class="relative w-1 h-62.5 rounded-full overflow-hidden">
        <div
          ref="fillRef"
          class="absolute bottom-0 left-0 rounded-full w-full bg-current"
          :style="{ height: `${animatedEnergy}%` }"
        />
      </div>
    </div>
    <svg
      width="10"
      height="15"
      viewBox="0 0 10 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="text-current"
    >
      <path
        d="M4.81934 5.48047L4.75684 6.03613H9.41602L4.6582 14.1729L5.13086 9.96387H5.18457V9.46387L4.68457 9.43555V8.96387H0.583984L5.34082 0.826172L4.81934 5.48047Z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  </div>
</template>
