import type { ComponentPublicInstance, Ref } from 'vue'

import type { Choice } from '../../types/game'

export const useChoicePresentation = (
  showGameUI: Ref<boolean>,
  choicesRef: Ref<ComponentPublicInstance | HTMLElement | null>
) => {
  const gameStore = useGameStore()
  const { $gsap } = useNuxtApp()

  const activeChoices = ref<Choice[]>([])

  watch(
    () => gameStore.showChoices,
    async (show) => {
      if (!show || !showGameUI.value) return

      activeChoices.value = [...gameStore.availableChoices]
      await nextTick()
      const refVal = choicesRef.value
      const el =
        refVal instanceof HTMLElement
          ? refVal
          : ((refVal as ComponentPublicInstance)?.$el as
              | HTMLElement
              | undefined)

      if (el) {
        $gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        )
      }
    }
  )

  watch(
    () => gameStore.selectedChoice,
    (choice) => {
      if (!choice && !gameStore.showChoices) {
        activeChoices.value = []
      }
    }
  )

  return {
    activeChoices,
  }
}
