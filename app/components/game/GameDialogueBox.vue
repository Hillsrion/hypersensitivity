<script setup lang="ts">
import type { DialogueLine } from '../../types/game'

const props = defineProps<{
  dialogue: DialogueLine | null
  isSelecting?: boolean
  blurAmount?: number
}>()

const emit = defineEmits<{
  animationComplete: []
}>()

const contentRef = useTemplateRef<HTMLElement>('contentRef')
const textRef = useTemplateRef<HTMLElement>('textRef')
const annotationRef = useTemplateRef<HTMLElement>('annotationRef')
const speakerRef = useTemplateRef<HTMLElement>('speakerRef')

const {
  isThoughts,
  isRightAligned,
  displayAnnotation,
  showAnnotation,
  showDialogueContent,
  annotationClasses,
  isReady,
  isShowingOnlyAnnotation,
} = useDialogueBox(
  toRef(props, 'dialogue'),
  textRef,
  contentRef,
  annotationRef,
  speakerRef,
  toRef(props, 'isSelecting'),
  emit
)
</script>

<template>
  <div
    v-if="dialogue"
    ref="contentRef"
    class="w-full xl:max-w-4xl lg:max-w-3xl md:max-w-2xl sm:max-w-xl max-w-lg px-8 flex flex-col transition-all duration-500"
    :class="{
      'items-end': isRightAligned,
      'items-start': !isRightAligned,
      'justify-center': isShowingOnlyAnnotation,
    }"
  >
    <!-- Annotation (utilisée aussi pour les timings temporaires) -->
    <AppText
      v-show="showAnnotation"
      ref="annotationRef"
      as="p"
      variant="body"
      class="font-serif text-primary/60 transition-all duration-300 transform-gpu will-change-[filter,opacity]"
      :class="[annotationClasses, isRightAligned ? 'text-right' : 'text-left']"
      :style="{
        filter: blurAmount !== undefined ? `blur(${blurAmount}px)` : undefined,
        opacity: blurAmount !== undefined && blurAmount > 6 ? 0.7 : 1,
      }"
    >
      {{ displayAnnotation }}
    </AppText>

    <!-- Speaker Name (caché via opacité pendant l'intro ou si showOnly est actif) -->
    <AppText
      v-show="!isShowingOnlyAnnotation"
      v-if="dialogue.speaker"
      ref="speakerRef"
      as="p"
      variant="body"
      class="text-primary font-medium font-sans uppercase transition-all duration-300"
      :class="[
        { 'opacity-0': !showDialogueContent, 'mt-6': showAnnotation },
        isRightAligned ? 'text-right' : 'text-left',
      ]"
    >
      {{ dialogue.speaker }}
      <span v-if="isThoughts" class="font-serif text-primary/60 lowercase"
        >(pensées)</span
      >
    </AppText>

    <!-- Dialogue Text (caché via opacité pendant l'intro ou si showOnly est actif) -->
    <p
      v-show="!isShowingOnlyAnnotation"
      v-if="dialogue.text"
      ref="textRef"
      class="font-serif font-light leading-normal text-primary mt-2"
      style="opacity: 0"
      :class="[
        { 'opacity-0': !showDialogueContent || !isReady },
        isRightAligned ? 'text-right' : 'text-left',
        dialogue.isCompact ? 'fl-text-lg/xl' : 'fl-text-xl/title',
      ]"
    >
      {{ dialogue.text }}
    </p>
  </div>
</template>
