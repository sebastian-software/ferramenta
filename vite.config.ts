import { defineConfig } from "vite"
import { ardo } from "ardo/vite"

export default defineConfig({
  // Ardo uses lucide-react internally; bundle it during prerender so module
  // resolution never escapes this workspace (dual-React hazard in worktrees).
  ssr: { noExternal: ["lucide-react"] },
  plugins: [
    ardo({
      title: "Ferramenta",
      description:
        "Rust-native developer tools that keep the APIs you already know — held to the originals by differential testing.",
      siteUrl: "https://ferramenta.dev",

      // Toolbox mark (duotone, baked brand colors) — also the favicon source
      brand: {
        logo: {
          light: "./app/assets/brand/logo-light.svg",
          dark: "./app/assets/brand/logo-dark.svg",
        },
      },

      // Custom domain (ferramenta.dev) — no /repo-name/ base path
      githubPages: false,
    }),
  ],
})
