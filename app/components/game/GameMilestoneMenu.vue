<script setup lang="ts">
import { QUIZ_ENTRY_DELAY_MS } from '~/app/constants/durations'
import { EDGE_SPACING } from '~/app/constants/layout'

import type { Milestone } from '../../types/game'
import GameMilestoneItem from './GameMilestoneItem.vue'

const gameStore = useGameStore()
const animationsStore = useAnimationsStore()
const { $gsap } = useNuxtApp()

const menuRef = useTemplateRef<HTMLElement>('menuRef')
const itemsRef = ref<HTMLElement[]>([])
const itemComponents = ref<Array<{ labelRef: HTMLElement | null }>>([])
const isMenuOpen = computed(() => gameStore.isMenuOpen)
let quizTimer: ReturnType<typeof setTimeout> | null = null

// Filtered milestones (only reached)
const visibleMilestones = computed<Milestone[]>(() => {
  if (import.meta.dev) return gameStore.milestones

  return gameStore.milestones.filter((m) =>
    gameStore.reachedMilestones.includes(m.id)
  )
})

interface MilestoneItemExposed {
  $el?: Element
  labelRef?: HTMLElement | null
}

const setMilestoneRef = (el: unknown, index: number) => {
  if (!el || typeof el !== 'object') return
  const item = el as MilestoneItemExposed

  if (item.$el instanceof HTMLElement) {
    itemsRef.value[index] = item.$el
  }

  itemComponents.value[index] = {
    labelRef: item.labelRef ?? null,
  }
}

// ─── Scroll / Drag Composable ────────────────────────────────────
const { onPointerDown, onPointerMove, onPointerUp, startLoop, stopLoop } =
  useMilestoneMenuScroll(itemsRef, isMenuOpen)

// ─── Menu Open/Close ─────────────────────────────────────────────
watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    // Show Aurora with rainbow color "aurora" and high z-index
    animationsStore.setAuroraZIndex(55)
    animationsStore.setAuroraVisibility(true)
    animationsStore.setAuroraColor('aurora')

    nextTick(() => {
      if (!menuRef.value) return

      $gsap.fromTo(
        menuRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      )

      if (itemComponents.value.length) {
        const labels = itemComponents.value
          .map((c) => c.labelRef)
          .filter((label): label is HTMLElement => !!label)

        // Animate labels (initial state already set by child onMounted)
        $gsap.to(labels, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.2,
          onComplete: () => {
            $gsap.set(labels, { clearProps: 'y,opacity' })
            if (isMenuOpen.value) {
              startLoop()
            }
          },
        })
      }
    })
  } else {
    stopLoop()
  }
})

// ─── Navigation ──────────────────────────────────────────────────
const isMilestoneReached = (milestoneId: string) => {
  if (import.meta.dev) return true
  return gameStore.reachedMilestones.includes(milestoneId)
}

const handleMilestoneClick = (milestoneId: string) => {
  if (isMilestoneReached(milestoneId)) {
    gameStore.goToMilestone(milestoneId)
  }
}

const navigateToTest = () => {
  gameStore.closeMenu(false)
  if (quizTimer) {
    clearTimeout(quizTimer)
  }
  quizTimer = setTimeout(() => {
    quizTimer = null
    gameStore.setShowQuiz(true)
  }, QUIZ_ENTRY_DELAY_MS)
}

const navItemClasses =
  'flex items-center gap-2 font-sans text-base/7 uppercase hover:text-primary transition-colors cursor-pointer'

onUnmounted(() => {
  if (quizTimer) {
    clearTimeout(quizTimer)
    quizTimer = null
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-medium">
      <div
        v-if="gameStore.isMenuOpen"
        class="fixed inset-0 z-60"
        @click.self.stop="gameStore.closeMenu()"
      >
        <div class="absolute inset-0" @click.stop="gameStore.closeMenu()" />

        <!-- Menu Content -->
        <div
          ref="menuRef"
          class="absolute inset-0 flex flex-col items-center justify-between pointer-events-none"
        >
          <!-- Top Toolbar -->
          <div
            class="w-full h-24 lg:h-32 flex items-center justify-between pointer-events-auto"
            :class="EDGE_SPACING.PX"
          >
            <!-- Close Button (Removed - handled by GameContainer) -->
            <div class="w-6 h-6" />
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
                :ref="(el) => setMilestoneRef(el, index)"
                :milestone="milestone"
                :is-reached="isMilestoneReached(milestone.id)"
                @click="handleMilestoneClick"
              />
            </div>
          </div>

          <!-- Bottom Navigation -->
          <div
            class="w-full h-24 lg:h-32 flex items-center justify-between pointer-events-auto"
            :class="EDGE_SPACING.PX"
          >
            <button :class="navItemClasses" @click.stop="gameStore.resetGame()">
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

            <div :class="navItemClasses" @click="navigateToTest">
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
