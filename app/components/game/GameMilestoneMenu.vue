<script setup lang="ts">
import GameMilestoneItem from "./GameMilestoneItem.vue";

const gameStore = useGameStore();
const animationsStore = useAnimationsStore();
const { $gsap } = useNuxtApp();

const menuRef = useTemplateRef<HTMLElement>("menuRef");
const itemsRef = ref<HTMLElement[]>([]);
const itemComponents = ref<any[]>([]);
const isMenuOpen = computed(() => gameStore.isMenuOpen);

// Filtered milestones (only reached)
const visibleMilestones = computed(() => {
  if (import.meta.dev) return gameStore.milestones;
  
  return gameStore.milestones.filter((m: any) =>
    gameStore.reachedMilestones.includes(m.id)
  );
});

// ─── Scroll / Drag Composable ────────────────────────────────────
const { onPointerDown, onPointerMove, onPointerUp, startLoop, stopLoop } = 
  useMilestoneMenuScroll(itemsRef, isMenuOpen);

// ─── Menu Open/Close ─────────────────────────────────────────────
watch(
  isMenuOpen,
  (isOpen) => {
    if (isOpen) {
      // Show Aurora with rainbow color "aurora" and high z-index
      animationsStore.setAuroraZIndex(55);
      animationsStore.setAuroraVisibility(true);
      animationsStore.setAuroraColor("aurora");
      
      nextTick(() => {
        if (!menuRef.value) return;
        
        $gsap.fromTo(
          menuRef.value,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" }
        );

        if (itemComponents.value.length) {
          const labels = itemComponents.value.map(c => c.labelRef).filter(Boolean);

          // Animate labels (initial state already set by child onMounted)
          $gsap.to(
            labels,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.2,
              onComplete: () => {
                $gsap.set(labels, { clearProps: "y,opacity" });
                if (isMenuOpen.value) {
                  startLoop();
                }
              }
            }
          );
        }
      });
    } else {
      stopLoop();
    }
  }
);

// ─── Navigation ──────────────────────────────────────────────────
const isMilestoneReached = (milestoneId: string) => {
  if (import.meta.dev) return true;
  return gameStore.reachedMilestones.includes(milestoneId);
};

const handleMilestoneClick = (milestoneId: string) => {
  if (isMilestoneReached(milestoneId)) {
    gameStore.goToMilestone(milestoneId);
  }
};

const navigateToTest = () => {
  gameStore.closeMenu(false);
  setTimeout(() => {
    gameStore.setShowQuestionnaire(true);
  }, 1000); // 1-second delay to match Experience.vue game end transition
};

const navItemClasses =
  "flex items-center gap-2 font-sans text-base/7 uppercase hover:text-primary transition-colors cursor-pointer";
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="gameStore.isMenuOpen"
        class="fixed inset-0 z-60"
        @click.self.stop="gameStore.closeMenu()"
      >
        <div
          class="absolute inset-0"
          @click.stop="gameStore.closeMenu()"
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
            <!-- Close Button (Removed - handled by GameContainer) -->
            <div class="w-6 h-6"></div>

          </div>

          <!-- Middle Section: Timeline -->
          <div
            class="relative w-screen h-full flex items-center overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <!-- Milestones Container -->
            <div class="flex items-center relative h-full w-full pl-8">
              <!-- Median Line -->
              <div
                class="absolute top-1/2 left-0 w-full h-px bg-primary/10 pointer-events-none"
              />
              <GameMilestoneItem
                v-for="(milestone, index) in visibleMilestones"
                :key="milestone.id"
                :ref="el => { 
                  if (el) {
                    itemsRef[index] = (el as any).$el;
                    itemComponents[index] = el;
                  }
                }"
                :milestone="milestone"
                :is-reached="isMilestoneReached(milestone.id)"
                @click="handleMilestoneClick"
              />
            </div>
          </div>

          <!-- Bottom Navigation -->
          <div
            class="w-full h-32 flex items-center justify-between px-12 md:px-18 pointer-events-auto"
          >
            <button
              :class="navItemClasses"
              @click.stop="gameStore.resetGame()"
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
              RECOMMENCER LE JEU
            </button>

            <div
              :class="navItemClasses"
              @click="navigateToTest"
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
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
