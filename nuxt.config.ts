// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    baseURL: '/messenger/', 
    buildAssetsDir: 'assets', 
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  modules: [
    'nuxt-headlessui',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@pinia/nuxt'
  ]
})