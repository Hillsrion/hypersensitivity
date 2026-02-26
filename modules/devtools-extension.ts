import { addCustomTab } from '@nuxt/devtools-kit'
import { defineNuxtModule } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export default defineNuxtModule({
  meta: {
    name: 'game-devtools',
    configKey: 'gameDevtools',
  },
  setup(_options: Record<string, never>, nuxt: Nuxt) {
    if (!nuxt.options.dev) return

    // Add the custom tab to Nuxt DevTools
    addCustomTab({
      name: 'hypersensitivity-tools',
      title: 'Game Tools',
      icon: 'carbon:game-console',
      view: {
        type: 'iframe',
        src: '/game-tools-view',
      },
    })
  },
})
