// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import GameDialogueBox from '~/app/components/game/GameDialogueBox.vue'

// Mock gsap
const mockGsap = {
  timeline: vi.fn(() => ({
    to: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    then: (cb?: () => void) => {
      if (cb) cb()
      return Promise.resolve()
    },
  })),
  set: vi.fn(),
  to: vi.fn().mockReturnThis(),
  registerPlugin: vi.fn(),
}

describe('GameDialogueBox', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const defaultDialogue = {
    id: 'test_d1',
    speaker: 'LUCIE',
    speakerType: 'normal' as const,
    text: 'Hello world',
    annotation: 'Thinking deeply...',
    timings: [
      { word: 'Hello', start: 0, end: 500 },
      { word: 'world', start: 500, end: 1000 },
    ],
  }

  it('renders speaker name and text', async () => {
    const wrapper = await mountSuspended(GameDialogueBox, {
      props: {
        dialogue: defaultDialogue,
      },
      global: {
        provide: {
          $gsap: mockGsap,
        },
      },
    })

    expect(wrapper.text()).toContain('LUCIE')
    expect(wrapper.text()).toContain('Hello world')
  })

  it('shows annotation if provided', async () => {
    const wrapper = await mountSuspended(GameDialogueBox, {
      props: {
        dialogue: defaultDialogue,
      },
      global: {
        provide: {
          $gsap: mockGsap,
        },
      },
    })

    expect(wrapper.text()).toContain('Thinking deeply...')
  })

  it('shows thoughts tag if speakerType is thoughts', async () => {
    const wrapper = await mountSuspended(GameDialogueBox, {
      props: {
        dialogue: { ...defaultDialogue, speakerType: 'thoughts' },
      },
      global: {
        provide: {
          $gsap: mockGsap,
        },
      },
    })

    expect(wrapper.text()).toContain('(pensées)')
  })
})
