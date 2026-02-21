export const useHSPResultsAnimation = (props: any) => {
  const { $gsap } = useNuxtApp();

  const scoreContainerRef = ref(null);
  const totalScoreRef = ref<HTMLElement | null>(null);
  const sensitivityLabelRef = ref(null);
  const sensitivityDescRef = ref(null);
  const sectionsTitleRef = ref(null);
  const sectionItemsRef = ref([]);
  const sectionScoreCountersRef = ref([]);
  const sectionBarsRef = ref([]);
  const profileCardRef = ref(null);
  const alertCardRef = ref(null);
  const restartBtnRef = ref(null);

  const enter = () => {
    return new Promise((resolve) => {
      // Collect all elements to animate in
      const mainElements = [
          scoreContainerRef.value,
          sensitivityLabelRef.value,
          sensitivityDescRef.value,
          sectionsTitleRef.value,
          profileCardRef.value,
          alertCardRef.value,
          restartBtnRef.value
      ].filter(el => el); // filter nulls

      // Set initial states
      $gsap.set(mainElements, {
          opacity: 0,
          y: 20,
          filter: 'blur(10px)'
      });
      
      $gsap.set(sectionItemsRef.value, {
          opacity: 0,
          x: -20
      });

      const tl = $gsap.timeline({
          onComplete: resolve
      });

      // 1. Animate Total Score Counter
      const scoreObj = { val: 0 };
      tl.to(scoreObj, {
          val: props.totalScore,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
              if (totalScoreRef.value) {
                  totalScoreRef.value.textContent = Math.round(scoreObj.val).toString();
              }
          }
      }, 0);

      // 2. Stagger animate main elements
      tl.to(mainElements, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out'
      }, 0);

      // 3. Stagger animate section items container
      tl.to(sectionItemsRef.value, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out'
      }, 0.5);

      // 4. Animate Bars and Section Counters
      sectionBarsRef.value.forEach((bar: any, index: number) => {
          if (!bar) return;
          
          // Bar width
          const targetWidth = bar.dataset.width;
          tl.to(bar, {
              width: targetWidth,
              duration: 1.5,
              ease: 'power3.out'
          }, 0.5 + (index * 0.05));

          // Section Score Counter
          const counterEl: any = sectionScoreCountersRef.value[index];
          if (counterEl) {
              const sectionScore = props.sectionScores[index];
              const sectionScoreObj = { val: 0 };
              tl.to(sectionScoreObj, {
                  val: sectionScore,
                  duration: 1.5,
                  ease: 'power2.out',
                  onUpdate: () => {
                      counterEl.textContent = Math.round(sectionScoreObj.val).toString();
                  }
              }, 0.5 + (index * 0.05));
          }
      });

    });
  };

  const leave = () => {
    return new Promise((resolve) => {
      const tl = $gsap.timeline({
        onComplete: resolve
      });
      
      // Simple fade out for everything
      const allRefs = [
          scoreContainerRef.value,
          profileCardRef.value,
          alertCardRef.value,
          restartBtnRef.value,
          ...sectionItemsRef.value
      ].filter(el => el);

      tl.to(allRefs, {
          opacity: 0,
          filter: 'blur(10px)',
          duration: 0.5,
          ease: 'power2.in'
      });
    });
  };

  return {
    scoreContainerRef,
    totalScoreRef,
    sensitivityLabelRef,
    sensitivityDescRef,
    sectionsTitleRef,
    sectionItemsRef,
    sectionScoreCountersRef,
    sectionBarsRef,
    profileCardRef,
    alertCardRef,
    restartBtnRef,
    enter,
    leave
  };
};
