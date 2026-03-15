export const useMetrics = () => {
  const config = useRuntimeConfig()

  const track = (
    eventName: string,
    properties: Record<string, unknown> = {}
  ) => {
    // 1. Log to console in development
    if (import.meta.dev) {
      console.log(`[Metrics] ${eventName}`, properties)
    }

    // 2. Track via dedicated Cloudflare Workers Analytics Engine collector
    const collectorUrl = config.public.analyticsCollectorUrl as string
    if (collectorUrl) {
      fetch(collectorUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Use no-cors for fire-and-forget or ensure CORS is handled if we need feedback
        body: JSON.stringify({
          event: eventName,
          properties: properties,
        }),
      }).catch((err) => {
        if (import.meta.dev) {
          console.error('[Metrics] Error sending to collector:', err)
        }
      })
    }

    // 3. Track via Cloudflare Zaraz if available (Legacy/Backup)
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
