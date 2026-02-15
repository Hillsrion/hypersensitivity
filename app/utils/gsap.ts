export function horizontalLoop(gsap: any, items: HTMLElement[], config: Record<string, any> = {}) {
  items = gsap.utils.toArray(items) as HTMLElement[];
  
  const tl = gsap.timeline({
    repeat: config.repeat ?? 0,
    paused: config.paused ?? false,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    }
  });

  const length = items.length;
  const startX = items[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap = config.snap === false 
    ? (v: number) => v 
    : gsap.utils.snap(config.snap || 1);

  // Convert to xPercent and collect measurements
  gsap.set(items, {
    xPercent: (i: number, el: HTMLElement) => {
      const w = (widths[i] = parseFloat(String(gsap.getProperty(el, "width", "px"))));
      xPercents[i] = snap(
        (parseFloat(String(gsap.getProperty(el, "x", "px"))) / w) * 100 +
        parseFloat(String(gsap.getProperty(el, "xPercent")))
      );
      return xPercents[i];
    }
  });
  
  gsap.set(items, { x: 0 });
  
  const totalWidth = 
    items[length - 1].offsetLeft + 
    (xPercents[length - 1] / 100) * widths[length - 1] - 
    startX + 
    items[length - 1].offsetWidth * parseFloat(String(gsap.getProperty(items[length - 1], "scaleX"))) +
    (parseFloat(config.paddingRight) || 0);
  
  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop = distanceToStart + widths[i] * parseFloat(String(gsap.getProperty(item, "scaleX")));
    
    tl.to(item, {
      xPercent: snap((curX - distanceToLoop) / widths[i] * 100),
      duration: distanceToLoop / pixelsPerSecond
    }, 0)
    .fromTo(item, {
      xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)
    }, {
      xPercent: xPercents[i],
      duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
      immediateRender: false
    }, distanceToLoop / pixelsPerSecond)
    .add("label" + i, distanceToStart / pixelsPerSecond);
    
    times[i] = distanceToStart / pixelsPerSecond;
  }

  // Pre-render for performance
  tl.progress(1, true).progress(0, true);
  
  if (config.reversed) {
    if (tl.vars.onReverseComplete) {
      tl.vars.onReverseComplete();
    }
    tl.reverse();
  }
  
  return tl;
}
