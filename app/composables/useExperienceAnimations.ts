import { eyePaths } from "~/app/constants/eyePaths";
import { useEyeAnimations } from "./animations/useEyeAnimations";
import { useIntroSequence } from "./animations/useIntroSequence";

export const useExperienceAnimations = () => {
  const isDayTransition = ref(false);

  const {
    eyePath,
    playCloseEyeAnimation,
    playOpenEyeAnimation,
  } = useEyeAnimations();

  const {
    gradientState,
    setupIntroSequence,
  } = useIntroSequence(eyePath);

  return {
    eyePath,
    eyePaths,
    gradientState,
    isDayTransition,
    playCloseEyeAnimation,
    playOpenEyeAnimation,
    setupIntroSequence,
  };
};
