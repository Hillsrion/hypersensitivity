import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@hypernym/nuxt-gsap',
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
  },

  googleFonts: {
    families: {
      Epilogue: [400, 500, 600],
    },
  },

  devtools: { enabled: true },
  compatibilityDate: '2025-02-14',
})
