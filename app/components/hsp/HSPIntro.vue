<script setup>
const props = defineProps({
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

const { $gsap } = useNuxtApp();
const titleRef = ref(null);
const desc1Ref = ref(null);
const desc2Ref = ref(null);
const stat1Ref = ref(null);
const stat2Ref = ref(null);
const btnRef = ref(null);

const leave = () => {
  return new Promise((resolve) => {
    const tl = $gsap.timeline({
      onComplete: resolve
    });

    const elements = [
      titleRef.value,
      desc1Ref.value,
      desc2Ref.value,
      stat1Ref.value,
      stat2Ref.value,
      btnRef.value
    ];

    tl.to(elements, {
      y: -20,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.in'
    });
  });
};

const enter = () => {
  return new Promise((resolve) => {
    const tl = $gsap.timeline({
      onComplete: resolve
    });

    const elements = [
      titleRef.value,
      desc1Ref.value,
      desc2Ref.value,
      stat1Ref.value,
      stat2Ref.value,
      btnRef.value
    ];

    tl.fromTo(elements, 
      {
        y: 20,
        opacity: 0,
        filter: 'blur(10px)'
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
  });
};

defineExpose({
  leave,
  enter
});

onMounted(() => {
  enter();
});
</script>

<template>
  <div class="w-full max-w-3xl text-center">
    <div class="mb-8 max-w-2xl mx-auto text-xl/7 leading-relaxed space-y-4">
      <h2 ref="titleRef" class="text-white uppercase">Avertissement</h2>
      <p ref="desc1Ref" class="font-serif">
        Ce questionnaire est un outil d'auto-exploration, non un diagnostic clinique. Il s'appuie sur le modèle de la Haute Sensibilité (HSP) d'Elaine Aron.
      </p>
      <p ref="desc2Ref" class="font-serif">
        Ce test mesure une <strong>intensité</strong>, pas une réponse binaire. Pour un accompagnement personnalisé, consultez un professionnel de santé mentale.
      </p>
    </div>
    
    <div class="flex items-center justify-center gap-8 text-gray-500 text-sm">
      <span ref="stat1Ref" class="font-serif p-4 rounded-full border border-white text-white text-base/5">
        {{ totalQuestions }} questions réparties en {{ sectionsCount }} sections
      </span>
      <span ref="stat2Ref" class="font-serif p-4 rounded-full border border-white text-white text-base/5">
        Durée estimée : 10 minutes
      </span>
    </div>

    <!-- Wrapper handles positioning -->
    <div class="absolute bottom-18 left-1/2 -translate-x-1/2">
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
