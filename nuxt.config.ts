// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/ionic"],
  css: ["@/theme/variables.css"],
  nitro: {
    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      },
    },
  },
  devServer: {
    port: 3000,
  },
  app: {
    head: {
      title: "Settle This!",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "msapplication-TileColor", content: "#2b5797" },
        { name: "theme-color", content: "#ffffff" },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
      ],
    },
  },
});
