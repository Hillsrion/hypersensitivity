import type { GameData } from "../types/game";
import { SCENE_IDS } from "./constants";
import { dayOneWakeup, dayOneBathroom, dayOneOutfitSexy, dayOneOutfitComfort, dayOneMetroSexy, dayOneMetroComfort, dayOneOffice, dayOneConflictSubmit, dayOneConflictAssert, dayOnePartySexy, dayOnePartyComfort, dayOneGameEvent, dayOnePlay, dayOneRefuse, dayOneRefuseSubmit, dayOneRefuseAssert, dayOneEndCrash, dayOneEndGoodAssertSexy, dayOneEndGoodAssertComfort, dayOneEndGoodReflect } from "./scenes/day1";
import { dayTwoWakeupCrash, dayTwoWakeupGood, dayTwoCall, dayTwoAccept, dayTwoRefuse, dayTwoMountain, dayTwoMoving, dayTwoSunset, gameEnd } from "./scenes/day2";
import { dayOneEndGoodAssert, dayTwoWakeup, dayOneMetroRouting, dayOnePartyRouting, dayOneEndRouting } from "./scenes/routing";

// ============================================
// EXPORT
// ============================================

export const gameData: GameData = {
  initialSceneId: SCENE_IDS.DAY_ONE_WAKEUP,
  initialFlags: {
    outfitChoice: null,
    conflictOutcome: null,
    gameEventChoice: null,
    hadBreakdown: false,
    energy: 100,
  },
  scenes: {
    // Routing
    [SCENE_IDS.DAY_ONE_METRO_ROUTING]: dayOneMetroRouting,
    [SCENE_IDS.DAY_ONE_PARTY_ROUTING]: dayOnePartyRouting,
    [SCENE_IDS.DAY_ONE_END_ROUTING]: dayOneEndRouting,
    [SCENE_IDS.DAY_ONE_END_GOOD_ASSERT]: dayOneEndGoodAssert,
    [SCENE_IDS.DAY_TWO_WAKEUP]: dayTwoWakeup,

    // Day 1
    [SCENE_IDS.DAY_ONE_WAKEUP]: dayOneWakeup,
    [SCENE_IDS.DAY_ONE_BATHROOM]: dayOneBathroom,
    [SCENE_IDS.DAY_ONE_OUTFIT_SEXY]: dayOneOutfitSexy,
    [SCENE_IDS.DAY_ONE_OUTFIT_COMFORT]: dayOneOutfitComfort,
    [SCENE_IDS.DAY_ONE_METRO_SEXY]: dayOneMetroSexy,
    [SCENE_IDS.DAY_ONE_METRO_COMFORT]: dayOneMetroComfort,
    [SCENE_IDS.DAY_ONE_OFFICE]: dayOneOffice,
    [SCENE_IDS.DAY_ONE_CONFLICT_SUBMIT]: dayOneConflictSubmit,
    [SCENE_IDS.DAY_ONE_CONFLICT_ASSERT]: dayOneConflictAssert,
    [SCENE_IDS.DAY_ONE_PARTY_SEXY]: dayOnePartySexy,
    [SCENE_IDS.DAY_ONE_PARTY_COMFORT]: dayOnePartyComfort,
    [SCENE_IDS.DAY_ONE_GAME_EVENT]: dayOneGameEvent,
    [SCENE_IDS.DAY_ONE_PLAY]: dayOnePlay,
    [SCENE_IDS.DAY_ONE_REFUSE]: dayOneRefuse,
    [SCENE_IDS.DAY_ONE_REFUSE_SUBMIT]: dayOneRefuseSubmit,
    [SCENE_IDS.DAY_ONE_REFUSE_ASSERT]: dayOneRefuseAssert,
    [SCENE_IDS.DAY_ONE_END_CRASH]: dayOneEndCrash,
    [SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_SEXY]: dayOneEndGoodAssertSexy,
    [SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_COMFORT]: dayOneEndGoodAssertComfort,
    [SCENE_IDS.DAY_ONE_END_GOOD_REFLECT]: dayOneEndGoodReflect,

    // Day 2
    [SCENE_IDS.DAY_TWO_WAKEUP_CRASH]: dayTwoWakeupCrash,
    [SCENE_IDS.DAY_TWO_WAKEUP_GOOD]: dayTwoWakeupGood,
    [SCENE_IDS.DAY_TWO_CALL]: dayTwoCall,
    [SCENE_IDS.DAY_TWO_ACCEPT]: dayTwoAccept,
    [SCENE_IDS.DAY_TWO_REFUSE]: dayTwoRefuse,
    [SCENE_IDS.DAY_TWO_MOUNTAIN]: dayTwoMountain,
    [SCENE_IDS.DAY_TWO_MOVING]: dayTwoMoving,
    [SCENE_IDS.DAY_TWO_SUNSET]: dayTwoSunset,
    [SCENE_IDS.GAME_END]: gameEnd,
  },
};

console.log("LOG_DEBUG: gameData initialized. Scenes count:", Object.keys(gameData.scenes).length);
console.log("LOG_DEBUG: Initial scene check:", !!gameData.scenes[gameData.initialSceneId]);
