import type { Ref } from "vue";
import type { Choice } from "../../types/game";
import { useGameStore } from "~/stores/game";

export function useChoiceButtons(
  choices: Ref<Choice[]>,
  buttonRefs: Ref<HTMLElement[]>,
  iconRef: Ref<HTMLElement | null>,
  emit: {
    (e: "select", choice: Choice): void;
    (e: "selecting"): void;
  }
) {
  const { $gsap } = useNuxtApp();
  const gameStore = useGameStore();

  const hoveredIndex = ref<number | null>(null);
  const isSelecting = ref(false);
  const selectedIndex = ref<number | null>(null);

  // Si un choix est déjà sélectionné dans le store au montage
  onMounted(() => {
    if (gameStore.selectedChoice) {
      const index = choices.value.findIndex(
        (c) => c.id === gameStore.selectedChoice?.id
      );
      if (index !== -1) {
        selectedIndex.value = index;
        isSelecting.value = true;
      }
    }
  });

  // Reset l'état quand on doit réafficher les choix
  watch(
    () => gameStore.showChoices,
    (show) => {
      if (show) {
        isSelecting.value = false;
        selectedIndex.value = null;
      }
    }
  );

  const handleSelect = async (choice: Choice, index: number) => {
    if (gameStore.isChoiceDisabled(choice) || isSelecting.value) return;

    isSelecting.value = true;
    selectedIndex.value = index;
    emit("selecting");

    const tl = $gsap.timeline({
      onComplete: () => {
        emit("select", choice);
      },
    });

    // Fade out icon and non-selected choice
    const elementsToFade = [
      iconRef.value,
      ...buttonRefs.value.filter((_, i) => i !== index),
    ].filter(Boolean) as HTMLElement[];

    tl.to(elementsToFade, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
    });

    // Move selected choice to center horizontal
    const selectedBtn = buttonRefs.value[index];
    if (selectedBtn) {
      const rect = selectedBtn.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const btnCenterX = rect.left + rect.width / 2;
      const xMove = centerX - btnCenterX;

      tl.to(selectedBtn, {
        x: xMove,
        duration: 0.85,
        ease: "power3.inOut",
      });
    }
  };

  return {
    hoveredIndex,
    isSelecting,
    selectedIndex,
    handleSelect,
  };
}
