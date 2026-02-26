import { expect, test } from '@playwright/test'

test.describe('HSP Quiz E2E', () => {
  test('can open and complete the HSP quiz using DevTools shortcuts', async ({
    page,
  }) => {
    // Extend timeout for this complex test
    test.setTimeout(90000)

    // Enable console log mirroring
    page.on('console', (msg) => console.log(`BROWSER: ${msg.text()}`))

    // 1. Navigate with test=true to bypass LoadingSection.vue
    await page.goto('/?test=true')

    // 2. Setup game state via DevTools
    // Skip Intro ensures internal flags are set
    await page.getByText('Skip Intro').click()
    await page.waitForTimeout(1000)

    // Skip to Game ensures introPlayed is true and scrolls to Experience
    await page.getByText('Skip to Game').click()
    await page.waitForTimeout(1000)

    // 3. Jump to game end
    const skipToEndButton = page.getByText('Skip to End')
    await expect(skipToEndButton).toBeVisible()
    await skipToEndButton.click()

    // 4. Wait for the "OUI" button
    // Gradient animation is ~4.5s
    const ouiButton = page.getByRole('button', { name: 'OUI', exact: true })
    await expect(ouiButton).toBeVisible({ timeout: 30000 })

    // Using dispatchEvent to bypass any potential pointer-events blockers
    await ouiButton.dispatchEvent('click')

    // 5. Wait for Questionnaire overlay (HSPIntro)
    // Internal delays: QUESTIONNAIRE_ENTRY (1s) + CONTENT_READY (2s)
    const startQuizButton = page.getByText('Commencer le questionnaire')
    await expect(startQuizButton).toBeVisible({ timeout: 20000 })
    await startQuizButton.dispatchEvent('click')

    // 6. Skip questions via DevTools (Passer directement à la fin)
    const skipToResultsButton = page.getByText('Passer directement à la fin')
    await expect(skipToResultsButton).toBeVisible({ timeout: 10000 })
    await skipToResultsButton.click()

    // 7. Verify results
    // Results view has "Profil" title and "Recommencer le questionnaire" button
    await expect(page.getByText('Profil', { exact: false })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.getByText('Scores par section')).toBeVisible()
    await expect(page.getByText('Recommencer le questionnaire')).toBeVisible()
  })
})
