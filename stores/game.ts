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
  MenuStatus,
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
    menuStatus: "closed",
    introPlayed: false,
    introAnimationPhase: "hidden",
    introBlurAmount: 8,
    isAutoScrolling: false,
    selectedChoice: null,
    showQuestionnaire: false,
    forceShowUI: false,
    _annotationTimerId: null as ReturnType<typeof setTimeout> | null,
  }),

  getters: {
    currentScene(state): Scene | null {
      const scene = gameData.scenes[state.currentSceneId] ?? null;
      return scene;
    },

    currentDialogue(state): DialogueLine | null {
      const scene = gameData.scenes[state.currentSceneId];
      if (!scene || scene.dialogues.length === 0) return null;
      return scene.dialogues[state.currentDialogueIndex] ?? null;
    },

    isLastDialogue(state): boolean {
      const scene = gameData.scenes[state.currentSceneId];
      if (!scene) return true;
      return state.currentDialogueIndex >= scene.dialogues.length - 1;
    },

    hasDialogues(state): boolean {
      const scene = gameData.scenes[state.currentSceneId];
      return !!scene && scene.dialogues.length > 0;
    },

    hasChoices(state): boolean {
      const scene = gameData.scenes[state.currentSceneId];
      return !!scene?.choices && scene.choices.length > 0;
    },

    availableChoices(state): Choice[] {
      const scene = gameData.scenes[state.currentSceneId];
      if (!scene?.choices) return [];
      return scene.choices;
    },

    isChoiceDisabled(state): (choice: Choice) => boolean {
      return (choice: Choice) => {
        if (!choice.condition) return false;
        return !evaluateCondition(choice.condition, state.flags);
      };
    },

    energyPercentage(state): number {
      return Math.max(0, Math.min(100, state.flags.energy));
    },

    currentDay(state): 1 | 2 {
      const scene = gameData.scenes[state.currentSceneId];
      return scene?.day ?? 1;
    },

    currentTitle(state): string {
      const scene = gameData.scenes[state.currentSceneId];
      return scene?.title ?? "";
    },

    milestones(): Milestone[] {
      return Object.values(MILESTONES);
    },

    reachedMilestonesList(state): Milestone[] {
      return Object.values(MILESTONES).filter((m) =>
        state.reachedMilestones.includes(m.id)
      );
    },

    isGameEnded(state): boolean {
      return state.currentSceneId === "gameEnd";
    },

    // Getter pour l'annotation d'entrée (pour l'intro ou transitions de scènes)
    firstDialogueAnnotation(state): string | undefined {
      const scene = gameData.scenes[state.currentSceneId];
      if (!scene) return undefined;
      if (scene.entryAnnotation) return scene.entryAnnotation;
      return scene.dialogues[0]?.annotation;
    },

    // Verifier si c'est le premier dialogue de la scene initiale
    isFirstDialogueOfInitialScene(state): boolean {
      return (
        state.currentSceneId === gameData.initialSceneId &&
        state.currentDialogueIndex === 0
      );
    },
    
    // Status du menu
    isMenuOpen: (state) => state.menuStatus === "open",
    isMenuOpening: (state) => state.menuStatus === "opening",
    isMenuClosing: (state) => state.menuStatus === "closing",
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
          this.menuStatus = "closed";
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
      const audioStore = useAudioStore();
      const animationsStore = useAnimationsStore();

      // Clear any previous annotation timer/interval
      if (this._annotationTimerId) {
        clearTimeout(this._annotationTimerId);
        this._annotationTimerId = null;
      }


      // 1. Reset tout l'état du jeu
      this.currentSceneId = gameData.initialSceneId;
      this.currentDialogueIndex = 0;
      this.flags = { ...gameData.initialFlags };
      this.reachedMilestones = ["reveil"];
      this.isTransitioning = false;
      this.showChoices = false;
      this.menuStatus = "closed";
      this.selectedChoice = null;
      this.showQuestionnaire = false;
      
      // 2. Reset aurora (le menu la met en z-55 + visible, il faut nettoyer)
      animationsStore.setAuroraVisibility(false);
      animationsStore.setAuroraZIndex(0);

      // 3. Intro déjà jouée, pas de blur, annotation visible immédiatement
      this.introPlayed = true; 
      this.introAnimationPhase = "annotation";
      this.introBlurAmount = 0;
      this.saveGame();

      // 4. Lancer l'audio de la scène initiale
      const initialScene = gameData.scenes[gameData.initialSceneId];
      if (initialScene?.audio) {
         const audioPath = initialScene.audio.startsWith("/") ? initialScene.audio : `/audios/${initialScene.audio}`;
         audioStore.playAudio(audioPath);
      }

      // 5. Scroll to bottom immédiatement (skip l'animation de l'oeil)
      if (import.meta.client) {
          const experienceEl = document.getElementById('experience');
          if (experienceEl) {
              const targetY = experienceEl.offsetTop + experienceEl.offsetHeight;
               // @ts-ignore
              // @ts-expect-error lenis is added to window in app.vue
              if (window.lenis) {
                  // @ts-ignore
                  // @ts-expect-error lenis is added to window in app.vue
                  window.lenis.scrollTo(targetY, { immediate: true });
              } else {
                  window.scrollTo({
                      top: targetY,
                      behavior: 'instant'
                  });
              }
          }
      }

      // 6. Transition automatique : attendre le timing du premier mot puis passer en complete
      const firstDialogue = initialScene?.dialogues[0];
      const firstWordStart = firstDialogue?.timings?.[0]?.start || 3;
      const margin = 0.5;
      const delay = Math.max(1, (firstWordStart - margin)) * 1000; // en ms, minimum 1s

      this._annotationTimerId = setTimeout(() => {
        if (this.introAnimationPhase === "annotation") {
          this.introAnimationPhase = "complete";
        }
        this._annotationTimerId = null;
      }, delay);
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
      
      // Appliquer les effets du nouveau dialogue (ex: perte d'énergie progressive)
      const currentDialogue = this.currentDialogue;
      if (currentDialogue?.energyChange) {
         this.flags.energy = Math.max(0, Math.min(100, this.flags.energy + currentDialogue.energyChange));
      }

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

          // Clear any previous annotation timer
          if (this._annotationTimerId) {
            clearTimeout(this._annotationTimerId);
            this._annotationTimerId = null;
          }

          this._annotationTimerId = setTimeout(() => {
            if (this.introAnimationPhase === "annotation" || this.introAnimationPhase === "milestoneAnnotation") {
              this.introAnimationPhase = "complete";
            }
            this._annotationTimerId = null;
          }, 3000);
        }

        this.currentSceneId = sceneId;
        this.currentDialogueIndex = 0;
        
        // Appliquer les effets du premier dialogue de la nouvelle scène
        const firstDialogue = this.currentDialogue;
        if (firstDialogue?.energyChange) {
           this.flags.energy = Math.max(0, Math.min(100, this.flags.energy + firstDialogue.energyChange));
        }

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
      const isReached = this.reachedMilestones.includes(milestoneId) || import.meta.env.DEV;

      if (milestone && isReached) {
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
                this.menuStatus = "closed";
                return;
             }
          }
        }
      }
    },

    // Toggle menu with sequence
    async toggleMenu() {
      if (this.menuStatus === "open") {
        this.closeMenu();
        return;
      }

      this.menuStatus = "opening";
      // The actual opening will be triggered by GameContainer/Controller
    },

    openMenu() {
      this.menuStatus = "open";
      const audioStore = useAudioStore();
      audioStore.pauseAudio();
    },

    closeMenu() {
      this.menuStatus = "closing";

      // Wait for menu/icon closing animations (approx 500-700ms)
      setTimeout(() => {
        if (this.menuStatus === "closing") {
          this.menuStatus = "closed";
        }
      }, 700);

      const audioStore = useAudioStore();
      audioStore.resumeAudio();
    },
    
    toggleForceShowUI() {
      this.forceShowUI = !this.forceShowUI;
    }
  },
});
