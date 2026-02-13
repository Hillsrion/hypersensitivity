import { SCENE_IDS } from "./constants";

export interface MilestoneDef {
  id: string;
  label: string;
  day: 1 | 2;
  scenes: string[];
  entrySceneId: string;
}

export const MILESTONES: Record<string, MilestoneDef> = {
  reveil: {
    id: "reveil",
    label: "Réveil",
    day: 1,
    scenes: [
      SCENE_IDS.DAY_ONE_WAKEUP,
      SCENE_IDS.DAY_ONE_BATHROOM,
      SCENE_IDS.DAY_ONE_OUTFIT_SEXY,
      SCENE_IDS.DAY_ONE_OUTFIT_COMFORT,
    ],
    entrySceneId: SCENE_IDS.DAY_ONE_WAKEUP,
  },
  trajet: {
    id: "trajet",
    label: "Trajet",
    day: 1,
    scenes: [
      SCENE_IDS.DAY_ONE_METRO_SEXY,
      SCENE_IDS.DAY_ONE_METRO_COMFORT,
    ],
    entrySceneId: SCENE_IDS.DAY_ONE_METRO_ROUTING,
  },
  bureau: {
    id: "bureau",
    label: "Bureau",
    day: 1,
    scenes: [
      SCENE_IDS.DAY_ONE_OFFICE,
      SCENE_IDS.DAY_ONE_CONFLICT_SUBMIT,
      SCENE_IDS.DAY_ONE_CONFLICT_ASSERT,
    ],
    entrySceneId: SCENE_IDS.DAY_ONE_OFFICE,
  },
  soiree: {
    id: "soiree",
    label: "Soirée",
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
    entrySceneId: SCENE_IDS.DAY_ONE_PARTY_ROUTING,
  },
  retour: {
    id: "retour",
    label: "Retour",
    day: 1,
    scenes: [
      SCENE_IDS.DAY_ONE_END_CRASH,
      SCENE_IDS.DAY_ONE_END_GOOD_ASSERT, // This one is a routing scene but might be currentSceneId briefly
      SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_SEXY,
      SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_COMFORT,
      SCENE_IDS.DAY_ONE_END_GOOD_REFLECT,
    ],
    entrySceneId: SCENE_IDS.DAY_ONE_END_ROUTING,
  },
  reveil2: {
    id: "reveil2",
    label: "Réveil",
    day: 2,
    scenes: [
      SCENE_IDS.DAY_TWO_WAKEUP, // Routing scene
      SCENE_IDS.DAY_TWO_WAKEUP_CRASH,
      SCENE_IDS.DAY_TWO_WAKEUP_GOOD,
      SCENE_IDS.DAY_TWO_CALL,
      SCENE_IDS.DAY_TWO_ACCEPT,
      SCENE_IDS.DAY_TWO_REFUSE,
    ],
    entrySceneId: SCENE_IDS.DAY_TWO_WAKEUP,
  },
  demenagement: {
    id: "demenagement",
    label: "Déménagement",
    day: 2,
    scenes: [
      SCENE_IDS.DAY_TWO_MOVING,
    ],
    entrySceneId: SCENE_IDS.DAY_TWO_MOVING,
  },
  montagne: {
    id: "montagne",
    label: "Montagne",
    day: 2,
    scenes: [
      SCENE_IDS.DAY_TWO_MOUNTAIN,
    ],
    entrySceneId: SCENE_IDS.DAY_TWO_MOUNTAIN,
  },
};

export const getMilestoneForScene = (sceneId: string): MilestoneDef | undefined => {
  return Object.values(MILESTONES).find((m) => m.scenes.includes(sceneId));
};
