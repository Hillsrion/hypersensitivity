<script setup>
import { VueLenis } from "lenis/vue";
import LoadingSection from "./components/sections/LoadingSection.vue";
import SoundIntroduction from "./components/SoundIntroduction.vue";
import Experience from "./components/Experience.vue";
import { useAudioStore } from "@/stores/audio";
import { useAnimationsStore } from "~/stores/animations";
import mainData from "./data/main.json";
import TestimoniesSection from "./components/TestimoniesSection.vue";
import { useCustomCursor } from "./composables/useCustomCursor";

const { cursorRef } = useCustomCursor();

const route = useRoute();
const lenisRef = ref(null);

const audioStore = useAudioStore();
const animations = useAnimationsStore();

const { data: page } = await useAsyncData("page-" + route.path, () => {
  return queryCollection("content").path(route.path).first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const introductionData = mainData.introduction;

// Watch loading state and control Lenis scrolling
watch(
  () => animations.landing.intro.entry.completed,
  (newState) => {
    if (!lenisRef.value?.lenis) return;

    if (newState) {
      // Re-enable scrolling after loading is complete
      lenisRef.value.lenis.start();
    }
  },
  { immediate: true }
);

import { gameData } from "~/app/data/game";

onMounted(async () => {
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

  // Dev shortcut: scroll to a specific component on pageload
  const target = route.query.scroll || (import.meta.dev ? "experience" : null);
  if (target) {
    // We wait a bit for Lenis and ScrollTrigger to be fully initialized and for the page to render
    setTimeout(() => {
      const element = document.getElementById(String(target));
      if (element && lenisRef.value?.lenis) {
        lenisRef.value.lenis.scrollTo(element, { immediate: true });
      }
    }, 500);
  }
});
</script>

<template>
  <div>
    <!-- Custom Cursor -->
    <div
      ref="cursorRef"
      class="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-99999 transition-colors duration-300 ease-in-out will-change-transform"
      :class="animations.cursor.variant === 'dark' ? 'bg-primary' : 'bg-white'"
    />
    <VueLenis root ref="lenisRef" />
    <BackgroundGradient />
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
  </div>
</template>
