<script setup>
defineProps({
  totalQuestions: {
    type: Number,
    required: true
  },
  sectionsCount: {
    type: Number,
    required: true
  }
});

defineEmits(['start']);
</script>

<template>
  <div class="w-full max-w-3xl text-center">
    <div class="mb-8 max-w-2xl mx-auto text-xl/7 leading-relaxed space-y-4">
      <h2 class="text-white uppercase">Avertissement</h2>
      <p class="font-serif">
        Ce questionnaire est un outil d'auto-exploration, non un diagnostic clinique. Il s'appuie sur le modèle de la Haute Sensibilité (HSP) d'Elaine Aron.
      </p>
      <p class="font-serif">
        Ce test mesure une <strong>intensité</strong>, pas une réponse binaire. Pour un accompagnement personnalisé, consultez un professionnel de santé mentale.
      </p>
    </div>
    
    <div class="flex items-center justify-center gap-8 text-gray-500 text-sm">
      <span class="font-serif p-4 rounded-full border border-white text-white text-base/5">
        {{ totalQuestions }} questions réparties en {{ sectionsCount }} sections
      </span>
      <span class="font-serif p-4 rounded-full border border-white text-white text-base/5">
        Durée estimée : 10 minutes
      </span>
    </div>

    <button 
      class="absolute bottom-18 uppercase left-1/2 text-base/5 -translate-x-1/2 items-center justify-center font-medium text-white transition-all duration-300"
      @click="$emit('start')"
    >
      Commencer le questionnaire
    </button>
  </div>
</template>
