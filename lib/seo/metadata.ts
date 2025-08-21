import type { Metadata } from "next"

export const defaultMetadata: Metadata = {
  title: {
    default: "CreatinaMax - Creatina Premium para Máxima Performance",
    template: "%s | CreatinaMax",
  },
  description:
    "Creatina premium de alta qualidade para atletas e praticantes de musculação. Entrega rápida em todo o Brasil. Resultados garantidos.",
  keywords: ["creatina", "suplementos", "musculação", "performance", "brasil", "whey protein", "academia"],
  authors: [{ name: "CreatinaMax" }],
  creator: "CreatinaMax",
  publisher: "CreatinaMax",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://creatinamax.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "CreatinaMax",
    title: "CreatinaMax - Creatina Premium para Máxima Performance",
    description:
      "Creatina premium de alta qualidade para atletas e praticantes de musculação. Entrega rápida em todo o Brasil.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CreatinaMax - Creatina Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CreatinaMax - Creatina Premium para Máxima Performance",
    description: "Creatina premium de alta qualidade para atletas e praticantes de musculação.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export function generateProductMetadata(product: any): Metadata {
  return {
    title: `${product.name} - Creatina Premium`,
    description: `${product.description} Compre agora com entrega rápida em todo o Brasil. Preço: ${product.price}`,
    keywords: ["creatina", product.name, "suplementos", "musculação", "brasil"],
    openGraph: {
      title: `${product.name} - CreatinaMax`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - CreatinaMax`,
      description: product.description,
      images: [product.image],
    },
  }
}
