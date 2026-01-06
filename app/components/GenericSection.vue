<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section>
    <div
      class="container mx-auto max-w-3xl h-svh flex flex-col items-center justify-center"
    >
      <h2
        class="text-[3.5rem] leading-18 font-serif font-light text-center mb-8"
      >
        {{ title }}
      </h2>
      <ul class="max-w-lg mx-auto flex flex-col gap-y-4">
        <li v-for="(item, index) in content" :key="index">
          <p class="text-xl text-primary/80">
            {{ item }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>