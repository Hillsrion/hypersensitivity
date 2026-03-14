import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
  .remove('nuxt/javascript')
  .remove('nuxt/typescript/rules')
