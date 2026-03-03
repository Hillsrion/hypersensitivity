export {}

declare global {
  interface Window {
    lenis?: {
      start: () => void
      stop: () => void
      scrollTo: (
        target: number | string | HTMLElement,
        options?: { immediate?: boolean; offset?: number; duration?: number }
      ) => void
    }
  }
}
