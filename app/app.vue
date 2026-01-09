<script setup>
import { VueLenis } from "lenis/vue";
import LoadingSection from "./components/sections/LoadingSection.vue";
import SoundIntroduction from "./components/SoundIntroduction.vue";
import { useAudioStore } from "@/stores/audio";
import { useAnimationsStore } from "~/stores/animations";
import mainData from "./data/main.json";
import TestimoniesSection from "./components/TestimoniesSection.vue";

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

onMounted(async () => {
  scrollTo(0, 0);
  if (!animations.landing.intro.entry.completed) {
    lenisRef.value?.lenis?.stop();
  }
  const audioList = mainData.testimonies
    .filter((item) => item.audio)
    .map((item) => ({
      path: item.audio,
      transcript: item.content,
      timings: item.timings,
    }));
  audioList.push({
    path: "/audios/alix-intro.mp3",
    transcript: introductionData.content,
    timings: introductionData.timings,
  });
  audioStore.preloadList(audioList);
});
</script>

<template>
  <div>
    <VueLenis root ref="lenisRef" />
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
        v-for="section in mainData.sections"
        :key="section.title"
        :title="section.title"
        :content="section.content"
        :color="section.color"
      />
    </div>
    <TestimoniesSection />
  </div>
</template>
