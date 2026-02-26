// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import DialogueBox from '~/app/components/game/DialogueBox.vue'

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

describe('DialogueBox', () => {
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
    const wrapper = await mountSuspended(DialogueBox, {
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
    const wrapper = await mountSuspended(DialogueBox, {
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

  it('shows pensees tag if speakerType is pensees', async () => {
    const wrapper = await mountSuspended(DialogueBox, {
      props: {
        dialogue: { ...defaultDialogue, speakerType: 'pensees' },
      },
      global: {
        provide: {
          $gsap: mockGsap,
        },
      },
    })

    expect(wrapper.text()).toContain('(en pensées)')
  })
})
