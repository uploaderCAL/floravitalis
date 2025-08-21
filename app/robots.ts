import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://creatinamax.com.br"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/carrinho", "/checkout", "/meus-pedidos"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
