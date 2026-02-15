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
import { SCENE_IDS } from "../app/data/constants";
import { devConfig } from "../app/config/dev";
import { useAudioStore } from "./audio";
import { useAnimationsStore } from "./animations";
import { MILESTONES, MILESTONE_ORDER, getMilestoneForScene } from "../app/data/milestones";

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
    reachedMilestones: ["reveil"],
    isTransitioning: false,
    showChoices: false,
    isMenuOpen: false,
    isMenuOpening: false,
    introPlayed: false,
    introAnimationPhase: "hidden",
    introBlurAmount: 8,
    isAutoScrolling: false,
    selectedChoice: null,
    showQuestionnaire: false,
  }),

  getters: {
    currentScene(): Scene | null {
      const scene = gameData.scenes[this.currentSceneId] ?? null;
      return scene;
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
      return Object.values(MILESTONES);
    },

    reachedMilestonesList(): Milestone[] {
      return Object.values(MILESTONES).filter((m) =>
        this.reachedMilestones.includes(m.id)
      );
    },

    isGameEnded(): boolean {
      return this.currentSceneId === "gameEnd";
    },

    // Getter pour l'annotation d'entrée (pour l'intro ou transitions de scènes)
    firstDialogueAnnotation(): string | undefined {
      const scene = this.currentScene;
      if (!scene) return undefined;
      if (scene.entryAnnotation) return scene.entryAnnotation;
      return scene.dialogues[0]?.annotation;
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

      // Dev Config Override
      if (import.meta.env.DEV && devConfig.enabled && devConfig.initialSceneId) {
        console.log("LOG_DEBUG: Applying Dev Config", devConfig);
        this.currentSceneId = devConfig.initialSceneId;
        this.currentDialogueIndex = 0;
        this.flags = { ...gameData.initialFlags, ...devConfig.initialFlags };
        this.introPlayed = true;
        this.introAnimationPhase = "complete";
        this.introBlurAmount = 0; 
        
        // Ensure cursor is correctly set when skipping intro
        const animationsStore = useAnimationsStore();
        animationsStore.setCursorVariant("dark");
        animationsStore.setAudiowaveVariant("dark");
        
        // Also set audio playback rate if specified
        if (devConfig.playbackRate) {
           const audioStore = useAudioStore();
           audioStore.setPlaybackRate(devConfig.playbackRate);
        }
        return; 
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const state = JSON.parse(saved) as GameState;
          // On restaure les milestones pour le menu
          this.reachedMilestones = state.reachedMilestones || ["reveil"];
          if (!this.reachedMilestones.includes("reveil")) {
            this.reachedMilestones.unshift("reveil");
          }
          this.currentSceneId = gameData.initialSceneId;
          this.currentDialogueIndex = 0;
          this.flags = { ...gameData.initialFlags };
          this.introPlayed = false;
          this.introAnimationPhase = "hidden";
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
      this.reachedMilestones = ["reveil"];
      this.isTransitioning = false;
      this.showChoices = false;
      this.isMenuOpen = false;
      this.introPlayed = false;
      this.introAnimationPhase = "hidden";
      this.selectedChoice = null;
      this.showQuestionnaire = false;
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
    
    setShowQuestionnaire(show: boolean) {
      this.showQuestionnaire = show;
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
        this.selectedChoice = null; // Clear previous choice when new choices appear
        this.showChoices = true;
        return;
      }



      // Override manuel via nextSceneId
      if (scene.nextSceneId) {
        this.goToScene(scene.nextSceneId);
        return;
      }

      // Sinon, navigation automatique via la playlist du milestone
      this.goToNextScene();
    },

    // Selectionner un choix
    selectChoice(choice: Choice) {
      this.selectedChoice = choice;
      this.showChoices = false;

      // Appliquer les effets
      if (choice.effects) {
        if (choice.effects.energy) {
          this.flags.energy = Math.max(
            0,
            Math.min(100, this.flags.energy + choice.effects.energy)
          );
        }
        if (choice.effects.flags) {
          this.flags = { ...this.flags, ...choice.effects.flags };
        }
      }

      this.saveGame();

      // Navigation apres choix
      if (choice.nextSceneId) {
        this.goToScene(choice.nextSceneId);
      } else {
        // Fallback si pas de nextSceneId défini sur le choix
        // On essaie de continuer la playlist
        this.goToNextScene();
      }
    },

    // Trouve et va à la prochaine scène valide
    goToScene(sceneId: string) {
      if (this.isTransitioning) return;

      const scene = gameData.scenes[sceneId];
      if (!scene) {
        console.error(`Scene not found: ${sceneId}`);
        return;
      }

      this.isTransitioning = true;

      // Petit delai pour la transition
      setTimeout(() => {
        // On ne réinitialise le choix sélectionné que s'il y a un changement de milestone (annotation d'entrée)
        if (scene.entryAnnotation) {
          this.selectedChoice = null;
          
          // Si l'intro (Reveil) est déjà passée, on utilise le style "dialogue" (showOnly)
          // Sinon on utilise le style "intro" (écran flou)
          if (this.introPlayed) {
             this.introAnimationPhase = "milestoneAnnotation";
          } else {
             this.introAnimationPhase = "annotation";
          }

          setTimeout(() => {
            if (this.introAnimationPhase === "annotation" || this.introAnimationPhase === "milestoneAnnotation") {
              this.introAnimationPhase = "complete";
            }
          }, 3000);
        }

        this.currentSceneId = sceneId;
        this.currentDialogueIndex = 0;
        this.showChoices = false;
        this.isTransitioning = false;
        this.saveGame();
      }, 300);
    },

    goToNextScene() {
      const currentMilestone = getMilestoneForScene(this.currentSceneId);
      
      if (currentMilestone) {
        const currentIndex = currentMilestone.scenes.indexOf(this.currentSceneId);
        
        // 1. Chercher dans le milestone actuel après la scène courante
        for (let i = currentIndex + 1; i < currentMilestone.scenes.length; i++) {
          const nextSceneId = currentMilestone.scenes[i];
          if (!nextSceneId) continue;
          const nextScene = gameData.scenes[nextSceneId];
          
          if (nextScene) {
            // Si pas de condition ou condition respectée
            let isValid = true;
            if (nextScene.condition && !evaluateCondition(nextScene.condition, this.flags)) {
              isValid = false;
            }
            if (nextScene.conditions && nextScene.conditions.some((c: ChoiceCondition) => !evaluateCondition(c, this.flags))) {
              isValid = false;
            }

            if (isValid) {
              this.goToScene(nextSceneId);
              return;
            }
          }
        }

        // 2. Si rien trouvé, passer au milestone suivant
        const currentMilestoneIndex = MILESTONE_ORDER.indexOf(currentMilestone.id);
        if (currentMilestoneIndex !== -1 && currentMilestoneIndex < MILESTONE_ORDER.length - 1) {
          const nextMilestoneId = MILESTONE_ORDER[currentMilestoneIndex + 1];
          if (nextMilestoneId) {
             this.goToMilestone(nextMilestoneId);
             return;
          }
        }
      }

      // Si on est ici et que c'est la fin du jeu ou qu'on ne trouve rien
      if (this.currentSceneId !== SCENE_IDS.GAME_END) {
         // Fallback ou fin de jeu explicite si nécessaire
         // Pour l'instant on ne fait rien ou on log une erreur
         console.warn("No next scene found.");
      }
    },

    // Aller a un milestone (trouve la première scène valide)
    goToMilestone(milestoneId: string) {
      const milestone = MILESTONES[milestoneId];
      if (milestone && this.reachedMilestones.includes(milestoneId)) {
        // Chercher la première scène valide du milestone
        for (const sceneId of milestone.scenes) {
          const scene = gameData.scenes[sceneId];
          if (scene) {
             let isValid = true;
             if (scene.condition && !evaluateCondition(scene.condition, this.flags)) {
               isValid = false;
             }
             if (scene.conditions && scene.conditions.some((c: ChoiceCondition) => !evaluateCondition(c, this.flags))) {
               isValid = false;
             }

             if (isValid) {
                this.introPlayed = true;
                this.introAnimationPhase = "complete";
                this.goToScene(sceneId);
                this.isMenuOpen = false;
                return;
             }
          }
        }
      }
    },

    // Toggle menu with sequence
    async toggleMenu() {
      if (this.isMenuOpen) {
        this.closeMenu();
        return;
      }

      this.isMenuOpening = true;
      // The actual opening (isMenuOpen = true) will be triggered by GameContainer
      // after elements have faded out.
    },

    openMenu() {
      this.isMenuOpening = false;
      this.isMenuOpen = true;
      const audioStore = useAudioStore();
      audioStore.pauseAudio();
    },

    closeMenu() {
      this.isMenuOpen = false;
      this.isMenuOpening = false;
      const audioStore = useAudioStore();
      audioStore.resumeAudio();
    },
  },
});
