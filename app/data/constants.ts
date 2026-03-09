export const SCENE_IDS = {
  // Day 1
  DAY_ONE_WAKEUP: 'dayOneWakeup',
  DAY_ONE_BATHROOM: 'dayOneBathroom',
  DAY_ONE_OUTFIT_SEXY: 'dayOneOutfitSexy',
  DAY_ONE_OUTFIT_COMFORT: 'dayOneOutfitComfort',
  DAY_ONE_METRO_SEXY: 'dayOneMetroSexy',
  DAY_ONE_METRO_COMFORT: 'dayOneMetroComfort',
  DAY_ONE_OFFICE: 'dayOneOffice',
  DAY_ONE_CONFLICT_SUBMIT: 'dayOneConflictSubmit',
  DAY_ONE_CONFLICT_ASSERT: 'dayOneConflictAssert',
  DAY_ONE_PARTY_SEXY: 'dayOnePartySexy',
  DAY_ONE_PARTY_COMFORT: 'dayOnePartyComfort',
  DAY_ONE_GAME_EVENT: 'dayOneGameEvent',
  DAY_ONE_PLAY: 'dayOnePlay',
  DAY_ONE_REFUSE: 'dayOneRefuse',
  DAY_ONE_REFUSE_SUBMIT: 'dayOneRefuseSubmit',
  DAY_ONE_REFUSE_ASSERT: 'dayOneRefuseAssert',
  DAY_ONE_END_CRASH: 'dayOneEndCrash',
  DAY_ONE_END_GOOD_REFLECT: 'dayOneEndGoodReflect',

  DAY_ONE_END_GOOD_ASSERT_SEXY: 'dayOneEndGoodAssertSexy',
  DAY_ONE_END_GOOD_ASSERT_COMFORT: 'dayOneEndGoodAssertComfort',

  // Day 2

  DAY_TWO_WAKEUP_CRASH: 'dayTwoWakeupCrash',
  DAY_TWO_WAKEUP_GOOD: 'dayTwoWakeupGood',
  DAY_TWO_ACCEPT: 'dayTwoAccept',
  DAY_TWO_REFUSE: 'dayTwoRefuse',
  DAY_TWO_MOVING: 'dayTwoMoving',
  DAY_TWO_MOUNTAIN: 'dayTwoMountain',
} as const

export type SceneId = (typeof SCENE_IDS)[keyof typeof SCENE_IDS]
