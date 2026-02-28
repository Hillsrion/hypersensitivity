import { SCENE_IDS } from '../../data/constants.ts'
import type {
  GameFlags,
  GameState,
  MenuStatus,
  PersistedGameState,
} from '../../types/game'
import { ensureInitialMilestone } from './milestones.ts'

const PERSISTED_STATE_VERSION = 1 as const

const DEFAULT_FLAGS: GameFlags = {
  outfitChoice: null,
  conflictOutcome: null,
  gameEventChoice: null,
  hadBreakdown: false,
  callChoice: null,
  energy: 100,
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value)

const isMenuStatus = (value: unknown): value is MenuStatus =>
  value === 'closed' ||
  value === 'opening' ||
  value === 'open' ||
  value === 'closing'

const normalizeFlags = (value: unknown): GameFlags => {
  if (!isObjectRecord(value)) {
    return { ...DEFAULT_FLAGS }
  }

  return {
    outfitChoice:
      value.outfitChoice === 'sexy' || value.outfitChoice === 'comfort'
        ? value.outfitChoice
        : null,
    conflictOutcome:
      value.conflictOutcome === 'submit' || value.conflictOutcome === 'assert'
        ? value.conflictOutcome
        : null,
    gameEventChoice:
      value.gameEventChoice === 'play' || value.gameEventChoice === 'refuse'
        ? value.gameEventChoice
        : null,
    hadBreakdown:
      typeof value.hadBreakdown === 'boolean'
        ? value.hadBreakdown
        : DEFAULT_FLAGS.hadBreakdown,
    callChoice:
      value.callChoice === 'accept' || value.callChoice === 'refuse'
        ? value.callChoice
        : null,
    energy:
      typeof value.energy === 'number'
        ? Math.max(0, Math.min(100, value.energy))
        : DEFAULT_FLAGS.energy,
  }
}

export const toPersistedGameState = (
  state: Pick<
    GameState,
    | 'currentSceneId'
    | 'currentDialogueIndex'
    | 'flags'
    | 'reachedMilestones'
    | 'introPlayed'
    | 'menuStatus'
    | 'showQuiz'
    | 'forceShowUI'
  >
): PersistedGameState => ({
  version: PERSISTED_STATE_VERSION,
  currentSceneId: state.currentSceneId,
  currentDialogueIndex: state.currentDialogueIndex,
  flags: { ...state.flags },
  reachedMilestones: ensureInitialMilestone(state.reachedMilestones),
  introPlayed: state.introPlayed,
  menuStatus: state.menuStatus,
  showQuiz: state.showQuiz,
  forceShowUI: state.forceShowUI,
})

export const normalizePersistedSnapshot = (
  input: unknown
): PersistedGameState | null => {
  if (!isObjectRecord(input)) {
    return null
  }

  const currentSceneId =
    typeof input.currentSceneId === 'string'
      ? input.currentSceneId
      : SCENE_IDS.DAY_ONE_WAKEUP

  const currentDialogueIndex =
    typeof input.currentDialogueIndex === 'number' &&
    input.currentDialogueIndex >= 0
      ? Math.floor(input.currentDialogueIndex)
      : 0

  const flags = normalizeFlags(input.flags)
  const reachedMilestones = ensureInitialMilestone(
    Array.isArray(input.reachedMilestones)
      ? input.reachedMilestones.filter(
          (milestoneId): milestoneId is string =>
            typeof milestoneId === 'string'
        )
      : undefined
  )

  return {
    version: PERSISTED_STATE_VERSION,
    currentSceneId,
    currentDialogueIndex,
    flags,
    reachedMilestones,
    introPlayed:
      typeof input.introPlayed === 'boolean' ? input.introPlayed : false,
    menuStatus: isMenuStatus(input.menuStatus) ? input.menuStatus : 'closed',
    showQuiz: typeof input.showQuiz === 'boolean' ? input.showQuiz : false,
    forceShowUI:
      typeof input.forceShowUI === 'boolean' ? input.forceShowUI : false,
  }
}

export const loadSnapshot = (
  storageKey: string,
  storage: Pick<Storage, 'getItem'> | null = import.meta.client
    ? window.localStorage
    : null
): PersistedGameState | null => {
  if (!storage) {
    return null
  }

  const raw = storage.getItem(storageKey)
  if (!raw) {
    return null
  }

  const parsed = JSON.parse(raw) as unknown
  return normalizePersistedSnapshot(parsed)
}

export const saveSnapshot = (
  storageKey: string,
  state: Pick<
    GameState,
    | 'currentSceneId'
    | 'currentDialogueIndex'
    | 'flags'
    | 'reachedMilestones'
    | 'introPlayed'
    | 'menuStatus'
    | 'showQuiz'
    | 'forceShowUI'
  >,
  storage: Pick<Storage, 'setItem'> | null = import.meta.client
    ? window.localStorage
    : null
): void => {
  if (!storage) {
    return
  }

  storage.setItem(storageKey, JSON.stringify(toPersistedGameState(state)))
}
