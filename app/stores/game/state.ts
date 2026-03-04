import { gameData } from '../../data/game'
import type { GameFlags, GameState } from '../../types/game'
import {
  DEFAULT_REACHED_MILESTONES,
  ensureInitialMilestone,
} from './milestones'

export const STORAGE_KEY = 'hypersensitivity-game-state'

export const createInitialFlags = (): GameFlags => ({
  ...gameData.initialFlags,
})

export { DEFAULT_REACHED_MILESTONES, ensureInitialMilestone }

export const createInitialGameState = (): GameState => ({
  currentSceneId: gameData.initialSceneId,
  currentDialogueIndex: 0,
  flags: createInitialFlags(),
  reachedMilestones: [...DEFAULT_REACHED_MILESTONES],
  isTransitioning: false,
  showChoices: false,
  menuStatus: 'closed',
  introPlayed: false,
  introAnimationPhase:
    'hidden' as import('../../types/game').IntroAnimationPhase,
  introBlurAmount: 8,
  isAutoScrolling: false,
  selectedChoice: null,
  showQuiz: false,
  showFinalFooter: false,
  forceShowUI: false,
  isDayTransitioning: false,
  pendingTransitionSceneId: null,
  _annotationTimerId: null,
  hasGameEnded: false,
})
