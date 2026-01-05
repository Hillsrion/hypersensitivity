<script setup>
onMounted(() => {
  console.log("MainTitle mounted");
});

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h1 class="text-4xl font-bold text-white">
    {{ title }}
  </h1>
</template>