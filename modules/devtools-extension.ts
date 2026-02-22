import { defineNuxtModule } from '@nuxt/kit'
import { addCustomTab } from '@nuxt/devtools-kit'

export default defineNuxtModule({
  meta: {
    name: 'game-devtools',
    configKey: 'gameDevtools'
  },
  setup(_options: any, nuxt: any) {
    if (!nuxt.options.dev) return

    // Add the custom tab to Nuxt DevTools
    addCustomTab({
      name: 'hypersensitivity-tools',
      title: 'Game Tools',
      icon: 'carbon:game-console',
      view: {
        type: 'iframe',
        src: '/game-tools-view'
      }
    })
  }
})
