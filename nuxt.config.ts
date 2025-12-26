import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    'nuxt-split-type',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  googleFonts: {
    families: {
      // Add your fonts here, e.g.:
      // Inter: [400, 500, 600, 700],
    },
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})
