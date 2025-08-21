"use client"

import Image from "next/image"
import { notFound, useRouter } from "next/navigation"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StructuredData } from "@/components/seo/structured-data"
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data"
import { useCart } from "@/lib/cart-context"

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

export default function ProductPageClient({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug)
  const { addToCart } = useCart()
  const router = useRouter()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  if (!product) {
    notFound()
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)

    const cartItem = {
      id: product.slug,
      name: product.name,
      price: Number.parseFloat(product.price.replace("R$ ", "").replace(",", ".")),
      image: product.image,
      quantity: 1,
    }

    addToCart(cartItem)

    // Show feedback
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

  const handleBuyNow = async () => {
    setIsBuyingNow(true)

    const cartItem = {
      id: product.slug,
      name: product.name,
      price: Number.parseFloat(product.price.replace("R$ ", "").replace(",", ".")),
      image: product.image,
      quantity: 1,
    }

    addToCart(cartItem)

    // Redirect to checkout
    setTimeout(() => {
      router.push("/checkout")
    }, 500)
  }

  const breadcrumbItems = [
    { name: "Início", url: "/" },
    { name: "Produtos", url: "/produtos" },
    { name: product.name, url: `/produtos/${product.slug}` },
  ]

  return (
    <>
      <StructuredData data={generateProductSchema(product)} />
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />

      <Header />

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              {breadcrumbItems.map((item, index) => (
                <li key={item.url} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {index === breadcrumbItems.length - 1 ? (
                    <span className="text-foreground font-medium" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <a href={item.url} className="hover:text-foreground transition-colors">
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="text-3xl font-bold text-primary">{product.price}</div>

              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {isAddingToCart ? "Adicionando..." : "Adicionar ao Carrinho"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {isBuyingNow ? "Processando..." : "Comprar Agora"}
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Informações do Produto</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Categoria: {product.category}</li>
                  <li>• Disponibilidade: {product.inStock ? "Em estoque" : "Indisponível"}</li>
                  <li>• Entrega rápida em todo o Brasil</li>
                  <li>• Garantia de qualidade</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  )
}
