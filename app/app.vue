<script setup>
import { VueLenis } from 'lenis/vue'

import DevTools from '~/app/components/debug/DevTools.vue'
import GameMilestoneMenu from '~/app/components/game/GameMilestoneMenu.vue'
import { EDGE_SPACING } from '~/app/constants/layout'
import { UI_SIZES } from '~/app/constants/ui'
import { gameData } from '~/app/data/game'

import BackgroundGradient from './components/BackgroundGradient.vue'
import Experience from './components/Experience.vue'
import HSPQuizView from './components/HSPQuizView.vue'
import SoundIntroduction from './components/SoundIntroduction.vue'
import TestimoniesSection from './components/TestimoniesSection.vue'
import CircleAudiowave from './components/ui/CircleAudiowave.vue'
import LoadingSection from './components/ui/LoadingSection.vue'
import { useCustomCursor } from './composables/useCustomCursor'
import mainData from './data/main.json'

const timingsModules = import.meta.glob('./data/timings/*.json', {
  eager: true,
  import: 'default',
})

const getTimings = (audioPath) => {
  if (!audioPath) return undefined
  const filename = audioPath.replace('/audios/', '').replace('.mp3', '')
  const key = `./data/timings/${filename}.json`
  return timingsModules[key] || []
}

const DevToolsView = defineAsyncComponent(
  () => import('~/app/components/debug/DevToolsView.vue')
)

const isDev = import.meta.dev

const { cursorRef } = useCustomCursor()

const audioStore = useAudioStore()
const animations = useAnimationsStore()
const gameStore = useGameStore()

const route = useRoute()
const lenisRef = useTemplateRef('lenisRef')

const introductionData = {
  ...mainData.introduction,
  timings: getTimings(mainData.introduction.audio),
}

const creditsLinks = {
  development: 'https://ismaelsebbane.fr',
  design: 'https://anabanana.fr',
}

// Watch loading state and control Lenis scrolling
watch(
  [
    () => animations.landing.intro.entry.completed,
    () => animations.scroll.locked,
  ],
  ([introCompleted, scrollLocked]) => {
    if (!lenisRef.value?.lenis) return

    if (introCompleted && !scrollLocked) {
      // Re-enable scrolling after loading is complete and if not locked
      lenisRef.value.lenis.start()
    } else {
      // Locking scroll
      lenisRef.value.lenis.stop()
    }
  },
  { immediate: true }
)

/**
 * Collect all audio items from the game scenes, deduplicating by path.
 * - Scene-level audio: aggregates all dialogue texts and timings under a single audio entry.
 * - Dialogue-level audio: added individually (backward-compat / overrides).
 */
const collectGameAudios = () => {
  const collected = []

  const addIfNew = (entry) => {
    if (!collected.find((a) => a.path === entry.path)) {
      collected.push(entry)
    }
  }

  Object.values(gameData.scenes).forEach((scene) => {
    // Scene-level audio: merge all dialogue texts and timings into one entry
    if (scene.audio) {
      const fullPath = scene.audio.startsWith('/')
        ? scene.audio
        : `/audios/${scene.audio}`

      const allTimings = scene.dialogues.flatMap((d) => d.timings ?? [])
      const transcript = scene.dialogues.map((d) => d.text ?? '').join(' ')

      addIfNew({ path: fullPath, transcript, timings: allTimings })
    }

    // Dialogue-level audio (backward-compat or per-dialogue overrides)
    scene.dialogues.forEach((dialogue) => {
      if (dialogue.audio) {
        const fullPath = dialogue.audio.startsWith('/')
          ? dialogue.audio
          : `/audios/${dialogue.audio}`

        addIfNew({
          path: fullPath,
          transcript: dialogue.text,
          timings: dialogue.timings,
        })
      }
    })
  })

  return collected
}

onMounted(async () => {
  if (route.path === '/game-tools-view') return
  scrollTo(0, 0)
  if (!animations.landing.intro.entry.completed) {
    lenisRef.value?.lenis?.stop()
  }

  // Build the full audio preload list: testimonies + intro + all game scenes
  const audioList = [
    // Testimony audios
    ...mainData.testimonies
      .filter((item) => item.audio)
      .map((item) => ({
        path: item.audio,
        transcript: item.content,
        timings: getTimings(item.audio),
      })),
    // Intro narration
    {
      path: '/audios/alix-intro.mp3',
      transcript: introductionData.content,
      timings: introductionData.timings,
    },
    // Game scene audios
    ...collectGameAudios(),
  ]

  audioStore.preloadList(audioList)

  // Expose Lenis to window for DevTools
  if (import.meta.dev && import.meta.client) {
    watch(
      () => lenisRef.value?.lenis,
      (lenis) => {
        if (lenis) {
          // @ts-expect-error: Necessary for DevTools bridge
          window.lenis = lenis
        }
      },
      { immediate: true }
    )
  }
})

onUnmounted(() => {
  // Release all audio resources to avoid memory leaks on route teardown
  audioStore.cleanupAudio()
})
</script>

<template>
  <div>
    <DevToolsView v-if="route?.path === '/game-tools-view'" />
    <div v-else>
      <!-- Custom Cursor -->
      <div
        ref="cursorRef"
        class="custom-cursor fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-99999 transition-colors duration-300 ease-in-out will-change-transform"
        :class="
          animations.cursor.variant === 'dark' ? 'bg-primary' : 'bg-white'
        "
      />

      <!-- Global Audiowave -->
      <div
        class="fixed z-100 pointer-events-none transition-opacity duration-500"
        :class="[EDGE_SPACING.TOP, EDGE_SPACING.RIGHT]"
      >
        <CircleAudiowave
          :class="UI_SIZES.TOP_ELEMENT"
          :primary="animations.audiowave.variant === 'dark'"
          :animating="audioStore.isPlaying"
        />
      </div>

      <VueLenis ref="lenisRef" root />
      <BackgroundGradient />
      <GameMilestoneMenu />
      <LoadingSection />
      <SoundIntroduction
        :text="introductionData.content"
        :audio="introductionData.audio"
        :timings="introductionData.timings"
      />
      <!-- Noise overlay -->

      <div
        class="fixed inset-0 z-9999 pointer-events-none opacity-15 bg-repeat bg-[url('/images/noise.svg')]"
      />
      <div class="relative z-1 mx-auto flex flex-col gap-y-16 mt-[40svh]">
        <GenericSection
          v-for="(section, index) in mainData.sections"
          :id="`section-${index}`"
          :key="section.title"
          :title="section.title"
          :content="section.content"
          :color="section.color"
        />
      </div>
      <TestimoniesSection id="testimonies" class="relative z-10" />
      <Experience id="experience" class="-mt-[35svh]" />
      <Teleport to="body">
        <Transition name="fade">
          <HSPQuizView
            v-if="gameStore.showQuiz"
            id="hsp-quiz"
            class="z-100"
            :development-credit-url="creditsLinks.development"
            :design-credit-url="creditsLinks.design"
          />
        </Transition>
      </Teleport>

      <DevTools v-if="isDev" />
    </div>
  </div>
</template>
