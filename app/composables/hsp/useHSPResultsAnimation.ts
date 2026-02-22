type HSPResultsAnimationProps = {
  totalScore: number
  sectionScores: number[]
}

const isHTMLElement = (element: HTMLElement | null): element is HTMLElement =>
  element !== null

export const useHSPResultsAnimation = (props: HSPResultsAnimationProps) => {
  const { $gsap } = useNuxtApp()

  const scoreContainerRef = useTemplateRef<HTMLElement>('scoreContainerRef')
  const totalScoreRef = useTemplateRef<HTMLElement>('totalScoreRef')
  const sensitivityLabelRef = useTemplateRef<HTMLElement>('sensitivityLabelRef')
  const sensitivityDescRef = useTemplateRef<HTMLElement>('sensitivityDescRef')
  const sectionsTitleRef = useTemplateRef<HTMLElement>('sectionsTitleRef')
  const sectionItemsRef = useTemplateRef<HTMLElement[]>('sectionItemsRef')
  const sectionScoreCountersRef = useTemplateRef<HTMLElement[]>(
    'sectionScoreCountersRef'
  )
  const sectionBarsRef = useTemplateRef<HTMLElement[]>('sectionBarsRef')
  const profileCardRef = useTemplateRef<HTMLElement>('profileCardRef')
  const alertCardRef = useTemplateRef<HTMLElement>('alertCardRef')
  const restartBtnRef = useTemplateRef<HTMLElement>('restartBtnRef')

  const enter = () => {
    return new Promise<void>((resolve) => {
      const mainElements = [
        scoreContainerRef.value,
        sensitivityLabelRef.value,
        sensitivityDescRef.value,
        sectionsTitleRef.value,
        profileCardRef.value,
        alertCardRef.value,
        restartBtnRef.value,
      ].filter(isHTMLElement)

      $gsap.set(mainElements, {
        opacity: 0,
        y: 20,
        filter: 'blur(10px)',
      })

      $gsap.set(sectionItemsRef.value, {
        opacity: 0,
        x: -20,
      })

      if (
        mainElements.length === 0 &&
        (sectionItemsRef.value?.length ?? 0) === 0 &&
        (sectionBarsRef.value?.length ?? 0) === 0
      ) {
        resolve()
        return
      }

      const tl = $gsap.timeline({
        onComplete: () => resolve(),
      })

      const scoreObj = { val: 0 }
      tl.to(
        scoreObj,
        {
          val: props.totalScore,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            if (totalScoreRef.value) {
              totalScoreRef.value.textContent = Math.round(
                scoreObj.val
              ).toString()
            }
          },
        },
        0
      )

      if (mainElements.length > 0) {
        tl.to(
          mainElements,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
          },
          0
        )
      }

      if ((sectionItemsRef.value?.length ?? 0) > 0) {
        tl.to(
          sectionItemsRef.value,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
          },
          0.5
        )
      }

      ;(sectionBarsRef.value ?? []).forEach((bar, index: number) => {
        const targetWidth = bar.dataset.width
        tl.to(
          bar,
          {
            width: targetWidth,
            duration: 1.5,
            ease: 'power3.out',
          },
          0.5 + index * 0.05
        )

        const counterEl = (sectionScoreCountersRef.value ?? [])[index]
        if (counterEl) {
          const sectionScore = props.sectionScores[index] ?? 0
          const sectionScoreObj = { val: 0 }
          tl.to(
            sectionScoreObj,
            {
              val: sectionScore,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                counterEl.textContent = Math.round(
                  sectionScoreObj.val
                ).toString()
              },
            },
            0.5 + index * 0.05
          )
        }
      })
    })
  }

  const leave = () => {
    return new Promise<void>((resolve) => {
      const allRefs = [
        scoreContainerRef.value,
        profileCardRef.value,
        alertCardRef.value,
        restartBtnRef.value,
        ...(sectionItemsRef.value ?? []),
      ].filter(isHTMLElement)

      if (allRefs.length === 0) {
        resolve()
        return
      }

      const tl = $gsap.timeline({
        onComplete: () => resolve(),
      })

      tl.to(allRefs, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.5,
        ease: 'power2.in',
      })
    })
  }

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
    leave,
  }
}
