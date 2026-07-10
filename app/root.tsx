import {
  ArdoErrorBoundary,
  ArdoRootLayout,
  ArdoRoot,
  ArdoFooter,
  ArdoHeader,
  ArdoHeaderActions,
  ArdoSocialLink,
} from "ardo/ui"
import { FamilyLinks } from "@ferramenta/ardo-config"
import config from "virtual:ardo/config"
import type { MetaFunction } from "react-router"
import "ardo/ui/styles.css"
import "@ferramenta/ardo-config/theme.css"

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native developer tools" },
  {
    name: "description",
    content:
      "A family of Rust-native developer tools by Sebastian Software: ferroni, ferriki, ferromark and more — with the APIs you already know.",
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return <ArdoRootLayout>{children}</ArdoRootLayout>
}

export const ErrorBoundary = ArdoErrorBoundary

export default function Root() {
  return (
    <ArdoRoot config={config} className="ardo-home">
      <ArdoHeader title="Ferramenta" search={false}>
        <ArdoHeaderActions>
          <ArdoSocialLink href="https://github.com/sebastian-software" icon="github" />
        </ArdoHeaderActions>
      </ArdoHeader>

      <ArdoFooter
        sponsor={{ text: "Sebastian Software", link: "https://oss.sebastian-software.com" }}
        message={<FamilyLinks label="Ferramenta" />}
        copyright={`Copyright ${new Date().getFullYear()} Sebastian Software GmbH`}
      />
    </ArdoRoot>
  )
}
