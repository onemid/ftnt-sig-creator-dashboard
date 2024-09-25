// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-monaco-editor'
  ],

  build: {
    transpile: ['nuxt-monaco-editor']
  },
  vite: {

    ssr: { // if ssr enabled in future, this config is required to load vuetify properly
      noExternal: ['nuxt-monaco-editor']
    }
  },

  ui: {
    safelistColors: ['primary', 'red', 'orange', 'green']
  },

  colorMode: {
    disableTransition: true
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/': { prerender: true }
  },

  devtools: {
    enabled: true
  },

  typescript: {
    strict: false
  },

  future: {
    compatibilityVersion: 4
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  compatibilityDate: '2024-07-11'
})
