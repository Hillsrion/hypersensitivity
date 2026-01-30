<script setup lang="ts">
import { useGameStore } from "~/stores/game";

const gameStore = useGameStore();
const { $gsap } = useNuxtApp();

const menuRef = ref<HTMLElement | null>(null);
const itemsRef = ref<HTMLElement[]>([]);

// Animation d'ouverture du menu
watch(
  () => gameStore.isMenuOpen,
  (isOpen) => {
    if (!menuRef.value) return;

    if (isOpen) {
      $gsap.fromTo(
        menuRef.value,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
      if (itemsRef.value.length) {
        $gsap.fromTo(
          itemsRef.value,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.1,
          }
        );
      }
    }
  }
);

// Grouper les milestones par jour
const milestonesByDay = computed(() => {
  const day1 = gameStore.milestones.filter((m) => m.day === 1);
  const day2 = gameStore.milestones.filter((m) => m.day === 2);
  return { day1, day2 };
});

const isMilestoneReached = (milestoneId: string) => {
  return gameStore.reachedMilestones.includes(milestoneId);
};

const handleMilestoneClick = (milestoneId: string) => {
  if (isMilestoneReached(milestoneId)) {
    gameStore.goToMilestone(milestoneId);
  }
};
</script>

<template>
  <Transition name="fade">
    <div
      v-if="gameStore.isMenuOpen"
      class="fixed inset-0 z-50"
      @click.self="gameStore.closeMenu()"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-white/40 backdrop-blur-xl" @click="gameStore.closeMenu()" />

      <!-- Menu Content -->
      <div
        ref="menuRef"
        class="absolute inset-0 flex flex-col items-center justify-between"
      >
        <!-- Top Toolbar -->
        <div class="w-full h-32 flex items-center justify-between px-12 md:px-18">
          <!-- Close Button -->
          <button
            class="text-primary hover:scale-110 transition-transform cursor-pointer"
            @click="gameStore.closeMenu()"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Wave Icon (Placeholder from design) -->
          <div class="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary/40">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M3 12c3-1.5 3-4.5 6-4.5s3 3 6 3 3-3 6-4.5" />
              <path d="M3 12c3 1.5 3 4.5 6 4.5s3-3 6-3 3 3 6 4.5" opacity="0.3" />
            </svg>
          </div>
        </div>

        <!-- Middle Section: Timeline -->
        <div class="relative w-full h-full flex items-center">
          <!-- Median Line -->
          <div class="absolute top-[55%] left-0 w-screen h-[1px] bg-primary/10" />

          <!-- Milestones Container -->
          <div class="relative w-full flex justify-around px-24">
            <div
              v-for="milestone in gameStore.milestones"
              :key="milestone.id"
              ref="itemsRef"
              class="relative flex flex-col items-center"
            >
              <!-- Title -->
              <div 
                class="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap origin-bottom-left -rotate-45"
              >
                <button
                  class="font-satoshi font-medium text-xl/8 transition-all duration-300"
                  :class="[
                    isMilestoneReached(milestone.id)
                      ? 'text-primary hover:text-primary/70 cursor-pointer'
                      : 'text-primary/20 cursor-not-allowed',
                  ]"
                  @click="handleMilestoneClick(milestone.id)"
                >
                  <span class="text-xs tracking-widest uppercase opacity-40 mr-1">JOUR {{ milestone.day }}</span>
                  <span class="mx-1 opacity-20">-</span>
                  <span>{{ milestone.label }}</span>
                </button>
              </div>

              <!-- Circle -->
              <div
                class="absolute top-[calc(55vh-0.5rem)] w-4 h-4 rounded-full border border-primary/20 bg-white transition-all duration-500"
                :class="{
                  'bg-primary border-primary': isMilestoneReached(milestone.id),
                  'opacity-20': !isMilestoneReached(milestone.id)
                }"
              />
            </div>
          </div>
        </div>

        <!-- Bottom Navigation -->
        <div class="w-full h-32 flex items-center justify-between px-12 md:px-18">
          <button
            class="flex items-center gap-2 font-satoshi text-xs tracking-[0.2em] uppercase text-primary/60 hover:text-primary transition-colors cursor-pointer"
            @click="gameStore.resetGame()"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            RECOMMENCER LE QUESTIONNAIRE
          </button>

          <NuxtLink
            to="/test"
            class="flex items-center gap-2 font-satoshi text-xs tracking-[0.2em] uppercase text-primary/60 hover:text-primary transition-colors cursor-pointer"
            @click="gameStore.closeMenu()"
          >
            TEST DU SPECTRE DE L'HYPERSENSIBILITÉ
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
