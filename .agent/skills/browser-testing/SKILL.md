---
name: Browser Testing
description: How to efficiently test the Hypersensitivity site using the browser tool, including DevTools shortcuts to skip animations and reach specific sections quickly.
---

# Browser Testing Skill

This skill explains how to test the Hypersensitivity website using the browser subagent tool. The site is heavily animated with GSAP scroll-triggered animations, which makes testing tricky because you need to wait for and navigate through long animation sequences.

## Dev Server

The dev server runs at **`http://localhost:3000`** (started via `pnpm run dev`).

## Page Structure & Scroll Positions

The page is a single long-scroll experience with these sections from top to bottom:

| Section               | DOM ID                     | Approximate Scroll Position                                              |
| --------------------- | -------------------------- | ------------------------------------------------------------------------ |
| Loading / Title       | —                          | 0px (top)                                                                |
| Sound Introduction    | —                          | ~1 viewport height                                                       |
| Generic Sections (×4) | `section-0` to `section-3` | ~2000px – 8000px (each is `400svh` tall due to scroll-triggered pinning) |
| Testimonies           | `#testimonies`             | After all generic sections                                               |
| Experience (Game)     | `#experience`              | Near bottom, after testimonies                                           |
| HSP Questionnaire     | `#hsp-questionnaire`       | Teleported overlay (conditionally rendered)                              |

> [!IMPORTANT]
> Generic sections use **GSAP ScrollTrigger pinning** with `end: '+=400%'`. Each section takes ~4× viewport heights of scrolling to complete its animation. Quick scrolls or `window.scrollTo` may skip animations entirely. Use **smooth scrolling** over 2-3 seconds to let ScrollTrigger process the animation.

## DevTools Panel

The site has a **DevTools panel** in dev mode, visible as a dark floating panel in the **bottom-right corner**. If minimized, it appears as a small circular button with a wrench icon — click it to expand.

### Available Actions

#### Intro Controls (visible when above the Experience section)

| Button           | Effect                                                                              | When to use                                                        |
| ---------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Skip Intro**   | Skips all loading/title/intro animations. Sets background to white, cursor to dark. | **Always use this first** to save ~10 seconds of animation loading |
| **Reset Intro**  | Resets game state and scrolls back to top. Unlocks scroll.                          | To test intro animations from scratch                              |
| **Skip to Game** | Marks intro as played, scrolls to Experience section bottom, locks scroll.          | To jump directly into the interactive game                         |
| **Skip to End**  | Jumps to the final game scene                                                       | To test end-game UI                                                |

#### Experience Controls (visible when near or past Experience section)

| Control                    | Effect                                                                   |
| -------------------------- | ------------------------------------------------------------------------ |
| **Speed slider**           | Adjusts GSAP global timeline speed (0.1× to 5×). Affects all animations. |
| **Force UI toggle**        | Forces game UI elements to stay visible regardless of animation state    |
| **Jump to Scene** dropdown | Jumps to any specific game scene with correct flags auto-resolved        |

### Scroll Controls

| Button                 | Effect                                          |
| ---------------------- | ----------------------------------------------- |
| **Scroll Top (XP)**    | Scrolls to the top of the Experience section    |
| **Scroll Bottom (XP)** | Scrolls to the bottom of the Experience section |

## Testing Recipes

### Recipe 1: Test a Generic Section (e.g., first section with "red" aurora)

```
1. Navigate to http://localhost:3000
2. Wait 2 seconds for page load
3. Click "Skip Intro" in DevTools panel
4. Wait 1 second
5. Scroll smoothly to 3200px over 3 seconds:
   window.scrollTo({ top: 3200, behavior: 'smooth' })
6. Wait 3 seconds for ScrollTrigger animation to process
7. Observe/screenshot the aurora and section animation
```

> [!TIP]
> Each of the 4 generic sections needs ~4 viewport heights of scroll to complete. To reach section N, you need roughly `N × 4 × viewportHeight` pixels of scroll from the intro end.

### Recipe 2: Test the Game Experience

```
1. Navigate to http://localhost:3000
2. Wait 2 seconds
3. Click "Skip Intro" in DevTools
4. Click "Skip to Game" in DevTools
5. Wait 1 second
6. The game UI should now be visible with dialogue text and choices
```

### Recipe 3: Test HSP Questionnaire

```
1. Follow Recipe 2 to get into the game
2. Click "Skip to End" in DevTools
3. The questionnaire overlay should appear
4. Use DevTools "Passer directement à la fin" button to skip questions
```

### Recipe 4: Test a Specific Game Scene

```
1. Follow Recipe 2 to get into the game
2. Use the "Jump to Scene" dropdown in DevTools
3. Select the desired scene — flags are auto-resolved
```

## Smooth Scrolling via JavaScript

The site uses **Lenis** for smooth scrolling. To scroll programmatically:

```javascript
// Option A: Native smooth scroll (works, but Lenis may interfere)
window.scrollTo({ top: 3200, behavior: 'smooth' })

// Option B: Use Lenis directly (more reliable)
window.lenis.scrollTo(3200, { duration: 3 })

// Option C: Instant scroll (skips all ScrollTrigger animations)
window.lenis.scrollTo(3200, { immediate: true })
```

> [!WARNING]
> Using `immediate: true` or `behavior: 'instant'` will **skip ScrollTrigger animations** entirely. The pinned sections won't animate. Only use instant scroll to jump past sections you don't need to test.

## Timing: Read the Source Code

> [!IMPORTANT]
> **Do NOT rely on hardcoded wait times.** Animation durations change frequently. Instead, read the relevant source files to determine how long to wait.

### Where to find animation durations

| What you need to know            | Where to look                                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Aurora opacity fade duration     | `app/components/BackgroundGradient.vue` — look for `transition-opacity duration-*` CSS class on the aurora wrapper div |
| Aurora color transition duration | `app/composables/useAuroraAnimation.ts` — look for `duration` in `$gsap.to()` calls in the color watcher               |
| ScrollTrigger scrub delay        | `app/composables/useGenericSectionAnimation.ts` — look for `scrub:` value in the ScrollTrigger config                  |
| ScrollTrigger pin length         | Same file — look for `end: '+=...'` in ScrollTrigger config                                                            |
| Background gradient animation    | `app/composables/useBackgroundGradient.ts` — look for `duration` in the `animate()` and `animateToWhite()` functions   |
| Game scene transitions           | `app/composables/game/useDialogueAnimation.ts` — look for GSAP timeline durations                                      |
| Intro animation sequence         | `app/composables/useSoundIntroAnimation.ts` — look for timeline durations                                              |

### How to determine wait times

Before writing any `wait` call in a browser test:

1. **Identify which animation is running** at the point you need to wait
2. **Open the corresponding source file** from the table above
3. **Find the `duration` value** in the GSAP timeline or CSS transition class
4. **Add a small buffer** (e.g., +500ms) to account for rendering and scheduling delays
5. For CSS transitions, convert Tailwind classes: `duration-1000` = 1 second, `duration-500` = 0.5 seconds

### General safe minimums

- **After page navigation**: 2 seconds (hydration + initial render)
- **After clicking a DevTools button**: 1 second (state propagation + any triggered animations)
- **After smooth scroll**: duration depends on distance, check scroll behavior in the test

## Background & Aurora System

The aurora is a blurred gradient overlay controlled by the `animationsStore`:

- **Visibility**: toggled via CSS classes `visible opacity-100` / `invisible opacity-0` with 1s CSS transition
- **Color**: set via CSS custom properties `--aurora-color-1` and `--aurora-color-2`
- **During intro sections**: controlled by `useGenericSectionAnimation`
- **During game**: controlled by `useDialogueAurora`
- Colors: `red`, `pink`, `blue`, `green`, `yellow`, `violet`, `rainbow`
