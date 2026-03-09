import { SCENE_IDS } from './constants'

export type MilestoneDef = {
  id: string
  label: string
  day: 1 | 2
  scenes: string[]
}

export const MILESTONE_ORDER = [
  'reveil',
  'trajet',
  'bureau',
  'soiree',
  'retour',
  'reveil2',
  'demenagement',
  'montagne',
]

export const MILESTONES: Record<string, MilestoneDef> = {
  reveil: {
    id: 'reveil',
    label: 'Réveil',
    day: 1,
    scenes: [
      SCENE_IDS.DAY_ONE_WAKEUP,
      SCENE_IDS.DAY_ONE_BATHROOM,
      SCENE_IDS.DAY_ONE_OUTFIT_SEXY,
      SCENE_IDS.DAY_ONE_OUTFIT_COMFORT,
    ],
  },
  trajet: {
    id: 'trajet',
    label: 'Trajet',
    day: 1,
    scenes: [SCENE_IDS.DAY_ONE_METRO_SEXY, SCENE_IDS.DAY_ONE_METRO_COMFORT],
  },
  bureau: {
    id: 'bureau',
    label: 'Bureau',
    day: 1,
    scenes: [
      SCENE_IDS.DAY_ONE_OFFICE,
      SCENE_IDS.DAY_ONE_CONFLICT_SUBMIT,
      SCENE_IDS.DAY_ONE_CONFLICT_ASSERT,
    ],
  },
  soiree: {
    id: 'soiree',
    label: 'Soirée',
    day: 1,
    scenes: [
      SCENE_IDS.DAY_ONE_PARTY_SEXY,
      SCENE_IDS.DAY_ONE_PARTY_COMFORT,
      SCENE_IDS.DAY_ONE_GAME_EVENT,
      SCENE_IDS.DAY_ONE_PLAY,
      SCENE_IDS.DAY_ONE_REFUSE,
      SCENE_IDS.DAY_ONE_REFUSE_SUBMIT,
      SCENE_IDS.DAY_ONE_REFUSE_ASSERT,
    ],
  },
  retour: {
    id: 'retour',
    label: 'Retour',
    day: 1,
    scenes: [
      SCENE_IDS.DAY_ONE_END_CRASH,
      SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_SEXY,
      SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_COMFORT,
      SCENE_IDS.DAY_ONE_END_GOOD_REFLECT,
    ],
  },
  reveil2: {
    id: 'reveil2',
    label: 'Réveil',
    day: 2,
    scenes: [
      SCENE_IDS.DAY_TWO_WAKEUP_CRASH,
      SCENE_IDS.DAY_TWO_WAKEUP_GOOD,
      SCENE_IDS.DAY_TWO_ACCEPT,
      SCENE_IDS.DAY_TWO_REFUSE,
    ],
  },
  demenagement: {
    id: 'demenagement',
    label: 'Déménagement',
    day: 2,
    scenes: [SCENE_IDS.DAY_TWO_MOVING],
  },
  montagne: {
    id: 'montagne',
    label: 'Montagne',
    day: 2,
    scenes: [SCENE_IDS.DAY_TWO_MOUNTAIN],
  },
}

export const getMilestoneForScene = (
  sceneId: string
): MilestoneDef | undefined => {
  return Object.values(MILESTONES).find((m) => m.scenes.includes(sceneId))
}
