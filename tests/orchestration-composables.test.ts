import { describe, it, expect } from 'vitest'

import {
  getCursorVariantForProgress,
  shouldTriggerIntroAutoScroll,
  normalizeAudioPath,
  areAudioPathsEquivalent,
  resolveTimingEnd,
} from '../app/composables/game/orchestration'

describe('orchestration-composables', () => {
  it('intro cursor variant follows progress thresholds', () => {
    expect(getCursorVariantForProgress(0)).toBe('dark')
    expect(getCursorVariantForProgress(0.41)).toBe('light')
    expect(getCursorVariantForProgress(0.82)).toBe('light')
    expect(getCursorVariantForProgress(0.83)).toBe('dark')
  })

  it('intro auto-scroll trigger respects orchestration guards', () => {
    expect(
      shouldTriggerIntroAutoScroll({
        audioTriggered: false,
        introPlayed: false,
        isAutoScrolling: false,
        progress: 0.5,
        currentTime: 12,
        firstWordStart: 10,
      })
    ).toBe(false)

    expect(
      shouldTriggerIntroAutoScroll({
        audioTriggered: true,
        introPlayed: false,
        isAutoScrolling: false,
        progress: 1,
        currentTime: 12,
        firstWordStart: 10,
      })
    ).toBe(false)

    expect(
      shouldTriggerIntroAutoScroll({
        audioTriggered: true,
        introPlayed: false,
        isAutoScrolling: false,
        progress: 0.7,
        currentTime: 8.31,
        firstWordStart: 10,
        scrollDuration: 1.5,
        leadTime: 0.2,
      })
    ).toBe(true)
  })

  it('dialogue audio path normalization and matching are stable', () => {
    expect(normalizeAudioPath('/audios/day1.mp3')).toBe('audios/day1.mp3')
    expect(normalizeAudioPath('audios/day1.mp3')).toBe('audios/day1.mp3')

    expect(areAudioPathsEquivalent('/audios/day1.mp3', 'audios/day1.mp3')).toBe(
      true
    )
    expect(
      areAudioPathsEquivalent('audios/day1.mp3', '/static/audios/day1.mp3')
    ).toBe(true)
    expect(areAudioPathsEquivalent('audios/day1.mp3', 'audios/day2.mp3')).toBe(
      false
    )
  })

  it('dialogue timing end resolution prefers valid durations and falls back safely', () => {
    expect(
      resolveTimingEnd({
        end: 2.4,
        start: 1,
        candidateDurations: [100],
      })
    ).toBe(2.4)

    expect(
      resolveTimingEnd({
        end: 'end',
        start: 6,
        candidateDurations: [NaN, 5.9, 10],
      })
    ).toBe(10)

    expect(
      resolveTimingEnd({
        end: 'end',
        start: 6,
        candidateDurations: [NaN, 5.9],
        fallbackDuration: 4,
      })
    ).toBe(10)
  })
})
