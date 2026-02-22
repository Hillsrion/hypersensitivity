import type { Choice } from '../../types/game'

export const useChoicePresentation = (
  showGameUI: Ref<boolean>,
  choicesRef: Ref<HTMLElement | null>
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

      if (choicesRef.value) {
        $gsap.fromTo(
          choicesRef.value,
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
