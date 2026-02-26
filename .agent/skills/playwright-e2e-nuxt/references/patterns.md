# Playwright E2E Patterns for Hypersensitivity-v2

Common patterns for this project's Nuxt 4, GSAP, and Lenis setup.

## 1. Scroll Verification & Triggering

Verify scrolling is locked, enabled, or force a trigger for intersection observers.

```typescript
// Initial scroll check (should be 0 if locked)
await page.mouse.wheel(0, 500)
await page.waitForTimeout(500)
expect(await page.evaluate(() => window.scrollY)).toBe(0)

// Force scroll to bottom to trigger intersection observers (DevTools options, etc.)
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(2000) // Allow time for observers to fire

// Final scroll check (should move after animation)
await page.mouse.wheel(0, 1000)
await page.waitForTimeout(1000)
expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
```

## 2. Robust Text Matching (GSAP & Split-Type)

Use substrings and `.first()` to handle complex animations and multiple DOM nodes.

```typescript
// Partial match + .first() is more resilient to split-text/GSAP layers
const partialText = 'autant être confort'
await expect(page.getByText(partialText).first()).toBeVisible({
  timeout: 15000,
})
```

## 3. GSAP Animation Waiting

Wait for animations based on timings in `app/data/timings/*.json`.

```typescript
// Example: Alix Intro is ~16 seconds
console.log('Waiting for intro animation to complete...')
await page.waitForTimeout(18000) // 16s audio + initial fades
```

## 4. Bypassing Loading via Query Params

Components often check `route.query.test`.

```typescript
await page.goto('/?test=true', { waitUntil: 'networkidle' })
```

## 5. DevTools Shortcuts

Use existing DevTools buttons to skip parts of the test.

```typescript
// Skip intro or jump to game end
await page.getByText('Skip Intro').click()
await page.getByText('Skip to Game').click()
await page.getByText('Skip to End').click()
```
