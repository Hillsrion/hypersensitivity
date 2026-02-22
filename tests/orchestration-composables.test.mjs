import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getCursorVariantForProgress,
  shouldTriggerIntroAutoScroll,
  normalizeAudioPath,
  areAudioPathsEquivalent,
  resolveTimingEnd,
} from '../app/composables/game/orchestration.ts'

test('intro cursor variant follows progress thresholds', () => {
  assert.equal(getCursorVariantForProgress(0), 'dark')
  assert.equal(getCursorVariantForProgress(0.41), 'light')
  assert.equal(getCursorVariantForProgress(0.82), 'light')
  assert.equal(getCursorVariantForProgress(0.83), 'dark')
})

test('intro auto-scroll trigger respects orchestration guards', () => {
  assert.equal(
    shouldTriggerIntroAutoScroll({
      audioTriggered: false,
      introPlayed: false,
      isAutoScrolling: false,
      progress: 0.5,
      currentTime: 12,
      firstWordStart: 10,
    }),
    false
  )

  assert.equal(
    shouldTriggerIntroAutoScroll({
      audioTriggered: true,
      introPlayed: false,
      isAutoScrolling: false,
      progress: 1,
      currentTime: 12,
      firstWordStart: 10,
    }),
    false
  )

  assert.equal(
    shouldTriggerIntroAutoScroll({
      audioTriggered: true,
      introPlayed: false,
      isAutoScrolling: false,
      progress: 0.7,
      currentTime: 8.31,
      firstWordStart: 10,
      scrollDuration: 1.5,
      leadTime: 0.2,
    }),
    true
  )
})

test('dialogue audio path normalization and matching are stable', () => {
  assert.equal(normalizeAudioPath('/audios/day1.mp3'), 'audios/day1.mp3')
  assert.equal(normalizeAudioPath('audios/day1.mp3'), 'audios/day1.mp3')

  assert.equal(
    areAudioPathsEquivalent('/audios/day1.mp3', 'audios/day1.mp3'),
    true
  )
  assert.equal(
    areAudioPathsEquivalent('audios/day1.mp3', '/static/audios/day1.mp3'),
    true
  )
  assert.equal(
    areAudioPathsEquivalent('audios/day1.mp3', 'audios/day2.mp3'),
    false
  )
})

test('dialogue timing end resolution prefers valid durations and falls back safely', () => {
  assert.equal(
    resolveTimingEnd({
      end: 2.4,
      start: 1,
      candidateDurations: [100],
    }),
    2.4
  )

  assert.equal(
    resolveTimingEnd({
      end: 'end',
      start: 6,
      candidateDurations: [NaN, 5.9, 10],
    }),
    10
  )

  assert.equal(
    resolveTimingEnd({
      end: 'end',
      start: 6,
      candidateDurations: [NaN, 5.9],
      fallbackDuration: 4,
    }),
    10
  )
})
