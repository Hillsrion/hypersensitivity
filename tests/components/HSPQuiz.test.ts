// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import HSPQuiz from '~/app/components/hsp/HSPQuiz.vue'

// Minimal GSAP mock
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

describe('HSPQuiz', () => {
  const defaultProps = {
    sections: [{ name: 'Section 1', shortName: 'S1' }],
    currentQuestion: { text: 'Test Question', inversed: false },
    currentQuestionIndex: 0,
    totalQuestions: 27,
    ratings: [
      { value: 0, label: 'No', inversedLabel: 'Yes' },
      { value: 1, label: 'Maybe', inversedLabel: 'Maybe' },
      { value: 2, label: 'Yes', inversedLabel: 'No' },
    ],
    currentAnswer: null,
    currentSectionIndex: 0,
    displaySectionName: 'Section 1',
    progressPercent: 10,
    isLastQuestion: false,
    questions: [{ text: 'Test Question', inversed: false }],
  }

  it('renders question text', async () => {
    // Provide $gsap via global provide
    const wrapper = await mountSuspended(HSPQuiz, {
      props: defaultProps,
      global: {
        provide: {
          $gsap: mockGsap,
        },
      },
    })

    expect(wrapper.text()).toContain('Test Question')
    expect(wrapper.text()).toContain('Question 1 / 27')
  })

  it('emits selectAnswer when a rating is clicked', async () => {
    const wrapper = await mountSuspended(HSPQuiz, {
      props: defaultProps,
      global: {
        provide: {
          $gsap: mockGsap,
        },
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')

    expect(wrapper.emitted('selectAnswer')).toBeTruthy()
    expect(wrapper.emitted('selectAnswer')![0]).toEqual([0])
  })

  it('disables next button if no answer is selected', async () => {
    const wrapper = await mountSuspended(HSPQuiz, {
      props: { ...defaultProps, currentAnswer: null },
      global: {
        provide: {
          $gsap: mockGsap,
        },
      },
    })

    const nextButton = wrapper
      .findAll('button')
      .find((b) => b.text().includes('Next'))
    expect(nextButton?.attributes('disabled')).toBeDefined()
  })

  it('enables next button if an answer is selected', async () => {
    const wrapper = await mountSuspended(HSPQuiz, {
      props: { ...defaultProps, currentAnswer: 1 },
      global: {
        provide: {
          $gsap: mockGsap,
        },
      },
    })

    const nextButton = wrapper
      .findAll('button')
      .find((b) => b.text().includes('Next'))
    expect(nextButton?.attributes('disabled')).toBeUndefined()
  })
})
