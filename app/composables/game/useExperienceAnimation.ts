import { eyePaths } from "~/app/constants/eyePaths";
import { useEyeAnimation } from "./useEyeAnimation";
import { useIntroSequenceAnimation } from "./useIntroSequenceAnimation";

export const useExperienceAnimation = () => {
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
    playCloseEyeAnimation,
    playOpenEyeAnimation,
    setupIntroSequence,
  };
};
