export const devConfig = {
  enabled: import.meta.env.VITE_DEV_ENABLED !== 'false', // Enable by default for now, can be toggled
  initialSceneId: import.meta.env.VITE_INITIAL_SCENE_ID || '', // Set to a string like 'dayOnePartySexy' to override
  initialFlags: {
    energy: import.meta.env.VITE_INITIAL_ENERGY
      ? Number(import.meta.env.VITE_INITIAL_ENERGY)
      : 100,
    outfitChoice: import.meta.env.VITE_INITIAL_OUTFIT || 'sexy',
  },
  playbackRate: import.meta.env.VITE_PLAYBACK_RATE
    ? Number(import.meta.env.VITE_PLAYBACK_RATE)
    : 1, // 1.5x speed
}
