<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useAnimationsStore } from "~/stores/animations";

const gameStore = useGameStore();
const animationsStore = useAnimationsStore();
const { $gsap } = useNuxtApp();

const menuRef = ref<HTMLElement | null>(null);
const itemsRef = ref<HTMLElement[]>([]);
const timelineRef = ref<HTMLElement | null>(null);

// Filtered milestones (only reached)
const visibleMilestones = computed(() => {
  if (import.meta.dev) return gameStore.milestones;
  
  return gameStore.milestones.filter((m: any) =>
    gameStore.reachedMilestones.includes(m.id)
  );
});

// ─── Horizontal Loop (GSAP Helper) ───────────────────────────────
let loopTimeline: gsap.core.Timeline | null = null;

function horizontalLoop(items: HTMLElement[], config: Record<string, any> = {}) {
  const gsap = $gsap;
  items = gsap.utils.toArray(items) as HTMLElement[];
  
  const tl = gsap.timeline({
    repeat: config.repeat ?? 0,
    paused: config.paused ?? false,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    }
  });

  const length = items.length;
  const startX = items[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap = config.snap === false 
    ? (v: number) => v 
    : gsap.utils.snap(config.snap || 1);

  // Convert to xPercent and collect measurements
  gsap.set(items, {
    xPercent: (i: number, el: HTMLElement) => {
      const w = (widths[i] = parseFloat(String(gsap.getProperty(el, "width", "px"))));
      xPercents[i] = snap(
        (parseFloat(String(gsap.getProperty(el, "x", "px"))) / w) * 100 +
        parseFloat(String(gsap.getProperty(el, "xPercent")))
      );
      return xPercents[i];
    }
  });
  
  gsap.set(items, { x: 0 });
  
  const totalWidth = 
    items[length - 1].offsetLeft + 
    (xPercents[length - 1] / 100) * widths[length - 1] - 
    startX + 
    items[length - 1].offsetWidth * parseFloat(String(gsap.getProperty(items[length - 1], "scaleX"))) +
    (parseFloat(config.paddingRight) || 0);
  
  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop = distanceToStart + widths[i] * parseFloat(String(gsap.getProperty(item, "scaleX")));
    
    tl.to(item, {
      xPercent: snap((curX - distanceToLoop) / widths[i] * 100),
      duration: distanceToLoop / pixelsPerSecond
    }, 0)
    .fromTo(item, {
      xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)
    }, {
      xPercent: xPercents[i],
      duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
      immediateRender: false
    }, distanceToLoop / pixelsPerSecond)
    .add("label" + i, distanceToStart / pixelsPerSecond);
    
    times[i] = distanceToStart / pixelsPerSecond;
  }

  // Pre-render for performance
  tl.progress(1, true).progress(0, true);
  
  if (config.reversed) {
    if (tl.vars.onReverseComplete) {
      tl.vars.onReverseComplete();
    }
    tl.reverse();
  }
  
  return tl;
}

// ─── Drag / Touch Support ────────────────────────────────────────
let isDragging = false;
let startX = 0;
let startProgress = 0;
let dragVelocity = 0;
let lastX = 0;
let lastTime = 0;

const onPointerDown = (e: PointerEvent) => {
  if (!loopTimeline) return;
  isDragging = true;
  startX = e.clientX;
  lastX = e.clientX;
  lastTime = Date.now();
  startProgress = loopTimeline.progress();
  loopTimeline.pause();
  dragVelocity = 0;
  (e.target as HTMLElement).setPointerCapture(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging || !loopTimeline) return;
  
  const now = Date.now();
  const dt = now - lastTime;
  const dx = e.clientX - lastX;
  
  if (dt > 0) {
    dragVelocity = dx / dt; // px/ms
  }
  
  lastX = e.clientX;
  lastTime = now;
  
  const totalDeltaX = e.clientX - startX;
  const duration = loopTimeline.duration();
  // Map pixels to progress. Negative deltaX = forward progress (scroll left)
  const progressDelta = -totalDeltaX / (window.innerWidth * 2);
  
  let newProgress = startProgress + progressDelta;
  // Wrap progress for infinite loop
  newProgress = newProgress - Math.floor(newProgress);
  
  loopTimeline.progress(newProgress);
};

const onPointerUp = (_e: PointerEvent) => {
  if (!isDragging || !loopTimeline) return;
  isDragging = false;
  
  // Calculate flick direction and apply inertia
  // If velocity is significant enough, continue in that direction
  // Otherwise resume default auto-play direction
  if (Math.abs(dragVelocity) > 0.2) {
    // Flick detected: set timeScale based on velocity direction
    // Negative velocity (drag left) = forward, positive (drag right) = backward
    const direction = dragVelocity < 0 ? 1 : -1;
    const speed = Math.min(Math.abs(dragVelocity) * 3, 5); // cap speed multiplier
    loopTimeline.timeScale(direction * speed);
    loopTimeline.play();
    
    // Ease back to normal speed
    $gsap.to(loopTimeline, {
      timeScale: 1,
      duration: 1.5,
      ease: "power2.out"
    });
  } else {
    // No significant velocity, resume normal play
    loopTimeline.timeScale(1);
    loopTimeline.play();
  }
};

// ─── Lifecycle ───────────────────────────────────────────────────
const startLoop = () => {
  if (!itemsRef.value || itemsRef.value.length === 0) return;
  
  const items = itemsRef.value;
  const container = items[0]?.parentElement;
  if (!container) return;
  
  // Only start loop if content overflows
  const totalItemWidth = Array.from(items).reduce((sum, el) => sum + el.offsetWidth, 0);
  const viewportWidth = window.innerWidth;
  
  if (totalItemWidth > viewportWidth) {
    loopTimeline = horizontalLoop(items, {
      speed: 0.5,
      repeat: -1,
      paddingRight: 32 // gap between last and first item (pl-8 = 32px)
    });
  }
};

const stopLoop = () => {
  if (loopTimeline) {
    loopTimeline.kill();
    loopTimeline = null;
  }
  // Clear GSAP inline styles to restore natural layout
  if (itemsRef.value) {
    $gsap.set(itemsRef.value, { clearProps: "xPercent,x" });
  }
};

const handleResize = () => {
  if (!gameStore.isMenuOpen) return;
  stopLoop();
  nextTick(() => startLoop());
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  stopLoop();
});

// ─── Menu Open/Close ─────────────────────────────────────────────
watch(
  () => gameStore.isMenuOpen,
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
              onComplete: () => {
                // Clear the entrance animation transforms before starting loop
                $gsap.set(itemsRef.value, { clearProps: "y,opacity" });
                startLoop();
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
  gameStore.closeMenu();
  $gsap.to(window, {
    duration: 1.5,
    scrollTo: "#hsp-questionnaire",
    ease: "power2.inOut",
  });
};

const navItemClasses =
  "flex items-center gap-2 font-satoshi text-base/7 uppercase hover:text-primary transition-colors cursor-pointer";
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

          </div>

          <!-- Middle Section: Timeline -->
          <div
            ref="timelineRef"
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
              <div
                v-for="milestone in visibleMilestones"
                :key="milestone.id"
                ref="itemsRef"
                class="relative flex-none w-[25vw] min-w-[300px] flex flex-col items-center shrink-0"
              >
                <!-- Milestone Point Container -->
                <button 
                  @click="handleMilestoneClick(milestone.id)"
                  class="origin-bottom-left -rotate-45"
                >
                  <!-- Title -->
                  <div
                    class="whitespace-nowrap text-xl/7 flex items-center"
                  >
                    <!-- Dot -->
                    <div
                      class="size-4 rounded-full border border-primary bg-white transition-all duration-500"
                    />
                    <div
                      class="font-satoshi pl-4 transition-all duration-300 text-primary group-hover:text-primary/70"
                    >
                      <span class="uppercase mr-1 font-medium"
                        >JOUR {{ milestone.day }}</span
                      >
                      <span class="mx-1 font-serif">-</span>
                      <span class="font-serif">{{ milestone.label }}</span>
                    </div>
                  </div>

                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Navigation -->
          <div
            class="w-full h-32 flex items-center justify-between px-12 md:px-18 pointer-events-auto"
          >
            <button
              :class="navItemClasses"
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
