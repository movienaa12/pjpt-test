export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'system',
    fallback: 'light'
  },
  runtimeConfig: {
    // Override in production with NUXT_SESSION_SECRET (at least 32 characters).
    sessionSecret: 'nuxt-role-auth-dev-secret-change-me-in-production'
  },
  app: {
    head: {
      title: 'Nuxt Role Auth',
      titleTemplate: '%s · Nuxt Role Auth',
      htmlAttrs: { lang: 'en' }
    }
  },
  typescript: {
    strict: true
  }
})
