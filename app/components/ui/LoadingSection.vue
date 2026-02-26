<script setup>
import CircleAudiowave from './CircleAudiowave.vue'
import MainTitle from './MainTitle.vue'

const route = useRoute()
const isTest = computed(() => route.query.test === 'true')

const animationsStore = useAnimationsStore()
const { landing } = storeToRefs(animationsStore)
// Keep audioStore usage direct
// const { isPlaying } = storeToRefs(audioStore);
const bottomElement = useTemplateRef('bottomElement')
const containerElement = useTemplateRef('containerElement')
const isHovered = ref(false)

const onBottomElementClick = () => {
  animationsStore.startTitleExit()
}
</script>

<template>
  <div
    v-if="!isTest"
    ref="containerElement"
    class="h-svh w-screen flex flex-col items-center justify-center fixed inset-0"
    :class="{
      'z-99': !landing.mainTitle.exit.completed,
      'pointer-events-none': landing.mainTitle.exit.started,
    }"
  >
    <MainTitle title="Hypersensibles" />
    <button
      ref="bottomElement"
      class="flex flex-col place-items-center gap-y-4 absolute left-1/2 bottom-10 -translate-x-1/2 transition-opacity duration-500 cursor-pointer"
      :class="{
        'opacity-0':
          !landing.mainTitle.entry.completed || landing.mainTitle.exit.started,
      }"
      @click="onBottomElementClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <p class="text-white uppercase leading-5 fl-text-sm/base">
        Cliquer pour écouter
      </p>
      <CircleAudiowave
        :animating="isHovered"
        class="size-11 sm:size-14 md:size-18"
      />
    </button>
  </div>
</template>
