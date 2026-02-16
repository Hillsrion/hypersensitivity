<script setup>
import { VueLenis } from "lenis/vue";
import LoadingSection from "./components/sections/LoadingSection.vue";
import SoundIntroduction from "./components/SoundIntroduction.vue";
import Experience from "./components/Experience.vue";
import { useAudioStore } from "@/stores/audio";
import { useAnimationsStore } from "~/stores/animations";
import mainData from "./data/main.json";
import TestimoniesSection from "./components/TestimoniesSection.vue";
import HSPQuestionnaire from "./components/HSPQuestionnaire.vue";
import { useCustomCursor } from "./composables/useCustomCursor";
import { useGameStore } from "~/stores/game";
import GameMilestoneMenu from "~/app/components/game/GameMilestoneMenu.vue";
import { defineAsyncComponent } from 'vue';

const DevToolsView = defineAsyncComponent(() => import('~/app/components/debug/DevToolsView.vue'));

const isDev = import.meta.dev;

const { cursorRef } = useCustomCursor();

const audioStore = useAudioStore();
const animations = useAnimationsStore();
const gameStore = useGameStore();

// Keep audioStore usage direct to avoid potential storeToRefs issues with null effects
// const { isPlaying } = storeToRefs(audioStore);

const route = useRoute();
const lenisRef = ref(null);

const { data: page } = await useAsyncData("page-" + route.path, () => {
  if (route.path === '/game-tools-view') return Promise.resolve({ title: 'DevTools' });
  return queryCollection("content").path(route.path).first();
});

if (!page.value && route.path !== '/game-tools-view') {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found: " + route.path, // Add path to message
    fatal: true,
  });
}

const introductionData = mainData.introduction;

// Watch loading state and control Lenis scrolling
watch(
  [
    () => animations.landing.intro.entry.completed,
    () => animations.scroll.locked,
  ],
  ([introCompleted, scrollLocked]) => {
    if (!lenisRef.value?.lenis) return;

    if (introCompleted && !scrollLocked) {
      // Re-enable scrolling after loading is complete and if not locked
      lenisRef.value.lenis.start();
    } else {
      // Locking scroll
      lenisRef.value.lenis.stop();
    }
  },
  { immediate: true }
);

import { gameData } from "~/app/data/game";

onMounted(async () => {
  if (route.path === '/game-tools-view') return;

  console.log("LOG_DEBUG: app.vue onMounted start");
  console.log("LOG_DEBUG: gameData scenes keys:", Object.keys(gameData.scenes));
  scrollTo(0, 0);
  if (!animations.landing.intro.entry.completed) {
    lenisRef.value?.lenis?.stop();
  }

  // Preload testimonie audios
  const audioList = mainData.testimonies
    .filter((item) => item.audio)
    .map((item) => ({
      path: item.audio,
      transcript: item.content,
      timings: item.timings,
    }));

  // Preload intro audio
  audioList.push({
    path: "/audios/alix-intro.mp3",
    transcript: introductionData.content,
    timings: introductionData.timings,
  });

  // Collect all audios from gameData
  Object.values(gameData.scenes).forEach((scene) => {
    // Check for scene-level audio
    if (scene.audio) {
      const fullPath = scene.audio.startsWith("/")
        ? scene.audio
        : `/audios/${scene.audio}`;
      
      if (!audioList.find((a) => a.path === fullPath)) {
        // Collect all transcripts and timings for this scene to help with duration calculation
        const allTimings = [];
        const allTexts = [];
        
        scene.dialogues.forEach(d => {
          if (d.timings) allTimings.push(...d.timings);
          if (d.text) allTexts.push(d.text);
        });

        audioList.push({
          path: fullPath,
          transcript: allTexts.join(" "),
          timings: allTimings,
        });
      }
    }

    // Also keep checking for dialogue-level audio (backward compatibility or specific overrides)
    scene.dialogues.forEach((dialogue) => {
      if (dialogue.audio) {
        // Double check if not already in list or handle duplicates
        const fullPath = dialogue.audio.startsWith("/")
          ? dialogue.audio
          : `/audios/${dialogue.audio}`;
        if (!audioList.find((a) => a.path === fullPath)) {
          audioList.push({
            path: fullPath,
            transcript: dialogue.text,
            timings: dialogue.timings,
          });
        }
      }
    });
  });

  audioStore.preloadList(audioList);


  // Expose Lenis to window for DevTools
  if (import.meta.dev && import.meta.client) {
    watch(
      () => lenisRef.value?.lenis,
      (lenis) => {
        if (lenis) {
          // @ts-ignore
          window.lenis = lenis;
        }
      },
      { immediate: true }
    );
  }
});
</script>

<template>
  <div>
    <DevToolsView v-if="route.path === '/game-tools-view'" />
    <div v-else>
      <!-- Custom Cursor -->
      <div
        ref="cursorRef"
        class="custom-cursor fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-99999 transition-colors duration-300 ease-in-out will-change-transform"
        :class="animations.cursor.variant === 'dark' ? 'bg-primary' : 'bg-white'"
      />

      <!-- Global Audiowave -->
      <div class="fixed top-10 right-16 z-100 pointer-events-none transition-opacity duration-500">
        <CircleAudiowave
          class="w-14 h-14"
          :primary="animations.audiowave.variant === 'dark'"
          :animating="audioStore.isPlaying"
        />
      </div>


      <VueLenis root ref="lenisRef" />
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
      <HSPQuestionnaire v-if="gameStore.isGameEnded && gameStore.showQuestionnaire" id="hsp-questionnaire" class="relative z-10" />
    </div>
  </div>
</template>
