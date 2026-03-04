<script setup lang="ts">
import { EDGE_SPACING } from '../../constants/layout'
import type { Choice } from '../../types/game'

const props = withDefaults(
  defineProps<{
    choices: Choice[]
    variant?: 'dark' | 'light'
  }>(),
  {
    variant: 'dark',
  }
)

const emit = defineEmits<{
  select: [choice: Choice]
  selecting: []
}>()

const gameStore = useGameStore()

const iconRef = useTemplateRef<HTMLElement>('iconRef')
const buttonRefs = ref<HTMLElement[]>([])

const setButtonRef = (
  el: Element | ComponentPublicInstance | null,
  index: number
) => {
  if (el instanceof HTMLElement) {
    buttonRefs.value[index] = el
    return
  }

  const maybeEl = (el as { $el?: unknown } | null)?.$el
  if (maybeEl instanceof HTMLElement) {
    buttonRefs.value[index] = maybeEl
  }
}

const { hoveredIndex, isSelecting, selectedIndex, handleSelect } =
  useChoiceButtons(toRef(props, 'choices'), buttonRefs, iconRef, emit)
</script>

<template>
  <div
    class="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-6 z-40 w-4/5"
    :class="[EDGE_SPACING.BOTTOM, { 'pointer-events-none': isSelecting }]"
  >
    <template v-for="(choice, index) in choices" :key="choice.id">
      <!-- CHOICE BUTTON -->
      <AppText
        :ref="(el: any) => setButtonRef(el, index)"
        as="button"
        variant="choice"
        class="group relative py-4 font-sans font-semibold uppercase flex flex-col items-center"
        :class="{
          'transition-[color,opacity] duration-300': !isSelecting,
          'transition-[color] duration-300': isSelecting,
          'text-primary/30 cursor-not-allowed':
            gameStore.isChoiceDisabled(choice) && variant === 'dark',
          'text-white/30 cursor-not-allowed':
            gameStore.isChoiceDisabled(choice) && variant === 'light',
          'text-primary':
            !gameStore.isChoiceDisabled(choice) && variant === 'dark',
          'text-white':
            !gameStore.isChoiceDisabled(choice) && variant === 'light',
          'opacity-20':
            !isSelecting && hoveredIndex !== null && hoveredIndex !== index,
          'opacity-0': isSelecting && selectedIndex !== index,
          'opacity-100':
            (!isSelecting &&
              (hoveredIndex === null || hoveredIndex === index)) ||
            (isSelecting && selectedIndex === index),
        }"
        :disabled="gameStore.isChoiceDisabled(choice) || isSelecting"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
        @click="handleSelect(choice, index)"
      >
        <span class="flex items-center gap-3">
          <span>{{ choice.text }}</span>
        </span>

        <!-- Raison de desactivation -->
        <span
          v-if="gameStore.isChoiceDisabled(choice) && choice.disabledReason"
          class="text-xs mt-1 absolute top-full"
          :class="variant === 'dark' ? 'text-primary/40' : 'text-white/40'"
        >
          {{ choice.disabledReason }}
        </span>
      </AppText>

      <!-- CENTRAL ICON (Inserted between first and second choice) -->
      <div
        v-if="index === 0 && choices.length > 1"
        ref="iconRef"
        class="relative fl-size-11/14 shrink-0 rounded-full border flex items-center justify-center transition-opacity duration-300"
        :class="[
          !isSelecting && hoveredIndex !== null ? 'opacity-20' : 'opacity-100',
          isSelecting ? 'opacity-0' : '',
          variant === 'dark'
            ? 'border-primary text-primary'
            : 'border-white text-white',
        ]"
      >
        <div
          class="flex size-full items-center justify-center max-w-[60%] transform -rotate-20"
        >
          <svg
            viewBox="0 0 32 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="size-full fill-current"
          >
            <path
              d="M23.6247 16.1961L27.1646 25.9219C28.861 30.5828 26.4464 35.7609 21.7856 37.4574C17.1247 39.1538 11.9466 36.7392 10.2501 32.0783L6.71024 22.3525L23.6247 16.1961ZM24.2224 14.9144L5.42853 21.7548L9.31046 32.4203C11.1984 37.6074 16.9405 40.285 22.1276 38.3971C27.3147 36.5091 29.9923 30.767 28.1043 25.5799L24.2224 14.9144Z"
            />
            <path
              d="M5.18404 19.619L3.88095 16.0387C2.25635 11.5752 4.22331 6.57064 8.37741 4.38824L12.8989 16.811L5.18404 19.619Z"
            />
            <path
              d="M8.10918 5.11341L12.2579 16.5119L5.4827 18.9779L4.35061 15.8675C2.87992 11.8268 4.52494 7.31188 8.10918 5.11341ZM8.65555 3.69075C3.94696 5.84085 1.61189 11.2667 3.41092 16.2095L4.88502 20.2596L13.5396 17.1096L8.65555 3.69075Z"
            />
            <path
              d="M11.4732 3.88797C15.632 3.26819 19.7943 5.66942 21.265 9.7101L22.3971 12.8205L15.6219 15.2864L11.4732 3.88797ZM10.1402 3.14935L15.0242 16.5682L23.6788 13.4182L22.2047 9.36808C20.4057 4.42529 15.1292 1.7698 10.1402 3.14935Z"
            />
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>
