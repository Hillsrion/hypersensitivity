import { expect, test } from '@playwright/test'

test.describe('Game Menu E2E', () => {
  test('should open/close menu, show milestones and perform bottom actions', async ({
    page,
  }) => {
    // 1. Navigate to root with test=true to bypass loading
    await page.goto('/?test=true', { waitUntil: 'networkidle' })

    // Enable console logs for debugging store updates
    page.on('console', (msg) => console.log(`BROWSER: ${msg.text()}`))

    // 2. Skip to game area
    const skipToGameButton = page.getByText('Skip to Game')
    await expect(skipToGameButton).toBeVisible({ timeout: 15000 })
    await skipToGameButton.click()

    // 3. Open the menu
    // The MenuIcon is inside a button in GameContainer
    // It's visible when showDelayedGameUI is true
    const menuToggle = page.getByLabel('Menu')
    await expect(menuToggle).toBeVisible({ timeout: 10000 })
    await menuToggle.click()

    // 4. Verify menu content
    // Check for milestones (in Dev mode, all are visible)
    await expect(page.getByText('Réveil').first()).toBeVisible({
      timeout: 5000,
    })
    await expect(page.getByText('Trajet').first()).toBeVisible()
    await expect(page.getByText('Bureau').first()).toBeVisible()

    // 5. Test "RECOMMENCER LE JEU"
    const resetGameButton = page.getByText('RECOMMENCER LE JEU')
    await expect(resetGameButton).toBeVisible()
    await resetGameButton.click()

    // After reset, we expect to be back to the initial game state
    // Check if the first dialogue or title is visible again
    await expect(page.getByText('JOUR 1').first()).toBeVisible({
      timeout: 10000,
    })

    // 6. Test "TEST DU SPECTRE DE L'HYPERSENSIBILITÉ"
    // Open menu again
    await expect(menuToggle).toBeVisible()
    await menuToggle.click()

    const startQuizButton = page.getByText(
      "TEST DU SPECTRE DE L'HYPERSENSIBILITÉ"
    )
    await expect(startQuizButton).toBeVisible()
    await startQuizButton.click()

    // Verify questionnaire entry (after QUESTIONNAIRE_ENTRY_DELAY_MS + HSP_QUESTIONNAIRE_CONTENT_READY_DELAY_MS)
    // The HSPQuestionnaire component has a "Commencer le questionnaire" button
    const beginQuizButton = page.getByText('Commencer le questionnaire')
    await expect(beginQuizButton).toBeVisible({ timeout: 10000 })
  })
})
