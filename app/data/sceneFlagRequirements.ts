import type { GameFlags } from "../types/game";
import { SCENE_IDS } from "./constants";

/**
 * Static map of sceneId → the minimum flags required to reach that scene logically.
 *
 * Rules:
 * - Scenes with no condition (reachable from multiple paths) are NOT listed here.
 *   For those, we fall back to sensible canonical defaults (see CANONICAL_DEFAULT_FLAGS).
 * - When a scene has `conditions` with a `notEquals`, we resolve to the opposite
 *   sensible value (e.g., conflictOutcome ≠ "assert" → "submit").
 */
const SCENE_FLAG_REQUIREMENTS: Partial<Record<string, Partial<GameFlags>>> = {
  // Wakeup branches
  [SCENE_IDS.DAY_ONE_OUTFIT_SEXY]: { outfitChoice: "sexy" },
  [SCENE_IDS.DAY_ONE_OUTFIT_COMFORT]: { outfitChoice: "comfort" },

  // Metro branches — conditioned on outfit
  [SCENE_IDS.DAY_ONE_METRO_SEXY]: { outfitChoice: "sexy" },
  [SCENE_IDS.DAY_ONE_METRO_COMFORT]: { outfitChoice: "comfort" },

  // Office conflict branches
  [SCENE_IDS.DAY_ONE_CONFLICT_SUBMIT]: { conflictOutcome: "submit" },
  [SCENE_IDS.DAY_ONE_CONFLICT_ASSERT]: { conflictOutcome: "assert" },

  // Party arrival — conditioned on outfit
  [SCENE_IDS.DAY_ONE_PARTY_SEXY]: { outfitChoice: "sexy" },
  [SCENE_IDS.DAY_ONE_PARTY_COMFORT]: { outfitChoice: "comfort" },

  // Game event: "play" sets hadBreakdown=true (it leads to the breakdown scene)
  [SCENE_IDS.DAY_ONE_PLAY]: { gameEventChoice: "play", hadBreakdown: true },

  // Refuse branches
  [SCENE_IDS.DAY_ONE_REFUSE_ASSERT]: {
    gameEventChoice: "refuse",
    refuseOutcome: "assert",
  },
  [SCENE_IDS.DAY_ONE_REFUSE_SUBMIT]: {
    gameEventChoice: "refuse",
    refuseOutcome: "submit",
  },

  // End of Day 1 — crash (hadBreakdown=true means they played and broke down)
  [SCENE_IDS.DAY_ONE_END_CRASH]: { hadBreakdown: true },

  // End of Day 1 — good endings (conditions: hadBreakdown=false + outfit/conflict)
  [SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_SEXY]: {
    hadBreakdown: false,
    outfitChoice: "sexy",
    conflictOutcome: "assert",
    gameEventChoice: "refuse",
  },
  [SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_COMFORT]: {
    hadBreakdown: false,
    outfitChoice: "comfort",
    conflictOutcome: "assert",
    gameEventChoice: "refuse",
  },
  // dayOneEndGoodReflect: hadBreakdown=false AND conflictOutcome != "assert"
  [SCENE_IDS.DAY_ONE_END_GOOD_REFLECT]: {
    hadBreakdown: false,
    conflictOutcome: "submit",
    gameEventChoice: "refuse",
  },

  // Day 2 wakeup — conditioned on hadBreakdown
  [SCENE_IDS.DAY_TWO_WAKEUP_CRASH]: { hadBreakdown: true },
  [SCENE_IDS.DAY_TWO_WAKEUP_GOOD]: { hadBreakdown: false },

  // Day 2 call branches — conditioned on callChoice
  [SCENE_IDS.DAY_TWO_ACCEPT]: { callChoice: "accept" },
  [SCENE_IDS.DAY_TWO_REFUSE]: { callChoice: "refuse" },

  // dayTwoMountain: callChoice = "refuse"
  [SCENE_IDS.DAY_TWO_MOUNTAIN]: { callChoice: "refuse" },
};

/**
 * Canonical defaults applied when jumping to unconstrained scenes
 * (scenes that are accessible from multiple paths).
 * These represent the most "common" narrative path.
 */
const CANONICAL_DEFAULT_FLAGS: Partial<GameFlags> = {
  outfitChoice: "sexy",
  conflictOutcome: "assert",
  gameEventChoice: "refuse",
  refuseOutcome: "assert",
  hadBreakdown: false,
  callChoice: "accept",
};

/**
 * Returns a complete GameFlags object with the minimum flags set to logically reach
 * the given scene. For scenes without specific requirements, canonical defaults are used.
 */
export function getFlagsForScene(
  sceneId: string,
  initialFlags: GameFlags
): GameFlags {
  const requirements = SCENE_FLAG_REQUIREMENTS[sceneId] ?? {};

  return {
    ...initialFlags,
    ...CANONICAL_DEFAULT_FLAGS,
    ...requirements,
  };
}
