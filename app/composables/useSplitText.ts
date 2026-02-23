import SplitType from 'split-type'

export interface SplitTextOptions {
  splitBy?: string
  onComplete?: (instance: SplitType) => void
  shouldRevert?: boolean
  delay?: number
}

export function useSplitText(
  target: Ref<HTMLElement | null>,
  options: SplitTextOptions = {}
) {
  const {
    splitBy = 'lines,words,chars',
    onComplete,
    shouldRevert = true,
    delay = 0,
  } = options

  const instance = ref<SplitType | null>(null)
  const lines = ref<HTMLElement[]>([])
  const words = ref<HTMLElement[]>([])
  const chars = ref<HTMLElement[]>([])

  const split = () => {
    if (!target.value) return

    // Clean up previous instance if any
    if (instance.value) {
      instance.value.revert()
    }

    try {
      instance.value = new SplitType(target.value, {
        types: splitBy
          .split(',')
          .map((segment) => segment.trim())
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .join(',') as any,
        tagName: 'span',
      })

      lines.value = instance.value.lines || []
      words.value = instance.value.words || []
      chars.value = instance.value.chars || []

      if (onComplete) {
        onComplete(instance.value)
      }
    } catch (err) {
      console.error('Error splitting text:', err)
    }
  }

  // Watch for target changes
  watch(
    target,
    async (newVal) => {
      if (newVal) {
        if (delay > 0) {
          setTimeout(() => {
            split()
          }, delay)
        } else {
          await nextTick()
          split()
        }
      } else {
        instance.value?.revert()
        instance.value = null
        lines.value = []
        words.value = []
        chars.value = []
      }
    },
    { immediate: true }
  )

  // Optional: monitor resizing if needed, but split-type usually needs manual trigger on resize
  // for now we keep it simple as the original module likely did.

  const revert = () => {
    instance.value?.revert()
    instance.value = null
    lines.value = []
    words.value = []
    chars.value = []
  }

  onUnmounted(() => {
    if (shouldRevert) {
      revert()
    }
  })

  return {
    instance,
    lines,
    words,
    chars,
    split,
    revert,
  }
}
