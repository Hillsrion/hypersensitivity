import { useAnimationsStore } from "~/stores/animations";
import { eyePaths } from "~/app/constants/eyePaths";

export const useEyeAnimations = () => {
  const { $gsap } = useNuxtApp();
  const animationsStore = useAnimationsStore();
  const eyePath = ref<SVGPathElement | null>(null);

  const playCloseEyeAnimation = () => {
    return new Promise<void>((resolve) => {
      if (!eyePath.value) {
        resolve();
        return;
      }

      const tl = $gsap.timeline({
        onComplete: resolve,
      });
      const duration = 0.3;

      // Start from Open State (Scale 5, Step 4)
      tl.to(eyePath.value, {
        scale: 1,
        duration: duration * 3,
        ease: "power2.inOut",
      })
        .to(eyePath.value, {
          attr: { d: eyePaths.step3 },
          y: 1,
          duration: duration,
          ease: "power1.inOut",
        })
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step2 },
            y: 126.5,
            duration: duration,
            ease: "power1.inOut",
          },
          ">"
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step1 },
            y: 239.08,
            duration: duration,
            ease: "power1.inOut",
          },
          ">"
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.base },
            y: 299.74,
            duration: duration,
            ease: "power1.inOut",
          },
          ">"
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.closed },
            duration: duration,
            ease: "power1.inOut",
          },
          ">"
        )
        .call(() => {
          animationsStore.setCursorVariant("light");
          animationsStore.setAudiowaveVariant("light");
        });
    });
  };

  const playOpenEyeAnimation = () => {
    return new Promise<void>((resolve) => {
      if (!eyePath.value) {
        resolve();
        return;
      }

      const tl = $gsap.timeline({
        onComplete: resolve,
      });
      const duration = 0.3;

      tl.to(eyePath.value, {
        attr: { d: eyePaths.base },
        duration: duration,
        ease: "power1.inOut",
      })
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step1 },
            y: 239.08,
            duration: duration,
            ease: "power1.inOut",
          },
          ">"
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step2 },
            y: 126.5,
            duration: duration,
            ease: "power1.inOut",
          },
          ">"
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step3 },
            y: 1,
            duration: duration,
            ease: "power1.inOut",
          },
          ">"
        )
        .to(
          eyePath.value,
          {
            attr: { d: eyePaths.step4 },
            y: 1,
            scale: 5,
            duration: duration * 3,
            ease: "power1.inOut",
          },
          ">"
        )
        .call(() => {
          animationsStore.setCursorVariant("dark");
          animationsStore.setAudiowaveVariant("dark");
        });
    });
  };

  return {
    eyePath,
    playCloseEyeAnimation,
    playOpenEyeAnimation,
  };
};
