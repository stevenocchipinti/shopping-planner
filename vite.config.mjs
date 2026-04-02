import { defineConfig } from "vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    react(),
    VitePWA({
      injectRegister: "script",
      registerType: "autoUpdate",
      includeAssets: [
        "apple-touch-icon.png",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon.ico",
        "safari-pinned-tab.svg",
      ],
      manifest: {
        name: "Shopping Planner",
        short_name: "Shopping Planner",
        description: "A simple shopping list and weekly planner",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f7f3ed",
        theme_color: "#5a8a68",
        icons: [
          {
            src: "/android-chrome-192x192.png?v=qA3LYlAv89",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png?v=qA3LYlAv89",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/apple-touch-icon.png?v=qA3LYlAv89",
            sizes: "180x180",
            type: "image/png",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
})
