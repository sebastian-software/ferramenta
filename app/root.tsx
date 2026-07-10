import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { Layout as ArdoLayout, Header, Footer, SocialLink } from "ardo/ui"
import { ArdoProvider } from "ardo/runtime"
import config from "virtual:ardo/config"
import sidebar from "virtual:ardo/sidebar"
import "ardo/ui/styles.css"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <ArdoProvider config={config} sidebar={sidebar}>
      <ArdoLayout
        className="ardo-layout ardo-home"
        header={
          <Header
            title="Ferramenta"
            search={false}
            actions={<SocialLink href="https://github.com/sebastian-software" icon="github" />}
          />
        }
        footer={
          <Footer
            message={[
              "Rust-native tools by <a href='https://oss.sebastian-software.com'>Sebastian Software</a>",
              "Built with <a href='https://github.com/sebastian-software/ardo'>Ardo</a>",
            ].join(" &middot; ")}
            copyright={`Copyright &copy; ${new Date().getFullYear()} Sebastian Software GmbH`}
          />
        }
      >
        <Outlet />
      </ArdoLayout>
    </ArdoProvider>
  )
}
