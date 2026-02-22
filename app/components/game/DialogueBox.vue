<script setup lang="ts">
import { DialogueLine } from "../../types/game";
const props = defineProps<{
  dialogue: DialogueLine | null,
  isSelecting?: boolean,
  blurAmount?: number
}>();

const gameStore = useGameStore();

const emit = defineEmits<{
  animationComplete: [];
}>();

const contentRef = useTemplateRef<HTMLElement>("contentRef");
const textRef = useTemplateRef<HTMLElement>("textRef");
const annotationRef = useTemplateRef<HTMLElement>("annotationRef");
const speakerRef = useTemplateRef<HTMLElement>("speakerRef");

const { 
  isPensees,
  isRightAligned,
  displayAnnotation,
  showAnnotation,
  showDialogueContent,
  annotationClasses,
  isReady,
  currentTimedAnnotation,
  isShowingOnlyAnnotation
} = useDialogueBox(
  toRef(props, 'dialogue'),
  textRef,
  contentRef,
  annotationRef,
  speakerRef,
  toRef(props, 'isSelecting'),
  emit
);
</script>

<template>
  <div v-if="dialogue" ref="contentRef" class="w-full xl:max-w-4xl lg:max-w-3xl md:max-w-2xl sm:max-w-xl max-w-lg px-8 flex flex-col transition-all duration-500" :class="{ 'items-end': isRightAligned, 'items-start': !isRightAligned, 'justify-center': isShowingOnlyAnnotation }">
    <!-- Annotation (utilisée aussi pour les timings temporaires) -->
    <p
      v-show="showAnnotation"
      ref="annotationRef"
      class="font-serif text-primary/60 typo-body transition-all duration-300 transform-gpu will-change-[filter,opacity]"
      :class="[
        annotationClasses, isRightAligned ? 'text-right' : 'text-left'
      ]"
      :style="{ 
        filter: blurAmount !== undefined ? `blur(${blurAmount}px)` : undefined, 
        opacity: blurAmount !== undefined && blurAmount > 6 ? 0.7 : 1 
      }"
    >
      {{ displayAnnotation }}
    </p>

    <!-- Speaker Name (caché via opacité pendant l'intro ou si showOnly est actif) -->
    <p
      v-show="!isShowingOnlyAnnotation"
      v-if="dialogue.speaker"
      ref="speakerRef"
      class="text-primary font-medium font-sans typo-body uppercase transition-all duration-300"
      :class="[
        { 'opacity-0': !showDialogueContent, 'mt-6': showAnnotation }, 
        isRightAligned ? 'text-right' : 'text-left'
      ]"
    >
      {{ dialogue.speaker }}
      <span v-if="isPensees" class="font-serif text-primary/60 lowercase"
        >(en pensées)</span
      >
    </p>

    <!-- Dialogue Text (caché via opacité pendant l'intro ou si showOnly est actif) -->
    <p
      v-show="!isShowingOnlyAnnotation"
      v-if="dialogue.text"
      ref="textRef"
      class="font-serif font-light text-2xl lg:text-title leading-normal text-primary mt-2"
      style="opacity: 0"
      :class="[{ 'opacity-0': !showDialogueContent || !isReady }, isRightAligned ? 'text-right' : 'text-left']"
    >
      {{ dialogue.text }}
    </p>
  </div>
</template>
