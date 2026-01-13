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
      <div class="absolute inset-0 bg-black/20" @click="gameStore.closeMenu()" />

      <!-- Menu Panel -->
      <div
        ref="menuRef"
        class="absolute top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-sm shadow-xl p-8 pt-24"
      >
        <!-- Close Button -->
        <button
          class="absolute top-8 right-8 text-primary hover:text-primary/70 transition-colors"
          @click="gameStore.closeMenu()"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Title -->
        <h2 class="font-serif text-2xl text-primary mb-8">Chapitres</h2>

        <!-- Day 1 Milestones -->
        <div class="mb-8">
          <h3
            class="font-satoshi text-xs tracking-[0.3em] uppercase text-primary/50 mb-4"
          >
            Jour 1
          </h3>
          <ul class="space-y-3">
            <li
              v-for="milestone in milestonesByDay.day1"
              :key="milestone.id"
              ref="itemsRef"
            >
              <button
                class="font-serif text-lg transition-all duration-200"
                :class="[
                  isMilestoneReached(milestone.id)
                    ? 'text-primary hover:text-primary/70 cursor-pointer'
                    : 'text-primary/30 cursor-not-allowed',
                ]"
                :disabled="!isMilestoneReached(milestone.id)"
                @click="handleMilestoneClick(milestone.id)"
              >
                {{ milestone.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Day 2 Milestones -->
        <div>
          <h3
            class="font-satoshi text-xs tracking-[0.3em] uppercase text-primary/50 mb-4"
          >
            Jour 2
          </h3>
          <ul class="space-y-3">
            <li
              v-for="milestone in milestonesByDay.day2"
              :key="milestone.id"
              ref="itemsRef"
            >
              <button
                class="font-serif text-lg transition-all duration-200"
                :class="[
                  isMilestoneReached(milestone.id)
                    ? 'text-primary hover:text-primary/70 cursor-pointer'
                    : 'text-primary/30 cursor-not-allowed',
                ]"
                :disabled="!isMilestoneReached(milestone.id)"
                @click="handleMilestoneClick(milestone.id)"
              >
                {{ milestone.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Reset Button -->
        <div class="absolute bottom-8 left-8 right-8">
          <button
            class="w-full py-3 border border-primary/20 text-primary/60 font-satoshi text-sm tracking-wider uppercase hover:bg-primary/5 transition-colors"
            @click="gameStore.resetGame()"
          >
            Recommencer
          </button>
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
