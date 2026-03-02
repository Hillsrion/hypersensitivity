<script setup>
import { EDGE_SPACING } from '~/app/constants/layout'

defineProps({
  totalQuestions: {
    type: Number,
    required: true,
  },
  sectionsCount: {
    type: Number,
    required: true,
  },
})

defineEmits(['start'])

const { enter, leave } = useHSPIntroAnimation()

defineExpose({
  leave,
  enter,
})

onMounted(() => {
  enter()
})
</script>

<template>
  <div class="w-full max-w-3xl text-center">
    <AppText
      as="div"
      variant="body"
      class="mb-8 max-w-2xl mx-auto leading-relaxed space-y-4"
    >
      <h2 ref="titleRef" class="text-white uppercase">Avertissement</h2>
      <p ref="desc1Ref" class="font-serif">
        Ce questionnaire est un outil d'auto-exploration, non un diagnostic
        clinique. Il s'appuie sur le modèle de la Haute Sensibilité (HSP)
        d'Elaine Aron.
      </p>
      <p ref="desc2Ref" class="font-serif">
        Ce test mesure une <strong>intensité</strong>, pas une réponse binaire.
        Pour un accompagnement personnalisé, consultez un professionnel de santé
        mentale.
      </p>
    </AppText>

    <div class="flex items-center justify-center gap-8 text-gray-500 text-sm">
      <span
        ref="stat1Ref"
        class="font-serif p-4 rounded-full border border-white text-white text-base/5"
      >
        {{ totalQuestions }} questions réparties en {{ sectionsCount }} sections
      </span>
      <span
        ref="stat2Ref"
        class="font-serif p-4 rounded-full border border-white text-white text-base/5"
      >
        Durée estimée : 10 minutes
      </span>
    </div>

    <!-- Wrapper handles positioning -->
    <div
      class="absolute left-1/2 -translate-x-1/2"
      :class="EDGE_SPACING.BOTTOM"
    >
      <!-- Button handles interaction and animation -->
      <button
        ref="btnRef"
        class="uppercase text-base/5 items-center justify-center font-medium text-white transition-all duration-300"
        @click="$emit('start')"
      >
        Commencer le questionnaire
      </button>
    </div>
  </div>
</template>
