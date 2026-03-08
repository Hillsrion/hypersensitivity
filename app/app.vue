<script setup>
import { VueLenis } from 'lenis/vue'

import DevTools from '~/app/components/debug/DevTools.vue'
import GameMilestoneMenu from '~/app/components/game/GameMilestoneMenu.vue'
import { EDGE_SPACING } from '~/app/constants/layout'
import { UI_SIZES } from '~/app/constants/ui'

import BackgroundGradient from './components/BackgroundGradient.vue'
import Experience from './components/Experience.vue'
import HSPQuizView from './components/HSPQuizView.vue'
import SoundIntroduction from './components/SoundIntroduction.vue'
import TestimoniesSection from './components/TestimoniesSection.vue'
import CircleAudiowave from './components/ui/CircleAudiowave.vue'
import LoadingSection from './components/ui/LoadingSection.vue'
import mainData from './data/main.json'

const DevToolsView = defineAsyncComponent(
  () => import('~/app/components/debug/DevToolsView.vue')
)

const config = useRuntimeConfig()
const requestUrl = useRequestURL()

const isTestUrl = computed(() => {
  if (!config.public.testUrl) return false
  return requestUrl.href.includes(String(config.public.testUrl))
})

const showDevTools = computed(() => import.meta.dev || isTestUrl.value)

const audioStore = useAudioStore()
const animations = useAnimationsStore()
const gameStore = useGameStore()

const route = useRoute()
const lenisRef = useTemplateRef('lenisRef')

const { introductionData, creditsLinks } = useAppSetup(lenisRef)
useCustomCursor()

useHead({
  htmlAttrs: {
    lang: 'fr',
  },
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
  ],
  meta: [
    { name: 'theme-color', content: '#0b1018' },
    {
      name: 'keywords',
      content:
        'hypersensibilité, sensibilité, émotionnel, sensoriel, psychologie, bien-être',
    },
  ],
})

useSeoMeta({
  title: mainData.title,
  ogTitle: mainData.title,
  ogDescription: mainData.introduction.content,
  ogImage: {
    src: '/og-image.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
  },
  twitterCard: 'summary_large_image',
  twitterTitle: mainData.title,
  twitterImage: {
    src: '/og-image.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
  },
})
</script>

<template>
  <div>
    <!-- Custom Cursor -->
    <div
      ref="cursorRef"
      class="custom-cursor fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-99999 transition-colors duration-300 ease-in-out will-change-transform"
      :class="animations.cursor.variant === 'dark' ? 'bg-primary' : 'bg-white'"
    />

    <DevToolsView v-if="route?.path === '/game-tools-view'" />
    <div
      v-else-if="route?.path === '/test'"
      class="bg-primary text-white min-h-dvh w-full relative"
    >
      <div
        class="fixed inset-0 pointer-events-none opacity-15 bg-repeat bg-[url('/images/noise.svg')]"
      />
      <HSPQuizView
        id="hsp-quiz-standalone"
        class="z-100"
        :development-credit-url="creditsLinks.development"
        :design-credit-url="creditsLinks.design"
      />
    </div>
    <div v-else>
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
      <div
        class="relative z-20 mx-auto transition-opacity duration-1000 mt-[50vh]"
        :class="{
          'opacity-0 pointer-events-none':
            !animations.landing.intro.entry.completed,
        }"
      >
        <GenericSection
          v-for="(section, index) in mainData.sections"
          :id="`section-${index}`"
          :key="section.title"
          :title="section.title"
          :short-title="section.shortTitle"
          :content="section.content"
          :color="section.color"
          class="mb-16"
        />
        <TestimoniesSection id="testimonies" class="relative z-10" />
        <Experience id="experience" class="-mt-[35svh]" />
      </div>
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

      <DevTools v-if="showDevTools" />
    </div>
  </div>
</template>
