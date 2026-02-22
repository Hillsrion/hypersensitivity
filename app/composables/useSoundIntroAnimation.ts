export const useSoundIntroAnimation = (
  containerRef: Ref<HTMLElement | null>,
  wrapperRef: Ref<HTMLElement | null>,
  textRef: Ref<HTMLElement | null>,
  audioPath: Ref<string>
) => {
  const { $gsap } = useNuxtApp();
  const audioStore = useAudioStore();
  const animations = useAnimationsStore();
  const { animateToWhite } = useBackgroundGradient();

  const timings = computed(() => {
    return (
      audioStore.list.find((item) => item.path === audioPath.value)?.timings ?? []
    );
  });

  const split = useSplitText(textRef, {
    splitBy: "lines, words",
    onComplete: (instance: any) => {
      if (animations.skipIntro) {
        $gsap.set(wrapperRef.value, { opacity: 1, y: 0 });
        if (instance.lines) $gsap.set(instance.lines, { opacity: 1, y: 0 });
        if (instance.words) $gsap.set(instance.words, { opacity: 1 });
      } else {
        if (instance.words) {
          $gsap.set(instance.words, {
            opacity: 0.2,
          });
        }
      }
    },
  });

  const tl = $gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  tl.pause();

  onMounted(() => {
    const scrollTl = $gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "center center",
        end: "bottom top",
        scrub: true,
      },
    });

    scrollTl.add(animateToWhite());
  });

  const animate = () => {
    if (animations.skipIntro) {
      $gsap.set(wrapperRef.value, { opacity: 1, y: 0 });
      if (split.lines.value) $gsap.set(split.lines.value, { opacity: 1, y: 0 });
      if (split.words.value) $gsap.set(split.words.value, { opacity: 1 });
      animations.onIntroEntryComplete();
      return;
    }

    tl.play();

    // Initial wrapper fade in
    tl.to(wrapperRef.value, {
      opacity: 1,
      y: 0,
      duration: 1,
    });

    // Lines fade in
    if (split.lines.value) {
      tl.to(split.lines.value, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
      });
    }

    // Create timeline for word animations based on timings
    const wordTimeline = $gsap.timeline({
      onStart: () => {
        audioStore.playAudio(audioPath.value);
      },
      onComplete: () => {
        animations.onIntroEntryComplete();
        audioStore.stopCurrentAudio();
      },
    });

    if (split.words.value) {
      split.words.value.forEach((wordEl: any, index: number) => {
        const timing = timings.value[index];
        if (timing) {
          wordTimeline.to(
            wordEl,
            {
              opacity: 1,
              duration: timing.end - timing.start,
              ease: "none",
            },
            timing.start
          );
        }
      });
    }

    // Add word timeline after the initial animations (wrapper fade in + lines fade in)
    tl.add(wordTimeline, "0");
  };

  watch(
    () => animations.landing.intro.entry.started,
    (started) => {
      if (started) {
        animate();
      }
    }
  );

  return {
    animate,
    split
  };
};
