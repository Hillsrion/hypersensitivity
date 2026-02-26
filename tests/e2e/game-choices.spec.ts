import { test, expect } from '@playwright/test'

test.describe('Game Choices E2E', () => {
  test('should skip to game, select a choice and see the next part of the story', async ({
    page,
  }) => {
    // 1. Navigate to the root with test=true to bypass LoadingSection
    // Wait for networkidle to ensure Nuxt hydration is complete
    await page.goto('/?test=true', { waitUntil: 'networkidle' })

    // Enable console log mirroring for easier debugging
    page.on('console', (msg) => console.log(`BROWSER: ${msg.text()}`))

    // 2. Use DevTools buttons to ensure correct state
    // We click "Skip Intro" first to set all animation flags
    const skipIntroButton = page.getByText('Skip Intro')
    await expect(skipIntroButton).toBeVisible({ timeout: 20000 })
    await skipIntroButton.click()

    // Then click "Skip to Game" to scroll down and unlock experience options
    const skipToGameButton = page.getByText('Skip to Game')
    await expect(skipToGameButton).toBeVisible()
    await skipToGameButton.click()

    // 3. Jump to the bathroom scene where choices are present
    // The select appears when showExperienceOptions is true (which depends on scroll position)
    // We force a scroll to the bottom to be absolutely sure the intersection logic is triggered
    // And we wait a bit for the scroll and state updates to happen
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(2000)

    // Use locator('select') since there's no proper label-for relationship
    const sceneSelect = page.locator('select')
    await expect(sceneSelect).toBeVisible({ timeout: 20000 })

    // The value for DAY_ONE_BATHROOM is 'dayOneBathroom'
    await sceneSelect.selectOption('dayOneBathroom')

    // 4. Wait for the dialogue to finish so choices appear
    // The dialogue in dayOneBathroom starts with: "OK, alors soit la robe qui me serre..."

    // We wait for the choice button "TENUE CONFORT" to be visible
    const comfortChoice = page.getByText('TENUE CONFORT')
    // Increased timeout because dialogue must be displayed before choices show up
    // Also, there's an entry annotation delay.
    await expect(comfortChoice).toBeVisible({ timeout: 25000 })

    // 5. Click the choice
    await comfortChoice.click()

    // 6. Verify the story continues to dayOneOutfitComfort
    // The dialogue for dayOneOutfitComfort is:
    // "déjà que j'ai c'te réu de deux heures trente qui va me faire mal à la tête, autant être confort."
    // We use a substring and .first() to be resilient to split-text animations
    const nextDialoguePartial = 'autant être confort'
    await expect(page.getByText(nextDialoguePartial).first()).toBeVisible({
      timeout: 20000,
    })
  })
})
