import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { generateProductMetadata } from "@/lib/seo/metadata"
import ProductPageClient from "./ProductPageClient"

// Mock product data - replace with actual data fetching
const products = [
  {
    slug: "creatina-monohidratada-300g",
    name: "Creatina Monohidratada 300g",
    description: "Creatina pura monohidratada de alta qualidade para máxima performance e ganho de massa muscular.",
    price: "R$ 89,90",
    image: "/flora-vitalis-creatine.jpeg",
    category: "Creatina",
    inStock: true,
  },
  {
    slug: "creatina-creapure-250g",
    name: "Creatina Creapure 250g",
    description: "Creatina premium Creapure alemã, a mais pura do mercado para resultados superiores.",
    price: "R$ 129,90",
    image: "/flora-vitalis-creatine.jpeg",
    category: "Creatina Premium",
    inStock: true,
  },
  {
    slug: "creatina-creapure-500g",
    name: "Creatina Creapure 500g",
    description: "Creatina premium Creapure alemã em embalagem econômica para uso prolongado.",
    price: "R$ 199,90",
    image: "/flora-vitalis-creatine.jpeg",
    category: "Creatina Premium",
    inStock: true,
  },
]

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug)

  if (!product) {
    return {
      title: "Produto não encontrado",
    }
  }

  return generateProductMetadata(product)
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  return <ProductPageClient params={params} />
}
