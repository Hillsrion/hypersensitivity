<script setup lang="ts">
import { EDGE_SPACING } from '~/app/constants/layout'

import type { Milestone } from '../../types/game'
import ArrowRightIcon from '../ui/ArrowRightIcon.vue'
import ResetIcon from '../ui/ResetIcon.vue'
import GameMilestoneItem from './GameMilestoneItem.vue'

const gameStore = useGameStore()
const animationsStore = useAnimationsStore()
const { $gsap } = useNuxtApp()
const { isMilestoneReached, handleMilestoneClick, navigateToTest } =
  useMilestoneNavigation()

const menuRef = useTemplateRef<HTMLElement>('menuRef')
const itemsRef = ref<HTMLElement[]>([])
const itemComponents = ref<
  Array<{ labelRef: HTMLElement | null; isReached: boolean }>
>([])
const isMenuOpen = computed(() => gameStore.isMenuOpen)

type MilestoneItemExposed = {
  $el?: Element
  labelRef?: HTMLElement | null
}

const setMilestoneRef = (el: unknown, index: number) => {
  if (!el || typeof el !== 'object') return
  const item = el as MilestoneItemExposed

  if (item.$el instanceof HTMLElement) {
    if (index >= 0) {
      itemsRef.value[index] = item.$el
    }
  }

  const milestone = gameStore.milestones[index]
  itemComponents.value[index] = {
    labelRef: item.labelRef ?? null,
    isReached: milestone ? isMilestoneReached(milestone.id) : false,
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

      if (itemsRef.value.length) {
        $gsap.set(itemsRef.value, { clearProps: 'xPercent,x' })
      }

      $gsap.fromTo(
        menuRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      )

      if (itemComponents.value.length) {
        const labels = itemComponents.value
          .filter((c) => c.isReached && c.labelRef)
          .map((c) => c.labelRef as HTMLElement)

        // Animate labels with fromTo to eliminate layout flashes
        $gsap.fromTo(
          labels,
          { opacity: 0, y: 20 },
          {
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
          }
        )
      }
    })
  } else {
    stopLoop(false)
  }
})

const navItemClasses =
  'flex items-center gap-2 font-sans fl-text-sm/base fl-leading-5/7 uppercase hover:text-primary transition-colors cursor-pointer'
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
            <div class="flex items-center relative h-full w-full">
              <GameMilestoneItem
                v-for="(milestone, index) in gameStore.milestones"
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
            class="w-full h-auto lg:h-32 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-x-8 gap-y-4 pb-6 lg:pb-0 pointer-events-auto"
            :class="EDGE_SPACING.PX"
          >
            <button :class="navItemClasses" @click.stop="gameStore.resetGame()">
              <ResetIcon />
              RECOMMENCER LE JEU
            </button>

            <div :class="navItemClasses" @click="navigateToTest">
              TEST DU SPECTRE DE L'HYPERSENSIBILITÉ
              <ArrowRightIcon />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
