type HSPQuizSection = {
  name: string
}

type HSPQuizQuestion = {
  inversed: boolean
}

type HSPQuizAnimationProps = {
  displaySectionName: string
  currentSectionIndex: number
  sections: HSPQuizSection[]
  questions: HSPQuizQuestion[]
  currentQuestionIndex: number
  currentQuestion: HSPQuizQuestion
  isLastQuestion: boolean
}

type HSPQuizAnimationEmit = (event: 'previous' | 'next') => void

const isHTMLElement = (element: HTMLElement | null): element is HTMLElement =>
  element !== null

export const useHSPQuizAnimation = (
  props: HSPQuizAnimationProps,
  emit: HSPQuizAnimationEmit
) => {
  const { $gsap } = useNuxtApp()

  const isAnimating = ref(false)
  const internalDisplaySectionName = ref(props.displaySectionName)

  const sectionNameRef = useTemplateRef<HTMLElement>('sectionNameRef')
  const headerRef = useTemplateRef<HTMLElement>('headerRef')
  const progressBarRef = useTemplateRef<HTMLElement>('progressBarRef')
  const questionInfoRef = useTemplateRef<HTMLElement>('questionInfoRef')
  const questionTextRef = useTemplateRef<HTMLElement>('questionTextRef')
  const answersRef = useTemplateRef<HTMLElement>('answersRef')
  const navRef = useTemplateRef<HTMLElement>('navRef')

  watch(
    () => props.currentSectionIndex,
    (newIndex: number) => {
      const nextSectionName = props.sections[newIndex]?.name
      if (!nextSectionName) return

      if (!sectionNameRef.value) {
        internalDisplaySectionName.value = nextSectionName
        return
      }

      const tl = $gsap.timeline()

      tl.to(sectionNameRef.value, {
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          internalDisplaySectionName.value = nextSectionName
        },
      })

      tl.to(sectionNameRef.value, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  )

  const onPrevious = async () => {
    if (isAnimating.value) return
    isAnimating.value = true

    const prevQuestion = props.questions[props.currentQuestionIndex - 1]
    const optionsChange = Boolean(
      prevQuestion && prevQuestion.inversed !== props.currentQuestion.inversed
    )

    const slideElements = [
      questionTextRef.value,
      optionsChange ? answersRef.value : null,
    ].filter(isHTMLElement)

    const tlOut = $gsap.timeline()
    tlOut.to(
      slideElements,
      {
        x: 50,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      },
      0
    )

    if (questionInfoRef.value) {
      tlOut.to(
        questionInfoRef.value,
        {
          opacity: 0,
          duration: 0.2,
        },
        0
      )
    }

    await tlOut

    emit('previous')

    await nextTick()

    $gsap.set(slideElements, {
      x: -50,
      opacity: 0,
      filter: 'blur(6px)',
    })

    if (questionInfoRef.value) {
      $gsap.set(questionInfoRef.value, { opacity: 0 })
    }

    const tlIn = $gsap.timeline()
    tlIn.to(
      slideElements,
      {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      },
      0
    )

    if (questionInfoRef.value) {
      tlIn.to(
        questionInfoRef.value,
        {
          opacity: 1,
          duration: 0.3,
        },
        0
      )
    }

    await tlIn
    isAnimating.value = false
  }

  const onNext = async () => {
    if (isAnimating.value) return

    if (props.isLastQuestion) {
      emit('next')
      return
    }

    isAnimating.value = true

    const nextQuestion = props.questions[props.currentQuestionIndex + 1]
    const optionsChange = Boolean(
      nextQuestion && nextQuestion.inversed !== props.currentQuestion.inversed
    )

    const slideElements = [
      questionTextRef.value,
      optionsChange ? answersRef.value : null,
    ].filter(isHTMLElement)

    const tlOut = $gsap.timeline()
    tlOut.to(
      slideElements,
      {
        x: -50,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      },
      0
    )

    if (questionInfoRef.value) {
      tlOut.to(
        questionInfoRef.value,
        {
          opacity: 0,
          duration: 0.2,
        },
        0
      )
    }

    await tlOut

    emit('next')

    await nextTick()

    $gsap.set(slideElements, {
      x: 50,
      opacity: 0,
      filter: 'blur(6px)',
    })

    if (questionInfoRef.value) {
      $gsap.set(questionInfoRef.value, { opacity: 0 })
    }

    const tlIn = $gsap.timeline()
    tlIn.to(
      slideElements,
      {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      },
      0
    )

    if (questionInfoRef.value) {
      tlIn.to(
        questionInfoRef.value,
        {
          opacity: 1,
          duration: 0.3,
        },
        0
      )
    }

    await tlIn
    isAnimating.value = false
  }

  const enter = () => {
    return new Promise<void>((resolve) => {
      if (progressBarRef.value) {
        $gsap.set(progressBarRef.value, { y: '100%' })
      }

      const elements = [
        headerRef.value,
        questionInfoRef.value,
        questionTextRef.value,
        answersRef.value,
        navRef.value,
      ].filter(isHTMLElement)

      $gsap.set(elements, {
        opacity: 0,
        y: 20,
        filter: 'blur(3px)',
      })

      if (!progressBarRef.value && elements.length === 0) {
        resolve()
        return
      }

      const tl = $gsap.timeline({
        onComplete: () => resolve(),
      })

      if (progressBarRef.value) {
        tl.to(
          progressBarRef.value,
          {
            y: '0%',
            duration: 0.6,
            ease: 'power3.out',
          },
          0
        )
      }

      if (elements.length > 0) {
        tl.to(
          elements,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
          },
          0.2
        )
      }
    })
  }

  const leave = () => {
    return new Promise<void>((resolve) => {
      const elements = [
        headerRef.value,
        questionInfoRef.value,
        questionTextRef.value,
        answersRef.value,
        navRef.value,
      ].filter(isHTMLElement)

      if (!progressBarRef.value && elements.length === 0) {
        resolve()
        return
      }

      const tl = $gsap.timeline({
        onComplete: () => resolve(),
      })

      if (progressBarRef.value) {
        tl.to(
          progressBarRef.value,
          {
            y: '100%',
            duration: 0.5,
            ease: 'power3.in',
          },
          0
        )
      }

      if (elements.length > 0) {
        tl.to(
          elements,
          {
            opacity: 0,
            y: -20,
            filter: 'blur(3px)',
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.in',
          },
          0
        )
      }
    })
  }

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
    leave,
  }
}
