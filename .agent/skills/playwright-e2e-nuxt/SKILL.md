---
name: playwright-e2e-nuxt
description: Creating and maintaining Playwright E2E tests for Nuxt 4 applications with complex GSAP animations, text-splitting, and scroll locking (Lenis). Use when adding tests for loading sequences, interactive animations, or verifying scroll-driven states.
---

# Playwright E2E for Nuxt (GSAP + Lenis)

Expert guidance for writing robust E2E tests in the Hypersensitivity-v2 project.

## Workflow

### 1. Identify Component Timing & State

- **Analyze Animations**: Check GSAP timelines in `use[Feature]Animation.ts`. Note the total duration (including delays and staggers).
- **Check Store Interactions**: Identify which `animationsStore` flags are set at completion (e.g., `landing.intro.entry.completed`).
- **Determine Scroll Lock**: Check `app/app.vue` or component logic for when `lenis.stop()` and `lenis.start()` are called.

### 2. Set Up the Test

- **Bypass Overlays**: Use query parameters like `?test=true` if you need to skip the `LoadingSection`.
- **Mirror Console**: Always use `page.on('console', (msg) => console.log(\`BROWSER: \${msg.text()}\`))` to debug store updates and GSAP logs.
- **Execution**: Use `npx playwright test <path> --reporter=list` to avoid interactive hangs and get clear, sequential logs in the CLI.
- **Extend Timeouts**: Complex animations often exceed the default 30s timeout; use `test.setTimeout(60000)`.

### 3. Handle Common Nuxt/Animation Pitfalls

- **Text Splitting**: `split-type` creates multiple DOM elements for the same text. Use `.first()` and partial text matching (`page.getByText('substring').first()`) to avoid strict mode violations and resilience against character-level animations.
- **Scroll-Triggered UI**: Some UI (like DevTools options) only appears after a specific scroll position. Use `await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` to force visibility.
- **Scroll Verification**: Use `page.evaluate(() => window.scrollY)` or `window.lenis` to confirm scrolling is actually working or locked.
- **Wait for Completion**: Don't rely on `waitForLoadState`. Use `page.waitForTimeout()` (e.g., 2000ms) after major transitions to allow GSAP/Lenis and intersection observers to settle.

## Common Patterns

See [references/patterns.md](references/patterns.md) for reusable code snippets for scroll verification, DevTools shortcuts, and animation waiting.
