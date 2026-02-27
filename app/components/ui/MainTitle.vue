<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})

const animationsStore = useAnimationsStore()
const { landing } = storeToRefs(animationsStore)
const titleRef = useTemplateRef('titleRef')
const { chars } = useSplitText(titleRef, { splitBy: 'chars,words' })

const { playExit } = useTextWaveAnimation(chars, {
  immediate: true,
  onComplete: () => {
    animationsStore.onTitleEntryComplete()
  },
})

watch(
  () => landing.value.mainTitle.exit.started,
  (started) => {
    if (started && chars.value && chars.value.length) {
      playExit([...chars.value], () => {
        animationsStore.onTitleExitComplete()
      })
    }
  }
)
</script>

<template>
  <AppHeading as="div" variant="h1">
    <h1 ref="titleRef" class="font-epilogue font-semibold text-white">
      {{ title }}
    </h1>
  </AppHeading>
</template>
