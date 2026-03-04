# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server on localhost:3000
pnpm build      # Production build
pnpm generate   # Static site generation
pnpm preview    # Preview production build
pnpm test       # Run unit/integration tests (Vitest)
pnpm test:e2e   # Run E2E tests (Playwright)
pnpm format     # Format code with Prettier
```

## Git Conventions

This project uses **Conventional Commits** for commit messages.

**Format**: `<type>(<scope>): <subject>`

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting (no functional changes)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Build process, tooling, dependencies

**Examples**:

```bash
feat(animations): add scroll-triggered fade-in effect
fix(content): resolve markdown rendering issue
docs(readme): update installation instructions
refactor(components): simplify header navigation logic
```

## Architecture

This is a Nuxt 4 data-driven website with animation capabilities.

### Tech Stack

- **Nuxt 4** with Vue 3 Composition API (+ Vue 3.5 `useTemplateRef`)
- **Tailwind CSS v4** via Vite plugin with fluid-tailwindcss
- **@hypernym/nuxt-gsap** for GSAP animations
- **nuxt-split-type** for text splitting animations
- **Testing**: Vitest (Unit/Integration), Playwright (E2E)
- **Quality**: ESLint, Prettier (with auto-sort imports)
- **Typography**: Epilogue (Google Fonts - 400, 500, 600), Satoshi Regular (custom - 400), PP Eiko Thin (custom - 100)

### Project Structure

- `app/` - Nuxt application (components in `ui/`, `game/`, `hsp/`; composables grouped by domain; stores)
- `plugins/` - Nuxt plugins
- `assets/css/` - Tailwind entry point

**Domain-Driven Organization**: Composables and components are organized by domain (e.g., `game/`, `hsp/`, `ui/`) rather than by technical type.

**Template Refs**: Always use Vue 3.5's `useTemplateRef()` for DOM elements instead of standard `ref()` calls.

**Auto-imports**: Nuxt automatically imports Vue APIs (like `ref`, `computed`, `onMounted`, `nextTick`, etc.) and all composables in `app/composables`. **DO NOT** import them manually. This applies to both Vue core and local composables.

**TypeScript Types**: Prefer using `type` aliases for object definitions instead of `interface`. The only exception is in `app/types/global.d.ts` where `interface` is required for global type augmentation.

**Typography**: Custom fonts are configured via `@theme` in CSS:

```html
<!-- Epilogue (Google Fonts) -->
<h1 class="font-epilogue font-medium">Heading</h1>

<!-- Satoshi Regular -->
<p class="font-sans">Body text</p>

<!-- PP Eiko Thin -->
<h2 class="font-eiko font-thin">Display heading</h2>
```

### Fluid Tailwind CSS

Uses `fluid-tailwindcss` for responsive sizing with CSS `clamp()`. Configured via `@plugin` directive in CSS.

**Syntax**: `fl-{utility}-{min}/{max}`

```html
<!-- Fluid font-size from 2xl to 5xl -->
<h1 class="fl-text-2xl/5xl">Heading</h1>

<!-- Fluid padding from 4 to 8 -->
<div class="fl-p-4/8">Content</div>

<!-- Fluid gap from 4 to 8 -->
<div class="fl-gap-4/8">Grid</div>
```

**Supported Utilities**:

- **Spacing**: `fl-p`, `fl-px`, `fl-py`, `fl-pt/r/b/l`, `fl-m`, `fl-mx`, `fl-my`, `fl-mt/r/b/l`
- **Typography**: `fl-text`, `fl-leading`, `fl-tracking`
- **Sizing**: `fl-w`, `fl-h`, `fl-size`, `fl-min-w`, `fl-max-w`, `fl-min-h`, `fl-max-h`
- **Layout**: `fl-gap`, `fl-gap-x`, `fl-gap-y`, `fl-inset`, `fl-top/right/bottom/left`, `fl-space-x`, `fl-space-y`
- **Border**: `fl-rounded`, `fl-rounded-t/r/b/l`, `fl-rounded-tl/tr/br/bl`, `fl-border`
- **Transform**: `fl-translate-x`, `fl-translate-y`

## Testing

New features **must** include tests.

- **Unit/Integration**: Powered by **Vitest**. Tests are in `tests/` and use TypeScript.
- **E2E**: Powered by **Playwright**. Tests are in `tests/e2e/`.
  - Use `?test=true` query param to bypass the `LoadingSection` during development/testing.
  - Verification includes: loading sequences, scene transitions, audio state, and game logic.

## Mobile Optimization

- **GSAP Animations**: Optimize for mobile by reducing DOM nodes (e.g., dynamic title counts in `GenericSection`) and using `will-change: transform`.
- **Typography**: Sections support a `compact` mode (via `isCompact` or similar props) to improve readability on smaller screens.
- **Responsive Layouts**: Use fluid-tailwindcss `fl-` utilities for smooth scaling between 375px and 1440px.
