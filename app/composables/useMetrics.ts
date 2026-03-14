export const useMetrics = () => {
  const track = (
    eventName: string,
    properties: Record<string, unknown> = {}
  ) => {
    // 1. Log to console in development
    if (import.meta.dev) {
      console.log(`[Metrics] ${eventName}`, properties)
    }

    // 2. Track via Cloudflare Zaraz if available
    // Zaraz is the official way to track custom events in the Cloudflare ecosystem
    // @ts-expect-error - zaraz is injected by Cloudflare
    if (typeof window !== 'undefined' && window.zaraz) {
      try {
        // @ts-expect-error - zaraz is injected by Cloudflare
        window.zaraz.track(eventName, properties)
      } catch (e) {
        console.error('[Metrics] Error tracking with Zaraz:', e)
      }
    }
  }

  return {
    track,
  }
}
