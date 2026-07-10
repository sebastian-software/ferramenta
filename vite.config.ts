import { defineConfig } from "vite"
import { ardo } from "ardo/vite"

export default defineConfig({
  plugins: [
    ardo({
      title: "Ferramenta",
      description: "Rust-native developer tools with the APIs you already know",

      // Custom domain (ferramenta.dev) — no /repo-name/ base path
      githubPages: false,
    }),
  ],
})
