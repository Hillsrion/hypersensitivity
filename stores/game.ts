import { defineStore } from "pinia";
import type {
  Choice,
  DialogueLine,
  IntroAnimationPhase,
  Milestone,
  Scene,
} from "../app/types/game";
import { gameData } from "../app/data/game";
import { SCENE_IDS } from "../app/data/constants";
import { devConfig } from "../app/config/dev";
import { useAudioStore } from "./audio";
import { useAnimationsStore } from "./animations";
import {
  MILESTONES,
  MILESTONE_ORDER,
  getMilestoneForScene,
} from "../app/data/milestones";
import {
  STORAGE_KEY,
  createInitialFlags,
  createInitialGameState,
  ensureInitialMilestone,
} from "./game/state";
import { applyChoiceEffects, applyDialogueEnergyChange } from "./game/effects";
import {
  findFirstValidSceneIdInMilestone,
  resolveNextProgressionStep,
} from "./game/progression";
import {
  clearScheduledTimer,
  computeAnnotationDelayMs,
  getEntryAnnotationPhase,
  scheduleTimer,
  shouldAutoCompleteAnnotation,
} from "./game/intro";
import { loadSnapshot, saveSnapshot } from "./game/persistence";
import {
  MENU_CLOSE_DELAY_MS,
  finalizeClosingStatus,
  getMenuClosingStatus,
  getMenuOpenStatus,
  getToggleTargetMenuStatus,
} from "./game/menu";
import {
  getAvailableChoices,
  getCurrentDay,
  getCurrentDialogue,
  getCurrentScene,
  getCurrentTitle,
  getEnergyPercentage,
  getFirstDialogueAnnotation,
  getHasChoices,
  getHasDialogues,
  getIsLastDialogue,
  getMilestones,
  getReachedMilestonesList,
  isChoiceDisabled,
  isFirstDialogueOfInitialScene,
  isGameEnded,
} from "./game/selectors";

export const useGameStore = defineStore("game", {
  state: createInitialGameState,

  getters: {
    currentScene(state): Scene | null {
      return getCurrentScene(gameData.scenes, state.currentSceneId);
    },

    currentDialogue(state): DialogueLine | null {
      return getCurrentDialogue(
        gameData.scenes,
        state.currentSceneId,
        state.currentDialogueIndex
      );
    },

    isLastDialogue(state): boolean {
      return getIsLastDialogue(
        gameData.scenes,
        state.currentSceneId,
        state.currentDialogueIndex
      );
    },

    hasDialogues(state): boolean {
      return getHasDialogues(gameData.scenes, state.currentSceneId);
    },

    hasChoices(state): boolean {
      return getHasChoices(gameData.scenes, state.currentSceneId);
    },

    availableChoices(state): Choice[] {
      return getAvailableChoices(gameData.scenes, state.currentSceneId);
    },

    isChoiceDisabled(state): (choice: Choice) => boolean {
      return (choice: Choice) => isChoiceDisabled(choice, state.flags);
    },

    energyPercentage(state): number {
      return getEnergyPercentage(state.flags.energy);
    },

    currentDay(state): 1 | 2 {
      return getCurrentDay(gameData.scenes, state.currentSceneId);
    },

    currentTitle(state): string {
      return getCurrentTitle(gameData.scenes, state.currentSceneId);
    },

    milestones(): Milestone[] {
      return getMilestones();
    },

    reachedMilestonesList(state): Milestone[] {
      return getReachedMilestonesList(state.reachedMilestones);
    },

    isGameEnded(state): boolean {
      return isGameEnded(state.currentSceneId, SCENE_IDS.GAME_END);
    },

    firstDialogueAnnotation(state): string | undefined {
      return getFirstDialogueAnnotation(gameData.scenes, state.currentSceneId);
    },

    isFirstDialogueOfInitialScene(state): boolean {
      return isFirstDialogueOfInitialScene(
        state.currentSceneId,
        state.currentDialogueIndex,
        gameData.initialSceneId
      );
    },

    isMenuOpen: (state) => state.menuStatus === "open",
    isMenuOpening: (state) => state.menuStatus === "opening",
    isMenuClosing: (state) => state.menuStatus === "closing",
  },

  actions: {
    initGame(forceReset = false) {
      if (forceReset) {
        this.resetGame();
        return;
      }

      if (import.meta.env.DEV && devConfig.enabled && devConfig.initialSceneId) {
        console.log("LOG_DEBUG: Applying Dev Config", devConfig);
        this.currentSceneId = devConfig.initialSceneId;
        this.currentDialogueIndex = 0;
        this.flags = { ...createInitialFlags(), ...devConfig.initialFlags };
        this.introPlayed = true;
        this.introAnimationPhase = "complete";
        this.introBlurAmount = 0;

        const animationsStore = useAnimationsStore();
        animationsStore.setCursorVariant("dark");
        animationsStore.setAudiowaveVariant("dark");

        if (devConfig.playbackRate) {
          const audioStore = useAudioStore();
          audioStore.setPlaybackRate(devConfig.playbackRate);
        }

        return;
      }

      try {
        const savedState = loadSnapshot(STORAGE_KEY);
        if (savedState) {
          this.reachedMilestones = ensureInitialMilestone(
            savedState.reachedMilestones
          );
          this.currentSceneId = gameData.initialSceneId;
          this.currentDialogueIndex = 0;
          this.flags = createInitialFlags();
          this.introPlayed = false;
          this.introAnimationPhase = "hidden";
          this.menuStatus = "closed";
        }
      } catch {
        this.resetGame();
      }
    },

    saveGame() {
      saveSnapshot(STORAGE_KEY, this.$state);
    },

    resetGame() {
      const audioStore = useAudioStore();
      const animationsStore = useAnimationsStore();

      this._annotationTimerId = clearScheduledTimer(this._annotationTimerId);

      this.currentSceneId = gameData.initialSceneId;
      this.currentDialogueIndex = 0;
      this.flags = createInitialFlags();
      this.reachedMilestones = ["reveil"];
      this.isTransitioning = false;
      this.isDayTransitioning = false;
      this.showChoices = false;
      this.menuStatus = "closed";
      this.selectedChoice = null;
      this.showQuestionnaire = false;

      animationsStore.setAuroraVisibility(false);
      animationsStore.setAuroraZIndex(0);

      this.introPlayed = true;
      this.introAnimationPhase = "annotation";
      this.introBlurAmount = 0;
      this.saveGame();

      const initialScene = gameData.scenes[gameData.initialSceneId];
      if (initialScene?.audio) {
        const audioPath = initialScene.audio.startsWith("/")
          ? initialScene.audio
          : `/audios/${initialScene.audio}`;
        audioStore.playAudio(audioPath);
      }

      if (import.meta.client) {
        const experienceEl = document.getElementById("experience");
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
              behavior: "instant",
            });
          }
        }
      }

      const firstDialogue = initialScene?.dialogues[0];
      const firstWordStart = firstDialogue?.timings?.[0]?.start;
      const delay = computeAnnotationDelayMs(firstWordStart);

      this._annotationTimerId = scheduleTimer(() => {
        if (this.introAnimationPhase === "annotation") {
          this.introAnimationPhase = "complete";
        }
        this._annotationTimerId = null;
      }, delay);
    },

    setIntroPlayed() {
      this.introPlayed = true;
    },

    setIntroAnimationPhase(phase: IntroAnimationPhase) {
      this.introAnimationPhase = phase;
    },

    setIntroBlurAmount(amount: number) {
      this.introBlurAmount = amount;
    },

    setShowQuestionnaire(show: boolean) {
      this.showQuestionnaire = show;
    },

    setAutoScrolling(isAutoScrolling: boolean) {
      this.isAutoScrolling = isAutoScrolling;
    },

    setDayTransitioning(isTransitioning: boolean) {
      this.isDayTransitioning = isTransitioning;
    },

    setShowChoices(showChoices: boolean) {
      this.showChoices = showChoices;
    },

    advanceDialogue() {
      if (this.isTransitioning) return;

      const scene = this.currentScene;
      if (!scene) return;

      if (!this.hasDialogues || this.isLastDialogue) {
        this.handleEndOfDialogues();
        return;
      }

      this.currentDialogueIndex++;
      this.flags = applyDialogueEnergyChange(this.flags, this.currentDialogue);

      this.saveGame();
    },

    handleEndOfDialogues() {
      const scene = this.currentScene;
      if (!scene) return;

      if (this.hasChoices) {
        this.selectedChoice = null;
        this.setShowChoices(true);
        return;
      }

      if (scene.nextSceneId) {
        this.goToScene(scene.nextSceneId);
        return;
      }

      this.goToNextScene();
    },

    selectChoice(choice: Choice) {
      this.selectedChoice = choice;
      this.setShowChoices(false);

      this.flags = applyChoiceEffects(this.flags, choice.effects);

      this.saveGame();

      if (choice.nextSceneId) {
        this.goToScene(choice.nextSceneId);
      } else {
        this.goToNextScene();
      }
    },

    goToScene(sceneId: string) {
      if (this.isTransitioning) return;

      const scene = gameData.scenes[sceneId];
      if (!scene) {
        console.error(`Scene not found: ${sceneId}`);
        return;
      }

      this.isTransitioning = true;

      setTimeout(() => {
        if (scene.entryAnnotation) {
          this.selectedChoice = null;
          this.introAnimationPhase = getEntryAnnotationPhase(this.introPlayed);

          this._annotationTimerId = clearScheduledTimer(this._annotationTimerId);

          this._annotationTimerId = scheduleTimer(() => {
            if (shouldAutoCompleteAnnotation(this.introAnimationPhase)) {
              this.introAnimationPhase = "complete";
            }
            this._annotationTimerId = null;
          }, 3000);
        }

        this.currentSceneId = sceneId;
        this.currentDialogueIndex = 0;

        this.flags = applyDialogueEnergyChange(this.flags, this.currentDialogue);

        this.setShowChoices(false);
        this.isTransitioning = false;
        this.saveGame();
      }, 300);
    },

    goToNextScene() {
      const nextStep = resolveNextProgressionStep({
        currentSceneId: this.currentSceneId,
        flags: this.flags,
        scenes: gameData.scenes,
        milestones: MILESTONES,
        milestoneOrder: MILESTONE_ORDER,
        getMilestoneForScene,
      });

      if (nextStep.type === "scene") {
        this.goToScene(nextStep.sceneId);
        return;
      }

      if (nextStep.type === "milestone") {
        this.goToMilestone(nextStep.milestoneId);
        return;
      }

      if (this.currentSceneId !== SCENE_IDS.GAME_END) {
        console.warn("No next scene found.");
      }
    },

    goToMilestone(milestoneId: string) {
      const milestone = MILESTONES[milestoneId];
      const isReached =
        this.reachedMilestones.includes(milestoneId) || import.meta.env.DEV;

      if (!milestone || !isReached) {
        return;
      }

      const sceneId = findFirstValidSceneIdInMilestone(
        milestoneId,
        MILESTONES,
        gameData.scenes,
        this.flags
      );

      if (sceneId) {
        this.introPlayed = true;
        this.introAnimationPhase = "complete";
        this.goToScene(sceneId);
        this.menuStatus = "closed";
      }
    },

    async toggleMenu() {
      if (this.menuStatus === "open") {
        this.closeMenu();
        return;
      }

      this.menuStatus = getToggleTargetMenuStatus(this.menuStatus);
    },

    openMenu() {
      this.menuStatus = getMenuOpenStatus();
      const audioStore = useAudioStore();
      audioStore.pauseAudio();
    },

    closeMenu() {
      this.menuStatus = getMenuClosingStatus();

      setTimeout(() => {
        this.menuStatus = finalizeClosingStatus(this.menuStatus);
      }, MENU_CLOSE_DELAY_MS);

      const audioStore = useAudioStore();
      audioStore.resumeAudio();
    },

    toggleForceShowUI() {
      this.forceShowUI = !this.forceShowUI;
    },
  },
});
