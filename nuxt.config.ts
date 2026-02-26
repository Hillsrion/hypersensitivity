import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@hypernym/nuxt-gsap',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '~/modules/devtools-extension.ts',
  ],

  gsap: {
    extraPlugins: {
      scrollTrigger: true,
      scrollTo: true,
    },
  },

  css: ['~/assets/css/main.css'],

  alias: {
    '~': fileURLToPath(new URL('./', import.meta.url)),
    '@': fileURLToPath(new URL('./', import.meta.url)),
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/.worktrees/**'],
      },
    },
  },

  googleFonts: {
    families: {
      Epilogue: [400, 500, 600],
    },
  },

  components: [
    {
      path: '~/app/components/ui',
      pathPrefix: false,
    },
    '~/app/components',
  ],

  imports: {
    dirs: ['composables/game', 'composables/hsp', 'composables/ui'],
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        allowImportingTsExtensions: true,
        noEmit: true,
      },
    },
  },

  compatibilityDate: '2025-02-14',
})
