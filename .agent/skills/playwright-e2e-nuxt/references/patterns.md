# Playwright E2E Patterns for Hypersensitivity-v2

Common patterns for this project's Nuxt 4, GSAP, and Lenis setup.

## 1. Scroll Verification

Verify scrolling is locked or enabled.

```typescript
// Initial scroll check (should be 0 if locked)
await page.mouse.wheel(0, 500)
await page.waitForTimeout(500)
expect(await page.evaluate(() => window.scrollY)).toBe(0)

// Final scroll check (should move after animation)
await page.mouse.wheel(0, 1000)
await page.waitForTimeout(1000)
expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
```

## 2. GSAP Animation Waiting

Wait for animations based on timings in `app/data/timings/*.json`.

```typescript
// Example: Alix Intro is ~16 seconds
console.log('Waiting for intro animation to complete...')
await page.waitForTimeout(18000) // 16s audio + initial fades
```

## 3. Handling Text-Splitting (Strict Mode)

`split-type` creates multiple elements. Use `.first()` to target the primary instance.

```typescript
// Fails with "resolved to 10 elements" without .first()
await expect(
  page.getByText('Paralysie décisionnelle et surcharge cognitive').first()
).toBeVisible()
```

## 4. Bypassing Loading via Query Params

Components often check `route.query.test`.

```typescript
await page.goto('/?test=true')
```

## 5. DevTools Shortcuts

Use existing DevTools buttons to skip parts of the test.

```typescript
// Skip intro or jump to game end
await page.getByText('Skip Intro').click()
await page.getByText('Skip to Game').click()
await page.getByText('Skip to End').click()
```
