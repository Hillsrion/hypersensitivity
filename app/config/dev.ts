import { SCENE_IDS } from "../data/constants";

export const devConfig = {
  enabled: true, // Enable by default for now, can be toggled
  initialSceneId: "", // Set to a string like 'dayOnePartySexy' to override
  initialFlags: {
    energy: 100,
    outfitChoice: 'sexy',
  },
  playbackRate: 1, // 1.5x speed
};
