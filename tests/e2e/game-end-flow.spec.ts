import { expect, test } from '@playwright/test'

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

    // 4. Click to clear the final dialogue (whatever it is)
    // We wait for the dialogue box to be visible first
    await page.waitForTimeout(2000) // Small buffer for scene load
    await page.click('body')

    // 5. Verify end screen choices appear
    // The text is "Souhaitez-vous évaluer votre spectre de l'Hypersensibilité ?"
    await expect(
      page.getByText("évaluer votre spectre de l'Hypersensibilité")
    ).toBeVisible({ timeout: 30000 })

    // Check for both choices
    const ouiButton = page.getByRole('button', { name: 'OUI', exact: true })
    const nonButton = page.getByRole('button', { name: 'NON', exact: true })

    await expect(ouiButton).toBeVisible()
    await expect(nonButton).toBeVisible()

    // 6. Click "OUI" and verify questionnaire entry
    await ouiButton.click()

    const beginQuizButton = page.getByText('Commencer le questionnaire')
    await expect(beginQuizButton).toBeVisible({ timeout: 15000 })
  })
})
