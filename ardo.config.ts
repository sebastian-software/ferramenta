import { defineArdoConfig } from "ardo/config";

import { SITE_DESCRIPTION } from "./app/site-metadata.ts";

export default defineArdoConfig({
  title: "Ferramenta",
  description: SITE_DESCRIPTION,
  siteUrl: "https://ferramenta.dev",
  seo: { sitemap: { exclude: ["/kit"] } },
  icons: false,
  linkCheck: { level: "error" },
  metadata: {
    image: "/social.png",
    ogType: "website",
    twitterCard: "summary_large_image",
  },
});
