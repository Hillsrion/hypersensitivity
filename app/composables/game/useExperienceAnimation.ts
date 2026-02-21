import { eyePaths } from "~/app/constants/eyePaths";
import { useEyeAnimation } from "./useEyeAnimation";
import { useIntroSequenceAnimation } from "./useIntroSequenceAnimation";

export const useExperienceAnimation = () => {
  const isDayTransition = ref(false);

  const {
    eyePath,
    playCloseEyeAnimation,
    playOpenEyeAnimation,
  } = useEyeAnimation();

  const {
    gradientState,
    setupIntroSequence,
  } = useIntroSequenceAnimation(eyePath);

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
