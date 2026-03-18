import { expect, test } from '@playwright/test'

test.describe('Day Transition E2E', () => {
  test('should transition from Day 1 to Day 2', async ({ page }) => {
    // 1. Navigate to root with test=true to bypass loading
    await page.goto('/?test=true', { waitUntil: 'networkidle' })

    // Enable console logs for debugging store updates
    page.on('console', (msg) => console.log(`BROWSER: ${msg.text()}`))

    // 2. Skip to game area
    const skipToGameButton = page.getByText('Skip to Game')
    await expect(skipToGameButton).toBeVisible({ timeout: 15000 })
    await skipToGameButton.click()

    // 3. Jump to the last scene of Day 1
    const sceneSelect = page.locator('select')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(sceneSelect).toBeVisible({ timeout: 15000 })

    // Select a Day 1 end scene
    await sceneSelect.selectOption('dayOneEndGoodAssertComfort')

    // 4. Wait for the scene to load and the dialogue to appear
    // We can first wait for the entry annotation if present (dayOneEndGoodReflect doesn't have one in end.ts but others do)
    // Let's wait for the dialogue text: "J'suis fière de moi"
    const lastDialogueTextPartial = 'fière de moi'
    await expect(page.getByText(lastDialogueTextPartial).first()).toBeVisible({
      timeout: 20000,
    })

    // Click to advance - handleEndOfDialogues will be called
    await page.click('body')

    // 5. Verify Day 2 transition
    // Check for "JOUR 2" text
    await expect(page.getByText('JOUR 2').first()).toBeVisible({
      timeout: 20000,
    })

    // Check for Day 2 initial content (e.g., milestone annotation "Réveil")
    await expect(page.getByText('Réveil').first()).toBeVisible({
      timeout: 10000,
    })
  })
})
