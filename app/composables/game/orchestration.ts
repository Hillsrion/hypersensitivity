export const getCursorVariantForProgress = (
  progress: number
): 'dark' | 'light' =>
  progress > 0.82 ? 'dark' : progress > 0.4 ? 'light' : 'dark'

export const shouldTriggerIntroAutoScroll = ({
  audioTriggered,
  introPlayed,
  isAutoScrolling,
  progress,
  currentTime,
  firstWordStart,
  scrollDuration = 1.5,
  leadTime = 0.2,
}: {
  audioTriggered: boolean
  introPlayed: boolean
  isAutoScrolling: boolean
  progress: number
  currentTime: number
  firstWordStart: number
  scrollDuration?: number
  leadTime?: number
}) => {
  if (!audioTriggered || introPlayed || isAutoScrolling || progress > 0.99) {
    return false
  }

  return currentTime >= firstWordStart - (scrollDuration + leadTime)
}

export const normalizeAudioPath = (path: string) =>
  path.startsWith('/') ? path.substring(1) : path

export const areAudioPathsEquivalent = (pathA: string, pathB: string) => {
  const normalizedA = normalizeAudioPath(pathA)
  const normalizedB = normalizeAudioPath(pathB)

  return (
    normalizedA === normalizedB ||
    normalizedA.endsWith(normalizedB) ||
    normalizedB.endsWith(normalizedA)
  )
}

export const resolveTimingEnd = ({
  end,
  start,
  candidateDurations = [],
  fallbackDuration = 5,
}: {
  end: number | 'end'
  start: number
  candidateDurations?: Array<number | undefined>
  fallbackDuration?: number
}) => {
  if (end !== 'end') return end

  const validDuration = candidateDurations.find(
    (duration) =>
      typeof duration === 'number' &&
      !Number.isNaN(duration) &&
      duration > start
  )

  if (typeof validDuration === 'number') {
    return validDuration
  }

  return start + fallbackDuration
}
