/**
 * Utility script to calculate and log scroll positions for GSAP ScrollTriggers.
 * Use this in the browser console to find exact scroll targets.
 */
export const logScrollPositions = () => {
  if (typeof window === 'undefined') return
  // @ts-expect-error ScrollTrigger is global in browser context
  const ScrollTrigger = window.ScrollTrigger
  if (!ScrollTrigger) {
    console.warn('ScrollTrigger not found on window.')
    return
  }

  // @ts-expect-error ScrollTrigger types are not fully defined for this helper
  const triggers = ScrollTrigger.getAll()
  const summary = triggers.map(
    (t: { trigger: HTMLElement | null; start: number; end: number }) => ({
      id: t.trigger?.id || 'unnamed',
      start: Math.round(t.start),
      end: Math.round(t.end),
      distance: Math.round(t.end - t.start),
    })
  )

  console.table(summary)
}

/**
 * Formula for estimating scroll position of a generic section without ScrollTrigger:
 *
 * ScrollY(index) = (ViewportHeight * 0.4) + (index * ((ViewportHeight * 4) + 64))
 *
 * - 0.4: Initial margin-top (40svh)
 * - 4: Each section's height (400svh)
 * - 64: Vertical gap between sections (gap-y-16)
 */
