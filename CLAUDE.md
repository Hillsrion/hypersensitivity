# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server on localhost:3000
pnpm build      # Production build
pnpm generate   # Static site generation
pnpm preview    # Preview production build
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
- **Nuxt 4** with Vue 3 Composition API
- **@nuxt/content v3** for Markdown-based content management
- **Tailwind CSS v4** via Vite plugin with fluid-tailwindcss
- **@hypernym/nuxt-gsap** for GSAP animations
- **nuxt-split-type** for text splitting animations
- **Typography**: Epilogue (Google Fonts - 400, 500, 600), Satoshi Regular (custom - 400), PP Eiko Thin (custom - 100)

### Project Structure
- `app/` - Nuxt application (pages, components, app.vue)
- `content/` - Markdown content files with YAML frontmatter
- `plugins/` - Nuxt plugins
- `assets/css/` - Tailwind entry point

### Key Patterns

**Content Pages**: The catch-all route `app/pages/[...slug].vue` renders all content from `content/` directory using ContentRenderer.

**GSAP Usage**: Access via explicit import from Nuxt app instance:
```ts
const { $gsap } = useNuxtApp()
```

**SplitType Usage**: Use the composable for text animations:
```ts
const el = ref<HTMLElement>()
const { chars, words, lines } = useSplitText(el, { splitBy: 'lines, words, chars' })
```

**Content Components**: Markdown files support inline Vue components using `::component-name` syntax.

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

**Configuration** (in CSS file):
```css
@plugin "fluid-tailwindcss" {
  minViewport: 375;   /* Default: 375px */
  maxViewport: 1440;  /* Default: 1440px */
}
```
