export const devConfig = {
  enabled: import.meta.env.VITE_DEV_ENABLED !== 'false', // Enable by default for now, can be toggled
  resumeFromSnapshot: import.meta.env.VITE_RESUME_FROM_SNAPSHOT === 'true', // Default to false
  initialSceneId: import.meta.env.VITE_INITIAL_SCENE_ID || '', // Set to a string like 'dayOnePartySexy' to override
  initialFlags: {
    energy:
      import.meta.env.VITE_INITIAL_ENERGY !== undefined &&
      import.meta.env.VITE_INITIAL_ENERGY !== ''
        ? Number(import.meta.env.VITE_INITIAL_ENERGY)
        : 100,
    outfitChoice: import.meta.env.VITE_INITIAL_OUTFIT || 'sexy',
    conflictOutcome: import.meta.env.VITE_CONFLICT_OUTCOME || 'refuse',
    hadBreakdown: import.meta.env.VITE_INITIAL_HAD_BREAKDOWN ?? false,
  },
  playbackRate: import.meta.env.VITE_PLAYBACK_RATE
    ? Number(import.meta.env.VITE_PLAYBACK_RATE)
    : 1, // 1.5x speed
}
