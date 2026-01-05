<script setup lang="ts">
const props = defineProps<{
  animating?: boolean
}>()

const { $gsap } = useNuxtApp()
const pathD = ref('')
const originalOpacity = ref(1)
const waveOpacity = ref(0)

const originalPath = "M7.19995 37.9498H12.3968C17.0539 37.9498 14.9486 41.8907 17.947 41.8907C21.7748 41.8907 21.7748 32.9765 24.8491 32.9765C28.2819 32.9765 28.1543 45.631 31.4079 45.631C35.4909 45.631 36.3202 24.6855 38.9996 24.6855C42.317 24.6855 40.0842 47.3141 46.081 47.3141C51.376 47.3141 50.3553 34.0362 52.9071 34.0362C55.2676 34.0362 54.9486 38.3375 58.9039 38.4622C62.8593 38.5868 64.7999 38.4609 64.7999 38.4609"

// Configuration for the wave
const startX = 7
const endX = 65
const centerY = 36
const numberOfPoints = 10
const segmentWidth = (endX - startX) / (numberOfPoints - 1)

// Animation state
const time = ref(0)
const amplitude = ref(0)
const speed = ref(0)

const updateWave = () => {
  let points = []
  for (let i = 0; i < numberOfPoints; i++) {
    const x = startX + i * segmentWidth
    const edgeFactor = Math.sin((i / (numberOfPoints - 1)) * Math.PI)
    const y = centerY + Math.sin(i * 1.2 + time.value) * amplitude.value * 14 * edgeFactor
    points.push({ x, y })
  }

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 2; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`
  }
  d += ` Q ${points[points.length - 2].x} ${points[points.length - 2].y}, ${points[points.length - 1].x} ${points[points.length - 1].y}`
  pathD.value = d
}

const onTick = () => {
  time.value += speed.value
  updateWave()
}

let ctx: gsap.Context

onMounted(() => {
  updateWave()
  ctx = $gsap.context(() => {
    $gsap.ticker.add(onTick)
  })
})

onUnmounted(() => {
  ctx?.revert()
  $gsap.ticker.remove(onTick)
})

watch(() => props.animating, (isAnimating) => {
  if (isAnimating) {
    // Cross-fade to wave
    $gsap.to(originalOpacity, { value: 0, duration: 0.4, ease: 'power2.inOut' })
    $gsap.to(waveOpacity, { value: 1, duration: 0.4, ease: 'power2.inOut' })
    
    // Ramp up animation
    $gsap.to(speed, { value: 0.12, duration: 0.6, ease: 'power2.out' })
    $gsap.to(amplitude, { value: 1, duration: 0.6, ease: 'back.out(1.5)' })
  } else {
    // Cross-fade back to original
    $gsap.to(originalOpacity, { value: 1, duration: 0.4, ease: 'power2.inOut' })
    $gsap.to(waveOpacity, { value: 0, duration: 0.4, ease: 'power2.inOut' })
    
    // Stop animation
    $gsap.to(speed, { value: 0, duration: 0.4, ease: 'power2.inOut' })
    $gsap.to(amplitude, { value: 0, duration: 0.4, ease: 'power2.inOut' })
  }
}, { immediate: true })
</script>

<template>
  <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Original Path (Static) -->
    <path 
      :d="originalPath" 
      stroke="white" 
      stroke-width="1"
      :style="{ opacity: originalOpacity }"
    />
    
    <!-- Animated Wave Path -->
    <path 
      :d="pathD" 
      stroke="white" 
      stroke-width="1.5" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      :style="{ opacity: waveOpacity }"
    />
    
    <circle cx="36" cy="36" r="35.5" stroke="white"/>
  </svg>
</template>
