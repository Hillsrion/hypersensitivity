<script setup>
import LoadingSection from "./components/sections/LoadingSection.vue";
import SoundIntroduction from "./components/SoundIntroduction.vue";
import mainData from "./data/main.json";

const route = useRoute();

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

const isLoading = ref(true);
const introductionData = mainData.introduction;
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
  </div>
</template>
