import type {
  ChoiceEffects,
  DialogueLine,
  GameFlags,
} from "../../app/types/game";

export const clampEnergy = (energy: number): number =>
  Math.max(0, Math.min(100, energy));

export const applyDialogueEnergyChange = (
  flags: GameFlags,
  dialogue: DialogueLine | null | undefined
): GameFlags => {
  if (!dialogue?.energyChange) {
    return flags;
  }

  return {
    ...flags,
    energy: clampEnergy(flags.energy + dialogue.energyChange),
  };
};

export const applyChoiceEffects = (
  flags: GameFlags,
  effects: ChoiceEffects | undefined
): GameFlags => {
  if (!effects) {
    return flags;
  }

  let nextFlags = flags;

  if (effects.energy) {
    nextFlags = {
      ...nextFlags,
      energy: clampEnergy(nextFlags.energy + effects.energy),
    };
  }

  if (effects.flags) {
    nextFlags = {
      ...nextFlags,
      ...effects.flags,
    };
  }

  return nextFlags;
};
