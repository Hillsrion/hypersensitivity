type HorizontalLoopConfig = {
  repeat?: number
  paused?: boolean
  speed?: number
  snap?: number | false
  paddingRight?: number | string
  reversed?: boolean
  wrapBuffer?: number
}

export function horizontalLoop(
  gsap: GSAP,
  items: HTMLElement[],
  config: HorizontalLoopConfig = {}
): GSAPTimeline | null {
  const elements = gsap.utils.toArray(items) as HTMLElement[]
  if (elements.length === 0) return null

  const tl = gsap.timeline({
    repeat: config.repeat ?? 0,
    paused: config.paused ?? false,
    defaults: { ease: 'none' },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100)
    },
  })

  const length = elements.length
  const firstItem = elements[0]
  if (!firstItem) return tl

  const startX = firstItem.offsetLeft
  const times: number[] = []
  const widths: number[] = []
  const xPercents: number[] = []
  const pixelsPerSecond = (config.speed ?? 1) * 100
  const snap: (value: number) => number =
    config.snap === false
      ? (value: number) => value
      : gsap.utils.snap(config.snap || 1)

  // Convert to xPercent and collect measurements
  gsap.set(elements, {
    xPercent: (i: number, el: HTMLElement) => {
      const w = parseFloat(String(gsap.getProperty(el, 'width', 'px')))
      widths[i] = w
      xPercents[i] = snap(
        (parseFloat(String(gsap.getProperty(el, 'x', 'px'))) / w) * 100 +
          parseFloat(String(gsap.getProperty(el, 'xPercent')))
      )
      return xPercents[i]
    },
  })

  gsap.set(elements, { x: 0 })

  const lastItem = elements[length - 1]
  if (!lastItem) return tl

  const lastWidth = widths[length - 1] ?? 0
  const lastXPerc = xPercents[length - 1] ?? 0

  const totalWidth =
    lastItem.offsetLeft +
    (lastXPerc / 100) * lastWidth -
    startX +
    lastItem.offsetWidth *
      parseFloat(String(gsap.getProperty(lastItem, 'scaleX'))) +
    Number(config.paddingRight ?? 0)

  for (let i = 0; i < length; i++) {
    const item = elements[i]
    const w = widths[i]
    const xPerc = xPercents[i]
    if (!item || w === undefined || xPerc === undefined) continue

    const curX = (xPerc / 100) * w
    const distanceToStart = item.offsetLeft + curX - startX
    const buffer = config.wrapBuffer ?? 0
    const distanceToLoop =
      distanceToStart +
      w * parseFloat(String(gsap.getProperty(item, 'scaleX'))) +
      buffer

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / w) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(((curX - distanceToLoop + totalWidth) / w) * 100),
        },
        {
          xPercent: xPerc,
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add('label' + i, distanceToStart / pixelsPerSecond)

    times[i] = distanceToStart / pixelsPerSecond
  }

  // Pre-render for performance
  tl.progress(1, true).progress(0, true)

  if (config.reversed) {
    if (tl.vars.onReverseComplete) {
      tl.vars.onReverseComplete()
    }
    tl.reverse()
  }

  return tl
}
