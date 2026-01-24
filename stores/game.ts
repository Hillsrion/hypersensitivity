import { defineStore } from "pinia";
import type {
  GameState,
  GameFlags,
  Scene,
  DialogueLine,
  Choice,
  ChoiceCondition,
  Milestone,
  IntroAnimationPhase,
} from "../app/types/game";
import { gameData } from "../app/data/game";

const STORAGE_KEY = "hypersensitivity-game-state";

// Helper pour evaluer les conditions
const evaluateCondition = (
  condition: ChoiceCondition,
  flags: GameFlags
): boolean => {
  const value = flags[condition.flag];

  switch (condition.operator) {
    case "equals":
      return value === condition.value;
    case "notEquals":
      return value !== condition.value;
    case "greaterThan":
      return typeof value === "number" && value > (condition.value as number);
    case "lessThan":
      return typeof value === "number" && value < (condition.value as number);
    default:
      return true;
  }
};

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    currentSceneId: gameData.initialSceneId,
    currentDialogueIndex: 0,
    flags: { ...gameData.initialFlags },
    reachedMilestones: [],
    isTransitioning: false,
    showChoices: false,
    isMenuOpen: false,
    introPlayed: false,
    introAnimationPhase: "hidden",
    introBlurAmount: 8,
  }),

  getters: {
    currentScene(): Scene | null {
      return gameData.scenes[this.currentSceneId] ?? null;
    },

    currentDialogue(): DialogueLine | null {
      const scene = this.currentScene;
      if (!scene || scene.dialogues.length === 0) return null;
      return scene.dialogues[this.currentDialogueIndex] ?? null;
    },

    isLastDialogue(): boolean {
      const scene = this.currentScene;
      if (!scene) return true;
      return this.currentDialogueIndex >= scene.dialogues.length - 1;
    },

    hasDialogues(): boolean {
      const scene = this.currentScene;
      return !!scene && scene.dialogues.length > 0;
    },

    hasChoices(): boolean {
      const scene = this.currentScene;
      return !!scene?.choices && scene.choices.length > 0;
    },

    availableChoices(): Choice[] {
      const scene = this.currentScene;
      if (!scene?.choices) return [];
      return scene.choices;
    },

    isChoiceDisabled(): (choice: Choice) => boolean {
      return (choice: Choice) => {
        if (!choice.condition) return false;
        return !evaluateCondition(choice.condition, this.flags);
      };
    },

    energyPercentage(): number {
      return Math.max(0, Math.min(100, this.flags.energy));
    },

    currentDay(): 1 | 2 {
      return this.currentScene?.day ?? 1;
    },

    currentTitle(): string {
      return this.currentScene?.title ?? "";
    },

    milestones(): Milestone[] {
      return gameData.milestones;
    },

    reachedMilestonesList(): Milestone[] {
      return gameData.milestones.filter((m) =>
        this.reachedMilestones.includes(m.id)
      );
    },

    isGameEnded(): boolean {
      return this.currentSceneId === "game_end";
    },

    // Getter pour l'annotation du premier dialogue (pour l'intro)
    firstDialogueAnnotation(): string | undefined {
      const initialScene = gameData.scenes[gameData.initialSceneId];
      return initialScene?.dialogues[0]?.annotation;
    },

    // Verifier si c'est le premier dialogue de la scene initiale
    isFirstDialogueOfInitialScene(): boolean {
      return (
        this.currentSceneId === gameData.initialSceneId &&
        this.currentDialogueIndex === 0
      );
    },
  },

  actions: {
    // Initialiser le jeu (charger depuis localStorage ou reset)
    initGame(forceReset = false) {
      if (forceReset) {
        this.resetGame();
        return;
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const state = JSON.parse(saved) as GameState;
          this.$patch(state);
        } catch {
          this.resetGame();
        }
      }
    },

    // Sauvegarder l'etat
    saveGame() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state));
    },

    // Reset le jeu
    resetGame() {
      this.currentSceneId = gameData.initialSceneId;
      this.currentDialogueIndex = 0;
      this.flags = { ...gameData.initialFlags };
      this.reachedMilestones = [];
      this.isTransitioning = false;
      this.showChoices = false;
      this.isMenuOpen = false;
      this.introPlayed = false;
      this.introAnimationPhase = "hidden";
      this.saveGame();
    },

    // Marquer l'intro comme jouee (appele par Experience.vue)
    setIntroPlayed() {
      this.introPlayed = true;
    },

    // Definir la phase de l'animation d'intro (appele par Experience.vue)
    setIntroAnimationPhase(phase: IntroAnimationPhase) {
      this.introAnimationPhase = phase;
    },

    setIntroBlurAmount(amount: number) {
      this.introBlurAmount = amount;
    },

    // Avancer dans les dialogues
    advanceDialogue() {
      if (this.isTransitioning) return;

      const scene = this.currentScene;
      if (!scene) return;

      // Si pas de dialogues ou dernier dialogue
      if (!this.hasDialogues || this.isLastDialogue) {
        this.handleEndOfDialogues();
        return;
      }

      // Avancer au dialogue suivant
      this.currentDialogueIndex++;
      this.saveGame();
    },

    // Gerer la fin des dialogues
    handleEndOfDialogues() {
      const scene = this.currentScene;
      if (!scene) return;

      // Si il y a des choix, les afficher
      if (this.hasChoices) {
        this.showChoices = true;
        return;
      }

      // Si auto-choice, l'evaluer
      if (scene.autoChoice) {
        const nextSceneId = evaluateCondition(
          scene.autoChoice.condition,
          this.flags
        )
          ? scene.autoChoice.thenSceneId
          : scene.autoChoice.elseSceneId;
        this.goToScene(nextSceneId);
        return;
      }

      // Sinon, aller a la scene suivante
      if (scene.nextSceneId) {
        this.goToScene(scene.nextSceneId);
      }
    },

    // Selectionner un choix
    selectChoice(choice: Choice) {
      if (this.isChoiceDisabled(choice)) return;

      // Appliquer les effets
      if (choice.effects) {
        if (choice.effects.energy !== undefined) {
          this.flags.energy = Math.max(
            0,
            Math.min(100, this.flags.energy + choice.effects.energy)
          );
        }
        if (choice.effects.flags) {
          Object.assign(this.flags, choice.effects.flags);
        }
      }

      // Aller a la scene suivante
      this.goToScene(choice.nextSceneId);
    },

    // Aller a une scene
    goToScene(sceneId: string) {
      this.isTransitioning = true;
      this.showChoices = false;

      // Petit delai pour la transition
      setTimeout(() => {
        const scene = gameData.scenes[sceneId];
        if (!scene) {
          this.isTransitioning = false;
          return;
        }

        // Appliquer les effets d'entree
        if (scene.onEnter) {
          if (scene.onEnter.energyChange !== undefined) {
            this.flags.energy = Math.max(
              0,
              Math.min(100, this.flags.energy + scene.onEnter.energyChange)
            );
          }
          if (scene.onEnter.setFlags) {
            Object.assign(this.flags, scene.onEnter.setFlags);
          }
        }

        // Enregistrer le milestone si present
        if (scene.milestone && !this.reachedMilestones.includes(scene.milestone)) {
          this.reachedMilestones.push(scene.milestone);
        }

        this.currentSceneId = sceneId;
        this.currentDialogueIndex = 0;
        this.isTransitioning = false;

        // Si pas de dialogues, gerer directement
        if (!scene.dialogues.length) {
          this.handleEndOfDialogues();
        }

        this.saveGame();
      }, 300);
    },

    // Aller a un milestone
    goToMilestone(milestoneId: string) {
      const milestone = gameData.milestones.find((m) => m.id === milestoneId);
      if (milestone && this.reachedMilestones.includes(milestoneId)) {
        this.goToScene(milestone.sceneId);
        this.isMenuOpen = false;
      }
    },

    // Toggle menu
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    closeMenu() {
      this.isMenuOpen = false;
    },
  },
});
