export const useHSPIntroAnimation = () => {
  const { $gsap } = useNuxtApp()
  const titleRef = useTemplateRef<HTMLElement>('titleRef')
  const desc1Ref = useTemplateRef<HTMLElement>('desc1Ref')
  const desc2Ref = useTemplateRef<HTMLElement>('desc2Ref')
  const stat1Ref = useTemplateRef<HTMLElement>('stat1Ref')
  const stat2Ref = useTemplateRef<HTMLElement>('stat2Ref')
  const btnRef = useTemplateRef<HTMLElement>('btnRef')

  const leave = () => {
    return new Promise((resolve) => {
      const tl = $gsap.timeline({
        onComplete: resolve,
      })

      const elements = [
        titleRef.value,
        desc1Ref.value,
        desc2Ref.value,
        stat1Ref.value,
        stat2Ref.value,
        btnRef.value,
      ]

      tl.to(elements, {
        y: -20,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.in',
      })
    })
  }

  const enter = () => {
    return new Promise((resolve) => {
      const tl = $gsap.timeline({
        onComplete: resolve,
      })

      const elements = [
        titleRef.value,
        desc1Ref.value,
        desc2Ref.value,
        stat1Ref.value,
        stat2Ref.value,
        btnRef.value,
      ]

      tl.fromTo(
        elements,
        {
          y: 20,
          opacity: 0,
          filter: 'blur(10px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      )
    })
  }

  return {
    titleRef,
    desc1Ref,
    desc2Ref,
    stat1Ref,
    stat2Ref,
    btnRef,
    enter,
    leave,
  }
}
