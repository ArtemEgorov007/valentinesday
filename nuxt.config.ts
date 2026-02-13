export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
    '/quest': { prerender: true }
  },

  sourcemap: {
    client: false,
    server: false
  },

  experimental: {
    appManifest: false
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    preset: 'github_pages',
    prerender: {
      routes: ['/', '/quest']
    }
  },

  vite: {
    css: {
      devSourcemap: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
