import { useGameStore } from "~/stores/game";
import { useAnimationsStore } from "~/stores/animations";
import { useAudioStore } from "~/stores/audio";
import { gradientSteps } from "~/app/constants/gradients";
import { eyePaths } from "~/app/constants/eyePaths";

export const useIntroSequence = (eyePathRef: Ref<SVGPathElement | null>) => {
  const { $gsap } = useNuxtApp();
  const gameStore = useGameStore();
  const animationsStore = useAnimationsStore();
  const audioStore = useAudioStore();

  const audioTriggered = ref(false);
  const gradientState = reactive({
    color1: "#ffffff",
    color2: "#ffffff",
    color3: "#ffffff",
    color4: "#ffffff",
    stop1: 0,
    stop2: 33,
    stop3: 66,
    stop4: 100,
  });

  const setupIntroSequence = (
    containerEl: HTMLElement,
    textContainerEl: HTMLElement,
    lineElements: HTMLCollection
  ) => {
    const mainTl = $gsap.timeline({
      scrollTrigger: {
        trigger: containerEl,
        start: "top top",
        end: "+=700%",
        scrub: true,
      },
    });

    const scrollTriggerInstance = mainTl.scrollTrigger;

    const textTl = $gsap.timeline();

    Array.from(lineElements).forEach((lineEl) => {
      const lineWords = lineEl.querySelectorAll(".word");

      // Set initial state of words to 0.2 opacity
      $gsap.set(lineWords, { opacity: 0.2 });

      textTl.to(lineEl, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      textTl.to(lineWords, {
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });

      textTl.to(lineEl, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    });

    const totalDuration = textTl.duration();
    const stepDuration = totalDuration / gradientSteps.length;
    const gradientTl = $gsap.timeline();

    gradientSteps.forEach((step, index) => {
      gradientTl.to(gradientState, {
        ...step,
        duration: stepDuration,
        ease: "none",
      });

      // At step 6 (index 5), change text color to white
      if (index === 5) {
        gradientTl.to(
          lineElements,
          {
            color: "#ffffff",
            duration: stepDuration,
            ease: "none",
          },
          "<"
        );
      }
    });

    const eyeTl = $gsap.timeline();
    const eyeStepDuration = 0.3; // Reduced duration for eye animation

    // State for blur animation
    const blurState = { amount: 8 };

    // Set initial centered position for base path (ViewBox height 769, Base center 84.76)
    if (eyePathRef.value) {
      $gsap.set(eyePathRef.value, {
        y: 299.74,
        scale: 1,
        transformOrigin: "center center",
        transformBox: "fill-box",
      });
    }

    // Initialiser le blur (mais garder l'annotation cachée)
    gameStore.setIntroBlurAmount(8);

    eyeTl
      .call(() => {
        console.log("LOG_DEBUG: eyeTl started, setting phase to annotation");
        gameStore.setIntroAnimationPhase("annotation");
      })
      .to(eyePathRef.value, {
        attr: { d: eyePaths.base },
        duration: eyeStepDuration,
        ease: "power1.inOut",
      })
      .call(() => {
        // Lancer l'audio du premier dialogue maintenant car DialogueBox n'est pas encore monté
        const currentScene = gameStore.currentScene;
        const audioToPlay =
          currentScene?.audio || gameStore.currentDialogue?.audio;

        console.log("LOG_DEBUG: eyeTl mid call. Scene:", currentScene?.id, "Audio:", audioToPlay);

        if (audioToPlay) {
          const audioPath = audioToPlay.startsWith("/")
            ? audioToPlay
            : `/audios/${audioToPlay}`;
          audioStore.playAudio(audioPath);
          audioTriggered.value = true;
          console.log("LOG_DEBUG: audioTriggered set to true");
        }
      })
      .to(
        eyePathRef.value,
        {
          attr: { d: eyePaths.step1 },
          y: 239.08,
          duration: eyeStepDuration,
          ease: "power1.inOut",
        },
        "step1"
      )
      .to(
        blurState,
        {
          amount: 6,
          duration: eyeStepDuration,
          ease: "power1.inOut",
          onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
        },
        "step1"
      )
      .to(
        eyePathRef.value,
        {
          attr: { d: eyePaths.step2 },
          y: 126.5,
          duration: eyeStepDuration,
          ease: "power1.inOut",
        },
        "step2"
      )
      .to(
        blurState,
        {
          amount: 4,
          duration: eyeStepDuration,
          ease: "power1.inOut",
          onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
        },
        "step2"
      )
      .to(
        eyePathRef.value,
        {
          attr: { d: eyePaths.step3 },
          y: 1,
          duration: eyeStepDuration,
          ease: "power1.inOut",
        },
        "step3"
      )
      .to(
        blurState,
        {
          amount: 2,
          duration: eyeStepDuration,
          ease: "power1.inOut",
          onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
        },
        "step3"
      )
      .to({}, { duration: eyeStepDuration }) // Pause pour l'animation de l'annotation
      .to(eyePathRef.value, {
        attr: { d: eyePaths.step4 },
        y: 1,
        scale: 5,
        duration: eyeStepDuration * 3,
        ease: "power1.inOut",
      })
      .to(
        blurState,
        {
          amount: 0,
          duration: eyeStepDuration * 3,
          ease: "power1.inOut",
          onUpdate: () => gameStore.setIntroBlurAmount(blurState.amount),
        },
        "<"
      );

    mainTl.add(textTl, 0);
    mainTl.add(gradientTl, 0);
    mainTl.add(eyeTl, ">");

    // Callback to lock scroll when animation completes
    mainTl.eventCallback("onComplete", () => {
      animationsStore.setScrollLocked(true);
    });

    mainTl.eventCallback("onUpdate", () => {
      if (gameStore.introPlayed) return;
      const progress = mainTl.progress();
      
      if (progress > 0.82) {
        if (animationsStore.cursor.variant !== "dark") {
          animationsStore.setCursorVariant("dark");
          animationsStore.setAudiowaveVariant("dark");
        }
      } 
      else if (progress > 0.4) {
        if (animationsStore.cursor.variant !== "light") {
          animationsStore.setCursorVariant("light");
          animationsStore.setAudiowaveVariant("light");
        }
      } 
      else {
        if (animationsStore.cursor.variant !== "dark") {
          animationsStore.setCursorVariant("dark");
          animationsStore.setAudiowaveVariant("dark");
        }
      }
    });

    // Auto-scroll logic if user is too slow
    watch(
      () => audioStore.currentTime,
      (time) => {
        if (
          !audioTriggered.value ||
          gameStore.introPlayed ||
          gameStore.isAutoScrolling ||
          mainTl.progress() > 0.99
        )
          return;

        const firstDialogue = gameStore.currentScene?.dialogues[0];
        if (!firstDialogue) return;

        const firstWordStart = firstDialogue.timings?.[0]?.start;
        if (typeof firstWordStart !== "number") return;

        const scrollDuration = 1.5;
        if (time >= firstWordStart - (scrollDuration + 0.2)) {
          console.log("LOG_DEBUG: Auto-scrolling to bottom (user too slow)");
          gameStore.isAutoScrolling = true;

          $gsap.to(window, {
            scrollTo: {
              y: containerEl.offsetTop + 7 * window.innerHeight,
            },
            duration: scrollDuration,
            ease: "power2.inOut",
            onComplete: () => {
              gameStore.isAutoScrolling = false;
              gameStore.setIntroAnimationPhase("complete");
              gameStore.setIntroPlayed();
            },
          });
        }
      }
    );

    return scrollTriggerInstance;
  };

  return {
    gradientState,
    setupIntroSequence,
  };
};
