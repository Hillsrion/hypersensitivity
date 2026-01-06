<script setup>
import LoadingSection from "./components/sections/LoadingSection.vue";
import SoundIntroduction from "./components/SoundIntroduction.vue";
import { useAudioStore } from "@/stores/audio";
import { useAnimationsStore } from "~/stores/animations";
import mainData from "./data/main.json";

const route = useRoute();

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

const isLoading = ref(false);
const introductionData = mainData.introduction;

onMounted(async () => {
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
    <LoadingSection v-if="isLoading" />
    <SoundIntroduction
      :text="introductionData.content"
      :audio="introductionData.audio"
      :timings="introductionData.timings"
    />
    <!-- Noise overlay -->
    <div
      class="fixed inset-0 z-9999 pointer-events-none opacity-15 bg-repeat bg-[url('/images/noise.svg')]"
    />
    <div class="relative z-1 mx-auto flex flex-col gap-y-16">
      <GenericSection
        v-for="section in mainData.sections"
        :key="section.title"
        :title="section.title"
        :content="section.content"
      />
    </div>
  </div>
</template>
