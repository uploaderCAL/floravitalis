export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CreatinaMax",
    url: "https://creatinamax.com.br",
    logo: "https://creatinamax.com.br/logo.png",
    description: "Loja especializada em creatina premium e suplementos para musculação",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressLocality: "São Paulo",
      addressRegion: "SP",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-11-99999-9999",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
    sameAs: ["https://instagram.com/creatinamax", "https://facebook.com/creatinamax"],
  }
}

export function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "CreatinaMax",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "CreatinaMax",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
