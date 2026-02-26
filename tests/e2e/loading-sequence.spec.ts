import { test, expect } from '@playwright/test'

test.describe('Loading Sequence E2E', () => {
  test('should go through loading section, intro animation and then allow scrolling', async ({
    page,
  }) => {
    // Extend timeout as the intro animation is ~16 seconds
    test.setTimeout(60000)

    // Enable console log mirroring
    page.on('console', (msg) => console.log(`BROWSER: ${msg.text()}`))

    // 1. Navigate to the root
    await page.goto('/')

    // 2. Wait for the LoadingSection button to be visible
    // The button has the text "Cliquer pour écouter"
    const startButton = page.getByText('Cliquer pour écouter')
    await expect(startButton).toBeVisible({ timeout: 15000 })

    // 3. Verify scrolling is locked initially
    // We can check if lenis is stopped
    await page.evaluate(() => {
      // @ts-expect-error: window.lenis is exposed in dev mode
      return window.lenis && !window.lenis.isStopped
    })
    // Note: Initially lenis should be stopped, so isStopped would be true, !isStopped false.
    // However, window.lenis might not be ready yet.

    // Alternatively, try to scroll and see if it moves
    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(500)
    const scrollYInitial = await page.evaluate(() => window.scrollY)
    expect(scrollYInitial).toBe(0)

    // 4. Click the button to start the intro
    await startButton.click()

    // 5. Verify the MainTitle disappears and SoundIntroduction appears
    // The MainTitle text is "Hypersensibles"
    await expect(
      page.getByRole('heading', { name: 'Hypersensibles' })
    ).not.toBeVisible({ timeout: 5000 })

    // SoundIntroduction content
    const introText = "L'hypersensibilité est un trait de caractère inné"
    await expect(page.getByText(introText)).toBeVisible({ timeout: 5000 })

    // 6. Wait for the animation to complete
    // The animation takes ~16s based on timings.
    // We wait for animations.landing.intro.entry.completed to be true.
    // We can't easily access the store from outside without exposing it,
    // but we know that when it's completed, scrolling is enabled.

    console.log('Waiting for intro animation to complete...')
    // We wait for about 18 seconds to be sure (16s audio + initial fades)
    await page.waitForTimeout(18000)

    // 7. Verify scrolling is now possible
    // We try to scroll down
    await page.mouse.wheel(0, 1000)
    await page.waitForTimeout(1000) // Wait for scroll to happen

    const scrollYFinal = await page.evaluate(() => window.scrollY)
    console.log(`Scroll Y after animation: ${scrollYFinal}`)

    expect(scrollYFinal).toBeGreaterThan(0)

    // We should also be able to see the first generic section
    // Use .first() because the split-text animation creates multiple instances of the text
    await expect(
      page.getByText('Paralysie décisionnelle et surcharge cognitive').first()
    ).toBeVisible()
  })
})
