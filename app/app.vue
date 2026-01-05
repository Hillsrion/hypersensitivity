<script setup>
import LoadingSection from "./components/sections/LoadingSection.vue";
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
</script>

<template>
  <div>
    <LoadingSection v-if="isLoading" />
  </div>
</template>
