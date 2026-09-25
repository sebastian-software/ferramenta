import { ardo } from "ardo/vite";
import { defineConfig } from "vite";

import { SITE_DESCRIPTION } from "./app/site-metadata";

export default defineConfig({
  // Ardo uses lucide-react internally; bundle it during prerender so module
  // resolution never escapes this workspace (dual-React hazard in worktrees).
  ssr: { noExternal: ["lucide-react"] },
  plugins: [
    ardo({
      title: "Ferramenta",
      description: SITE_DESCRIPTION,
      siteUrl: "https://ferramenta.dev",
      linkCheck: { level: "error" },
      metadata: {
        image: "/social.png",
        ogType: "website",
        twitterCard: "summary_large_image",
      },

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
});
