import { test, expect } from '@playwright/test'

test.describe('Game End Flow E2E', () => {
  test('should show end screen choices and open questionnaire', async ({
    page,
  }) => {
    // 1. Navigate and bypass loading
    await page.goto('/?test=true', { waitUntil: 'networkidle' })

    // Enable console log mirroring
    page.on('console', (msg) => console.log(`BROWSER: ${msg.text()}`))

    // 2. Skip to game area
    const skipToGameButton = page.getByText('Skip to Game')
    await expect(skipToGameButton).toBeVisible({ timeout: 15000 })
    await skipToGameButton.click()

    // 3. Jump to the final scene using DevTools
    const sceneSelect = page.locator('select')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(sceneSelect).toBeVisible({ timeout: 15000 })

    // GAME_END is 'gameEnd'
    await sceneSelect.selectOption('gameEnd')

    // 4. Wait for the final dialogue
    await expect(
      page.getByText("Merci d'avoir joué à cette démo.").first()
    ).toBeVisible({ timeout: 20000 })

    // 5. Advance past the last dialogue
    await page.click('body')

    // 6. Verify end screen choices appear
    // The text is "Souhaitez-vous évaluer votre spectre de l'Hypersensibilité ?"
    // We wait for the "OUI" button
    const ouiButton = page.getByRole('button', { name: 'OUI', exact: true })

    // The gradient animation takes some time (gradientSteps.length * 0.5s)
    // We use a generous timeout
    await expect(ouiButton).toBeVisible({ timeout: 30000 })

    // 7. Click "OUI" and verify questionnaire entry
    await ouiButton.click()

    const beginQuizButton = page.getByText('Commencer le questionnaire')
    await expect(beginQuizButton).toBeVisible({ timeout: 10000 })
  })
})
