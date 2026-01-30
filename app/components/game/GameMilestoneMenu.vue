<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useAnimationsStore } from "~/stores/animations";

const gameStore = useGameStore();
const animationsStore = useAnimationsStore();
const { $gsap } = useNuxtApp();

const menuRef = ref<HTMLElement | null>(null);
const itemsRef = ref<HTMLElement[]>([]);

// Filtered milestones (only reached)
const visibleMilestones = computed(() => {
  return gameStore.milestones.filter((m) =>
    gameStore.reachedMilestones.includes(m.id)
  );
});

// Animation d'ouverture du menu
watch(
  () => gameStore.isMenuOpen,
  (isOpen) => {
    if (!menuRef.value) return;

    if (isOpen) {
      // Show Aurora
      animationsStore.setAuroraVisibility(true);

      // Aurora color sequence (steps 1-9)
      const auroraTl = $gsap.timeline({ repeat: -1 });
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((step, index) => {
        auroraTl.call(() => animationsStore.setAuroraStep(step), [], index * 3);
      });

      $gsap.fromTo(
        menuRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      if (itemsRef.value.length) {
        $gsap.fromTo(
          itemsRef.value,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }
    } else {
      // Hide Aurora
      animationsStore.setAuroraVisibility(false);
    }
  }
);

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
      class="fixed inset-0 z-[60]"
      @click.self="gameStore.closeMenu()"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 backdrop-blur-xl"
        @click="gameStore.closeMenu()"
      />

      <!-- Menu Content -->
      <div
        ref="menuRef"
        class="absolute inset-0 flex flex-col items-center justify-between pointer-events-none"
      >
        <!-- Top Toolbar -->
        <div
          class="w-full h-32 flex items-center justify-between px-12 md:px-18 pointer-events-auto"
        >
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

          <!-- Wave Icon -->
          <div
            class="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary/40"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            >
              <path d="M3 12c3-1.5 3-4.5 6-4.5s3 3 6 3 3-3 6-4.5" />
              <path
                d="M3 12c3 1.5 3 4.5 6 4.5s3-3 6-3 3 3 6 4.5"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>

        <!-- Middle Section: Timeline -->
        <div class="relative w-full h-full flex items-center overflow-hidden pointer-events-auto">
          <!-- Median Line -->
          <div
            class="absolute top-[55%] left-0 w-full h-[1px] bg-primary/10"
          />

          <!-- Milestones Container (Horizontal Scroll) -->
          <div
            class="relative w-full h-full flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-[12vw]"
          >
            <div
              class="flex items-center min-w-full"
            >
              <div
                v-for="milestone in visibleMilestones"
                :key="milestone.id"
                ref="itemsRef"
                class="relative flex-none w-1/4 min-w-[250px] flex flex-col items-center snap-center"
              >
                <!-- Title -->
                <div
                  class="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap origin-bottom-left -rotate-45"
                >
                  <button
                    class="font-satoshi font-medium text-xl/8 transition-all duration-300 text-primary hover:text-primary/70 cursor-pointer"
                    @click="handleMilestoneClick(milestone.id)"
                  >
                    <span class="text-xs tracking-widest uppercase opacity-40 mr-1"
                      >JOUR {{ milestone.day }}</span
                    >
                    <span class="mx-1 opacity-20">-</span>
                    <span>{{ milestone.label }}</span>
                  </button>
                </div>

                <!-- Circle -->
                <div
                  class="absolute top-[55vh] -translate-y-1/2 w-4 h-4 rounded-full border border-primary bg-primary transition-all duration-500 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Navigation -->
        <div
          class="w-full h-32 flex items-center justify-between px-12 md:px-18 pointer-events-auto"
        >
          <button
            class="flex items-center gap-2 font-satoshi text-xs tracking-[0.2em] uppercase text-primary/60 hover:text-primary transition-colors cursor-pointer"
            @click="gameStore.resetGame()"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
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
