<template>
  <div
    ref="containerRef"
    class="flex items-center justify-center h-svh mx-auto z-10 relative"
  >
    <div ref="wrapperRef" class="max-w-5xl px-4 opacity-0">
      <p
        ref="textRef"
        class="text-[2.75rem] text-primary leading-16 font-serif font-italic font-light"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useSoundIntroAnimation } from '~/app/composables/useSoundIntroAnimation';

const containerRef = useTemplateRef("containerRef");
const wrapperRef = useTemplateRef("wrapperRef");
const textRef = useTemplateRef("textRef");

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  isAnimated: {
    type: Boolean,
    default: false,
  },
  audio: {
    type: String,
    required: true,
  },
  timings: {
    type: Array,
    required: true,
  },
});

useSoundIntroAnimation(
  containerRef, 
  wrapperRef, 
  textRef, 
  toRef(props, 'audio')
);
</script>