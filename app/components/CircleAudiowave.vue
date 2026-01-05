<script setup lang="ts">
const props = defineProps<{
  animating?: boolean
}>()

const { $gsap } = useNuxtApp()
const pathD = ref('')

// Constants
const startX = 7
const endX = 65
const centerY = 36

// Estimated points from the original SVG to recreate the shape closely
// The original path is irregular, so we define specific Y values for each X step
// We exaggerate the Y values (relative to center 36) because our smoothing algorithm (Quadratic through midpoints)
// tends to flatten peaks. Roughly doubling the offset restores the visual height.
const originalPoints = [
  { x: 7.2, y: 39.9 },    // Start
  { x: 12.4, y: 39.9 },   // Flat
  { x: 17.9, y: 47.8 },   // Dip
  { x: 24.8, y: 30.0 },   // Rise
  { x: 31.4, y: 55.2 },   // Dip
  { x: 39.0, y: 13.4 },   // Big Rise (Exaggerated to hit ~24 visual)
  { x: 46.1, y: 58.6 },   // Big Dip (Exaggerated to hit ~47 visual)
  { x: 52.9, y: 32.0 },   // Rise
  { x: 58.9, y: 41.0 },   // Settling
  { x: 64.8, y: 41.0 }    // End
]

// Animation variables
const time = ref(0)
const speed = ref(0)
const morphProgress = ref(0) // 0 = Original Shape, 1 = Sine Wave

const updateWave = () => {
  let points = []
  const numberOfPoints = originalPoints.length
  
  for (let i = 0; i < numberOfPoints; i++) {
    // 1. Calculate the "Wave" position (Dynamic)
    const p = originalPoints[i]
    
    // Calculate a nice sine wave for this x-position
    // Normalized X (0 to 1)
    const normX = (p.x - startX) / (endX - startX)
    
    // Envelope to keep edges pinned (0 at ends, 1 in middle)
    // Using a sine window for smooth taper
    const envelope = Math.sin(normX * Math.PI)
    
    // Dynamic sine wave
    const waveY = centerY + Math.sin(i * 1.1 + time.value) * 14 * envelope
    
    // 2. Interpolate between Original Y and Wave Y
    // When morphProgress is 0, we strictly use p.y (Original)
    // When morphProgress is 1, we strictly use waveY (Dynamic)
    const currentY = p.y + (waveY - p.y) * morphProgress.value
    
    points.push({ x: p.x, y: currentY })
  }

  // Draw the curve
  // Using Catmull-Rom or similar might be better for the original sharp turns,
  // but Quadratic Bezier is smoother for the wave.
  // We'll stick to the Quadratic Midpoint approach as it's stable.
  if (points.length > 1) {
    let d = `M ${points[0].x} ${points[0].y}`
    
    // For the first segment, just a line if it's flat, but let's use the curve alg
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      
      // Midpoint strategy
      const mx = (p0.x + p1.x) / 2
      const my = (p0.y + p1.y) / 2
      
      if (i === 0) {
        d += ` L ${mx} ${my}`
      } else {
         d += ` Q ${p0.x} ${p0.y}, ${mx} ${my}`
      }
    }
    // Connect to last point
    const last = points[points.length - 1]
    d += ` L ${last.x} ${last.y}`
    
    pathD.value = d
  }
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
    // Transition TO Wave
    $gsap.to(morphProgress, { value: 1, duration: 0.8, ease: 'power2.inOut' })
    $gsap.to(speed, { value: 0.15, duration: 0.8, ease: 'power2.out' })
  } else {
    // Transition TO Original
    $gsap.to(morphProgress, { value: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    // Slow down speed but keep it moving a bit until fully morphed? 
    // Actually better to keep speed up during morph back so it doesn't freeze "mid-wave"
    // then kill speed.
    $gsap.to(speed, { value: 0, duration: 0.6, ease: 'power2.inOut' })
  }
}, { immediate: true })

</script>

<template>
  <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      :d="pathD" 
      stroke="white" 
      stroke-width="1.5" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <circle cx="36" cy="36" r="35.5" stroke="white"/>
  </svg>
</template>