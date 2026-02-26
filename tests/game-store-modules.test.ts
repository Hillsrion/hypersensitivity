/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest'

import {
  evaluateCondition,
  isSceneEligible,
} from '../app/stores/game/conditions'
import {
  applyChoiceEffects,
  applyDialogueEnergyChange,
  clampEnergy,
} from '../app/stores/game/effects'
import {
  computeAnnotationDelayMs,
  getEntryAnnotationPhase,
} from '../app/stores/game/intro'
import {
  finalizeClosingStatus,
  getToggleTargetMenuStatus,
} from '../app/stores/game/menu'
import {
  loadSnapshot,
  normalizePersistedSnapshot,
  saveSnapshot,
  toPersistedGameState,
} from '../app/stores/game/persistence'
import {
  findFirstValidSceneIdInMilestone,
  resolveNextProgressionStep,
} from '../app/stores/game/progression'

const baseFlags = {
  outfitChoice: null,
  conflictOutcome: null,
  gameEventChoice: null,
  hadBreakdown: false,
  callChoice: null,
  refuseOutcome: null,
  energy: 50,
}

describe('game-store-modules', () => {
  it('evaluateCondition handles all operators', () => {
    const flags = { ...baseFlags, energy: 42, outfitChoice: 'comfort' }

    expect(
      evaluateCondition(
        { flag: 'outfitChoice', operator: 'equals', value: 'comfort' },
        flags
      )
    ).toBe(true)
    expect(
      evaluateCondition(
        { flag: 'outfitChoice', operator: 'notEquals', value: 'sexy' },
        flags
      )
    ).toBe(true)
    expect(
      evaluateCondition(
        { flag: 'energy', operator: 'greaterThan', value: 30 },
        flags
      )
    ).toBe(true)
    expect(
      evaluateCondition(
        { flag: 'energy', operator: 'lessThan', value: 30 },
        flags
      )
    ).toBe(false)
  })

  it('isSceneEligible supports condition and conditions', () => {
    const sceneA = {
      condition: { flag: 'outfitChoice', operator: 'equals', value: 'sexy' },
    }
    const sceneB = {
      conditions: [
        { flag: 'energy', operator: 'greaterThan', value: 10 },
        { flag: 'energy', operator: 'lessThan', value: 90 },
      ],
    }

    expect(isSceneEligible(sceneA, baseFlags)).toBe(false)
    expect(isSceneEligible(sceneB, baseFlags)).toBe(true)
  })

  it('effects clamp and apply dialogue/choice changes', () => {
    expect(clampEnergy(120)).toBe(100)
    expect(clampEnergy(-5)).toBe(0)

    const afterDialogue = applyDialogueEnergyChange(baseFlags, {
      energyChange: -20,
    })
    expect(afterDialogue.energy).toBe(30)

    const afterChoice = applyChoiceEffects(baseFlags, {
      energy: 15,
      flags: { hadBreakdown: true, conflictOutcome: 'assert' },
    })

    expect(afterChoice.energy).toBe(65)
    expect(afterChoice.hadBreakdown).toBe(true)
    expect(afterChoice.conflictOutcome).toBe('assert')
  })

  it('progression finds next scene in milestone', () => {
    const scenes = {
      s1: { id: 's1', day: 1, title: 'A', dialogues: [] },
      s2: {
        id: 's2',
        day: 1,
        title: 'B',
        dialogues: [],
        condition: { flag: 'energy', operator: 'greaterThan', value: 20 },
      },
      s3: {
        id: 's3',
        day: 1,
        title: 'C',
        dialogues: [],
        condition: { flag: 'energy', operator: 'greaterThan', value: 90 },
      },
      s4: { id: 's4', day: 1, title: 'D', dialogues: [] },
    }

    const milestones = {
      m1: { id: 'm1', label: 'M1', day: 1, scenes: ['s1', 's2', 's3'] },
      m2: { id: 'm2', label: 'M2', day: 1, scenes: ['s4'] },
    }

    const getMilestoneForScene = (sceneId) =>
      Object.values(milestones).find((m) => m.scenes.includes(sceneId))

    const next = resolveNextProgressionStep({
      currentSceneId: 's1',
      flags: baseFlags,
      scenes,
      milestones,
      milestoneOrder: ['m1', 'm2'],
      getMilestoneForScene,
    })

    expect(next).toEqual({ type: 'scene', sceneId: 's2' })
  })

  it('progression falls back to next milestone', () => {
    const scenes = {
      s1: { id: 's1', day: 1, title: 'A', dialogues: [] },
      s2: {
        id: 's2',
        day: 1,
        title: 'B',
        dialogues: [],
        condition: { flag: 'energy', operator: 'greaterThan', value: 80 },
      },
      s3: { id: 's3', day: 1, title: 'C', dialogues: [] },
    }

    const milestones = {
      m1: { id: 'm1', label: 'M1', day: 1, scenes: ['s1', 's2'] },
      m2: { id: 'm2', label: 'M2', day: 1, scenes: ['s3'] },
    }

    const getMilestoneForScene = (sceneId) =>
      Object.values(milestones).find((m) => m.scenes.includes(sceneId))

    const next = resolveNextProgressionStep({
      currentSceneId: 's1',
      flags: baseFlags,
      scenes,
      milestones,
      milestoneOrder: ['m1', 'm2'],
      getMilestoneForScene,
    })

    expect(next).toEqual({ type: 'milestone', milestoneId: 'm2' })
  })

  it('findFirstValidSceneIdInMilestone returns first eligible scene', () => {
    const scenes = {
      a: {
        id: 'a',
        day: 1,
        title: 'A',
        dialogues: [],
        condition: { flag: 'energy', operator: 'greaterThan', value: 80 },
      },
      b: { id: 'b', day: 1, title: 'B', dialogues: [] },
    }

    const milestones = {
      m: { id: 'm', label: 'M', day: 1, scenes: ['a', 'b'] },
    }

    expect(
      findFirstValidSceneIdInMilestone('m', milestones, scenes, baseFlags)
    ).toBe('b')
  })

  it('menu state helpers keep expected transitions', () => {
    expect(getToggleTargetMenuStatus('open')).toBe('closing')
    expect(getToggleTargetMenuStatus('closed')).toBe('opening')
    expect(finalizeClosingStatus('closing')).toBe('closed')
    expect(finalizeClosingStatus('open')).toBe('open')
  })

  it('intro helpers compute stable phase and delays', () => {
    expect(getEntryAnnotationPhase(true)).toBe('milestoneAnnotation')
    expect(getEntryAnnotationPhase(false)).toBe('annotation')
    expect(computeAnnotationDelayMs(undefined)).toBe(2500)
    expect(computeAnnotationDelayMs(0.1)).toBe(1000)
  })

  it('persistence serializes only whitelisted data', () => {
    const persisted = toPersistedGameState({
      currentSceneId: 'sceneA',
      currentDialogueIndex: 3,
      flags: baseFlags,
      reachedMilestones: ['reveil', 'bureau'],
      introPlayed: true,
      menuStatus: 'closed',
      showQuestionnaire: false,
      forceShowUI: false,
    })

    expect(persisted.version).toBe(1)
    expect(persisted.reachedMilestones).toEqual(['reveil', 'bureau'])
    expect(
      Object.prototype.hasOwnProperty.call(persisted, '_annotationTimerId')
    ).toBe(false)
  })

  it('persistence normalization is robust', () => {
    const normalized = normalizePersistedSnapshot({
      currentSceneId: 42 as any,
      currentDialogueIndex: -1,
      flags: { energy: 250, callChoice: 'accept' } as any,
      reachedMilestones: ['trajet'],
      menuStatus: 'invalid' as any,
    })

    expect(normalized.currentDialogueIndex).toBe(0)
    expect(normalized.flags.energy).toBe(100)
    expect(normalized.flags.callChoice).toBe('accept')
    expect(normalized.reachedMilestones).toEqual(['reveil', 'trajet'])
    expect(normalized.menuStatus).toBe('closed')
  })

  it('saveSnapshot/loadSnapshot roundtrip with injected storage', () => {
    const backing = new Map()
    const storage = {
      setItem: (key, value) => backing.set(key, value),
      getItem: (key) => backing.get(key) ?? null,
    } as any

    saveSnapshot(
      'game-key',
      {
        currentSceneId: 'sceneA',
        currentDialogueIndex: 1,
        flags: baseFlags,
        reachedMilestones: ['reveil'],
        introPlayed: false,
        menuStatus: 'closed',
        showQuestionnaire: false,
        forceShowUI: false,
      },
      storage
    )

    const loaded = loadSnapshot('game-key', storage)
    expect(loaded.currentSceneId).toBe('sceneA')
    expect(loaded.currentDialogueIndex).toBe(1)
    expect(loaded.reachedMilestones).toEqual(['reveil'])
  })

  it('loadSnapshot throws on invalid JSON', () => {
    const storage = {
      getItem: () => '{invalid-json',
    } as any

    expect(() => loadSnapshot('game-key', storage)).toThrow()
  })
})
