"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Star, Grid, List } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function ProductsPage() {
  const { addItem } = useCart()

  const products = [
    {
      id: 1,
      slug: "creatina-monohidratada-300g", // Added slug field for proper routing
      name: "Creatina Monohidratada 300g",
      price: 89.9,
      originalPrice: 119.9,
      image: "/placeholder-5kqzs.png",
      rating: 4.8,
      reviews: 234,
      category: "Monohidratada",
    },
    {
      id: 2,
      slug: "creatina-creapure-250g", // Added slug field
      name: "Creatina Creapure 250g",
      price: 129.9,
      originalPrice: 159.9,
      image: "/placeholder-8gu55.png",
      rating: 4.9,
      reviews: 156,
      category: "Premium",
    },
    {
      id: 3,
      slug: "creatina-hcl-200g", // Added slug field
      name: "Creatina HCL 200g",
      price: 149.9,
      originalPrice: 189.9,
      image: "/placeholder-dtgw2.png",
      rating: 4.7,
      reviews: 89,
      category: "HCL",
    },
    {
      id: 4,
      slug: "creatina-alcalina-250g", // Added slug field
      name: "Creatina Alcalina 250g",
      price: 139.9,
      originalPrice: 169.9,
      image: "/placeholder-nnjl8.png",
      rating: 4.6,
      reviews: 67,
      category: "Alcalina",
    },
    {
      id: 5,
      slug: "creatina-micronizada-400g", // Added slug field
      name: "Creatina Micronizada 400g",
      price: 109.9,
      originalPrice: 139.9,
      image: "/placeholder-bklal.png",
      rating: 4.8,
      reviews: 198,
      category: "Micronizada",
    },
    {
      id: 6,
      slug: "creatina-bcaa-300g", // Added slug field
      name: "Creatina + BCAA 300g",
      price: 159.9,
      originalPrice: 199.9,
      image: "/placeholder-pwdkn.png",
      rating: 4.7,
      reviews: 123,
      category: "Combo",
    },
  ]

  const categories = ["Todos", "Monohidratada", "Premium", "HCL", "Alcalina", "Micronizada", "Combo"]

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="font-heading font-bold text-4xl text-card-foreground">Nossos Produtos</h1>
            <p className="text-muted-foreground text-lg">Descubra nossa linha completa de creatina premium</p>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === "Todos"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border border-border hover:bg-accent"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground">
                <option>Ordenar por: Mais Vendidos</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Melhor Avaliação</option>
              </select>

              <div className="flex border border-border rounded-lg">
                <button className="p-2 bg-primary text-primary-foreground">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                    -25%
                  </div>
                  <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-heading font-semibold text-card-foreground">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-primary">{product.price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/produtos/${product.slug}`}
                      className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-center inline-block"
                    >
                      Ver Produto
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                Anterior
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">1</button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">2</button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">3</button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                Próximo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
