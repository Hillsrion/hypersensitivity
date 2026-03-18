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

    // terminal scene is 'dayTwoMountain'
    await sceneSelect.selectOption('dayTwoMountain')

    // 4. Click through the dialogues to reach the end of the scene
    // We wait for the dialogue box to be visible first
    await page.waitForTimeout(2000) // Small buffer for scene load

    // There are 3 dialogues + 1 potential final click to trigger the end
    for (let i = 0; i < 4; i++) {
      // Click body to advance
      await page.click('body')
      // Wait a bit for the next dialogue or state to process
      await page.waitForTimeout(1000)
    }

    // Wait an additional buffer for the end screen animation (gradient) to trigger
    await page.waitForTimeout(5000)

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
