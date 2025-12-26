import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    'nuxt-split-type',
    '@hypernym/nuxt-gsap',
  ],

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
  compatibilityDate: '2024-04-03',
})
