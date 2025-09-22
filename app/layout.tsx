import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { EnhancedAuthProvider } from "@/lib/auth/enhanced-auth-context"
import { StructuredData } from "@/components/seo/structured-data"
import { Analytics } from "@/components/seo/analytics"
import { generateOrganizationSchema } from "@/lib/seo/structured-data"
import { defaultMetadata } from "@/lib/seo/metadata"
import { Suspense } from "react"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ea580c" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <style>{`
html {
  font-family: ${dmSans.style.fontFamily};
  --font-sans: var(--font-dm-sans);
  --font-heading: var(--font-space-grotesk);
}
        `}</style>
      </head>
      <body>
        <Suspense>
          <StructuredData data={generateOrganizationSchema()} />

          <EnhancedAuthProvider>
            <CartProvider>{children}</CartProvider>
          </EnhancedAuthProvider>

          <Analytics gaId={process.env.NEXT_PUBLIC_GA4_ID} metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        </Suspense>
      </body>
    </html>
  )
}
