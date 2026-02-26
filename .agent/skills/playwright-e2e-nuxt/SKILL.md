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
- **Extend Timeouts**: Complex animations often exceed the default 30s timeout; use `test.setTimeout(60000)`.

### 3. Handle Common Nuxt/Animation Pitfalls

- **Text Splitting**: `split-type` creates multiple DOM elements for the same text. Use `.first()` or specific locators to avoid Playwright strict mode violations.
- **Scroll Verification**: Use `page.evaluate(() => window.scrollY)` or `window.lenis` to confirm scrolling is actually working or locked.
- **Wait for Completion**: Don't rely on `waitForLoadState`. Use `page.waitForTimeout()` based on researched GSAP durations, or wait for specific element visibility.

## Common Patterns

See [references/patterns.md](references/patterns.md) for reusable code snippets for scroll verification, DevTools shortcuts, and animation waiting.
