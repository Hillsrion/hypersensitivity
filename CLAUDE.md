# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

This is a Nuxt 4 content-driven website with animation capabilities.

### Tech Stack

- **Nuxt 4** with Vue 3 Composition API (+ Vue 3.5 `useTemplateRef`)
- **Tailwind CSS v4** via Vite plugin with fluid-tailwindcss
- **@hypernym/nuxt-gsap** for GSAP animations
- **nuxt-split-type** for text splitting animations
- **Testing**: Vitest (Unit/Integration), Playwright (E2E)
- **Quality**: ESLint, Prettier (with auto-sort imports)
- **Typography**: Epilogue (Google Fonts - 400, 500, 600), Satoshi Regular (custom - 400), PP Eiko Thin (custom - 100)

### Project Structure

- `app/` - Nuxt application (components, composables, stores, pages)
- `plugins/` - Nuxt plugins
- `assets/css/` - Tailwind entry point
- `tests/` - Vitest and Playwright test suites
- `docs/` - Project documentation

### Key Patterns

**Auto-imports**: Nuxt automatically imports Vue APIs and all composables/stores in `app/`. **DO NOT** import them manually.

**Template Refs**: Use Vue 3.5 `useTemplateRef()` for DOM elements.

**GSAP Usage**: Access via explicit import from Nuxt app instance or use domain-specific animation composables.

**SplitType Usage**: Use the `useSplitText` composable for text animations.

**Fluid Tailwind**: Use `fl-` utilities for responsive scaling (e.g., `fl-text-2xl/5xl`).

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

## Testing & Quality

- **Linting**: ESLint + Prettier.
- **Unit/Integration**: `pnpm test` (Vitest).
- **End-to-End**: `pnpm test:e2e` (Playwright). Use `?test=true` query param to bypass the `LoadingSection`.
- **Pre-commit**: Husky ensures code is formatted before committing.
