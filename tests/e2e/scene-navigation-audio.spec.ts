import { expect, test } from '@playwright/test'

test.describe('Scene Navigation & Audio E2E', () => {
  test('should load correct scene content and audio when jumping and advancing', async ({
    page,
  }) => {
    // 1. Navigate and bypass loading
    await page.goto('/?test=true', { waitUntil: 'networkidle' })

    // Track audio play events from the console
    const audioPlays: string[] = []
    page.on('console', (msg) => {
      const text = msg.text()
      console.log(`BROWSER: ${text}`)
      if (text.includes('Starting new audio:')) {
        audioPlays.push(text.split('Starting new audio:')[1].trim())
      }
    })

    // 2. Skip to game area
    const skipToGameButton = page.getByText('Skip to Game')
    await expect(skipToGameButton).toBeVisible({ timeout: 15000 })
    await skipToGameButton.click()

    // 3. Jump to a specific scene (Day 1 - Bathroom)
    const sceneSelect = page.locator('select')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(sceneSelect).toBeVisible({ timeout: 15000 })

    // Jump to bathroom (dayOneBathroom)
    await sceneSelect.selectOption('dayOneBathroom')

    // 4. Verify scene content and initial audio
    // The dialogue in dayOneBathroom starts with "OK, alors soit la robe qui me serre..."
    await expect(
      page.getByText('soit la robe qui me serre').first()
    ).toBeVisible({ timeout: 20000 })

    // Check if the correct audio for J01_C01_Tenue_base.mp3 was triggered
    // We check if any of the collected logs contains the expected audio path
    expect(
      audioPlays.some((a) => a.includes('J01_C01_Tenue_base.mp3'))
    ).toBeTruthy()

    // 5. Select a choice to move to the next scene (TENUE CONFORT)
    const comfortChoice = page.getByText('TENUE CONFORT')
    await expect(comfortChoice).toBeVisible({ timeout: 15000 })
    await comfortChoice.click()

    // 6. Verify transition to Day 1 Outfit Comfort and new audio
    // Dialogue: "autant être confort"
    await expect(page.getByText('autant être confort').first()).toBeVisible({
      timeout: 15000,
    })

    // Check if the audio for J01_C01_TenueB.mp3 was triggered
    // It should be the last audio triggered
    expect(audioPlays[audioPlays.length - 1]).toContain('J01_C01_TenueB.mp3')
  })
})
