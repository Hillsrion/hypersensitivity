<template>
  <div
    ref="containerRef"
    class="relative rounded-2xl overflow-hidden grid grid-rows-[auto_1fr_auto] gap-4 cursor-pointer p-8 transition-colors duration-300 bg-white ring-1 ring-inset ring-primary"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <!-- Border Animation -->
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none z-20"
      style="overflow: visible"
    >
      <rect
        ref="borderRect"
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx="15"
        ry="15"
        fill="none"
        stroke-width="2"
        :stroke="`var(--color-gradient-${color})`"
        class="opacity-0"
      />
    </svg>

    <!-- Aurora Background -->
    <div
      ref="auroraRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 z-0 overflow-hidden will-change-opacity backface-hidden"
    >
      <div
        ref="auroraInnerRef"
        class="w-full h-full blur-[60px] scale-125 will-change-transform backface-hidden"
        :style="{
          background: `linear-gradient(180deg, #ffffff 20%, var(--aurora-middle-color) 50%, #ffffff 80%)`,
          transform: 'rotate(-3deg)',
        }"
      />
    </div>

    <!-- Quote Icon -->
    <div class="relative z-10">
      <svg
        width="32"
        height="27"
        viewBox="0 0 32 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.9008 0L0.9437 15.2943H11.6676V27H0V15.2943L8.23592 0H16.9008ZM32 0L16.1287 15.2943H26.7668V27H15.0992V15.2943L23.3351 0H32Z"
          fill="#0B1018"
        />
      </svg>
    </div>

    <AppText as="div" variant="body" class="relative z-10 flex items-center">
      <p id="textRef" ref="textRef" class="text-primary font-light font-serif">
        {{ content }}
      </p>
    </AppText>
    <div class="flex w-full items-center justify-end relative z-10 pt-2">
      <AppText as="div" variant="body" class="w-full flex justify-end">
        <p
          ref="authorRef"
          class="text-primary font-medium text-right relative z-10"
        >
          {{ author }}.
        </p>
      </AppText>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    content?: string
    author?: string
    audio?: string
    color?: string
  }>(),
  {
    content: '',
    author: '',
    audio: '',
    color: 'default',
  }
)

const authorRef = useTemplateRef<HTMLElement>('authorRef')

const {
  handleHover,
  containerRef,
  borderRect,
  textRef,
  auroraRef,
  auroraInnerRef,
} = useTestimonyCard(props)

defineExpose({
  textRef,
  containerRef,
})
</script>

<style scoped>
:deep(.word) {
  opacity: 0.6;
}
</style>
