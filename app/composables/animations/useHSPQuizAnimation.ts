export const useHSPQuizAnimation = (props: any, emit: any) => {
  const { $gsap } = useNuxtApp();
  
  const isAnimating = ref(false);
  const internalDisplaySectionName = ref(props.displaySectionName);

  const sectionNameRef = ref(null);
  const headerRef = ref(null);
  const progressBarRef = ref(null);
  const questionInfoRef = ref(null);
  const questionTextRef = ref(null);
  const answersRef = ref(null);
  const navRef = ref(null);

  watch(() => props.currentSectionIndex, (newIndex: number) => {
    if (!sectionNameRef.value) {
      internalDisplaySectionName.value = props.sections[newIndex].name;
      return;
    }

    const tl = $gsap.timeline();

    tl.to(sectionNameRef.value, {
      opacity: 0,
      filter: "blur(12px)",
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        internalDisplaySectionName.value = props.sections[newIndex].name;
      },
    });

    tl.to(sectionNameRef.value, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.4,
      ease: "power2.out",
    });
  });

  const onPrevious = async () => {
    if (isAnimating.value) return;
    isAnimating.value = true;
    
    const prevQuestion = props.questions[props.currentQuestionIndex - 1];
    const optionsChange = prevQuestion && prevQuestion.inversed !== props.currentQuestion.inversed;
    
    const slideElements = [questionTextRef.value];
    if (optionsChange) slideElements.push(answersRef.value);
    
    const tlOut = $gsap.timeline();
    tlOut.to(slideElements, {
      x: 50,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in'
    }, 0);
    
    tlOut.to(questionInfoRef.value, {
      opacity: 0,
      duration: 0.2
    }, 0);
    
    await tlOut;
    
    emit('previous');
    
    await nextTick();
    
    $gsap.set(slideElements, { 
      x: -50,
      opacity: 0,
      filter: 'blur(10px)'
    });
    $gsap.set(questionInfoRef.value, { opacity: 0 });
    
    const tlIn = $gsap.timeline();
    tlIn.to(slideElements, {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out'
    }, 0);
    
    tlIn.to(questionInfoRef.value, {
      opacity: 1,
      duration: 0.3
    }, 0);
    
    await tlIn;
    isAnimating.value = false;
  };

  const onNext = async () => {
    if (isAnimating.value) return;
    
    if (props.isLastQuestion) {
        emit('next');
        return;
    }
    
    isAnimating.value = true;
    
    const nextQuestion = props.questions[props.currentQuestionIndex + 1];
    const optionsChange = nextQuestion && nextQuestion.inversed !== props.currentQuestion.inversed;
    
    const slideElements = [questionTextRef.value];
    if (optionsChange) slideElements.push(answersRef.value);
    
    const tlOut = $gsap.timeline();
    tlOut.to(slideElements, {
      x: -50,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in'
    }, 0);
    
    tlOut.to(questionInfoRef.value, {
      opacity: 0,
      duration: 0.2
    }, 0);
    
    await tlOut;
    
    emit('next');
    
    await nextTick();
    
    $gsap.set(slideElements, { 
      x: 50,
      opacity: 0,
      filter: 'blur(10px)'
    });
    $gsap.set(questionInfoRef.value, { opacity: 0 });
    
    const tlIn = $gsap.timeline();
    tlIn.to(slideElements, {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out'
    }, 0);
    
    tlIn.to(questionInfoRef.value, {
      opacity: 1,
      duration: 0.3
    }, 0);
    
    await tlIn;
    isAnimating.value = false;
  };

  const enter = () => {
    return new Promise((resolve) => {
      // Initial state
      $gsap.set(progressBarRef.value, { y: '100%' });
      
      const elements = [
        headerRef.value,
        questionInfoRef.value,
        questionTextRef.value,
        answersRef.value,
        navRef.value
      ];

      $gsap.set(elements, {
        opacity: 0,
        y: 20,
        filter: 'blur(5px)'
      });

      const tl = $gsap.timeline({
        onComplete: resolve
      });

      // Animate Progress Bar
      tl.to(progressBarRef.value, {
        y: '0%',
        duration: 0.6,
        ease: 'power3.out'
      }, 0);

      // Stagger animate other elements
      tl.to(elements, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }, 0.2);
    });
  };

  const leave = () => {
    return new Promise((resolve) => {
      const tl = $gsap.timeline({
        onComplete: resolve
      });

      const elements = [
        headerRef.value,
        questionInfoRef.value,
        questionTextRef.value,
        answersRef.value,
        navRef.value
      ];

      // Animate Progress Bar
      tl.to(progressBarRef.value, {
        y: '100%',
        duration: 0.5,
        ease: 'power3.in'
      }, 0);

      // Stagger animate other elements
      tl.to(elements, {
        opacity: 0,
        y: -20,
        filter: 'blur(5px)',
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.in'
      }, 0);
    });
  };

  return {
    isAnimating,
    internalDisplaySectionName,
    sectionNameRef,
    headerRef,
    progressBarRef,
    questionInfoRef,
    questionTextRef,
    answersRef,
    navRef,
    onPrevious,
    onNext,
    enter,
    leave
  };
};
