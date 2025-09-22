"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Star, Grid, List, Search } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { mockDatabase } from "@/lib/data/mock-database"
import { type Product, ProductCategory, ProductStatus } from "@/lib/types/database"
import { useState, useMemo } from "react"

export default function ProductsPage() {
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("featured")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProducts = useMemo(() => {
    let products = mockDatabase.products.filter((product) => product.status === ProductStatus.ACTIVE)

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter((product) => product.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort products
    switch (sortBy) {
      case "price_low":
        products.sort((a, b) => a.price - b.price)
        break
      case "price_high":
        products.sort((a, b) => b.price - a.price)
        break
      case "name":
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "featured":
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return products
  }, [selectedCategory, sortBy, searchTerm])

  const categories = [
    { value: "all", label: "Todos" },
    { value: ProductCategory.CREATINE, label: "Creatina" },
    { value: ProductCategory.PROTEIN, label: "Proteína" },
    { value: ProductCategory.VITAMINS, label: "Vitaminas" },
    { value: ProductCategory.AMINO_ACIDS, label: "Aminoácidos" },
    { value: ProductCategory.PRE_WORKOUT, label: "Pré-Treino" },
    { value: ProductCategory.POST_WORKOUT, label: "Pós-Treino" },
  ]

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.comparePrice,
      image: product.images[0]?.url || "/placeholder.svg",
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
            <p className="text-muted-foreground text-lg">Descubra nossa linha completa de suplementos premium</p>
            <div className="max-w-md mx-auto mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
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
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border border-border hover:bg-accent"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="featured">Ordenar por: Destaques</option>
                <option value="price_low">Menor Preço</option>
                <option value="price_high">Maior Preço</option>
                <option value="name">Nome A-Z</option>
              </select>

              <div className="flex border border-border rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Mostrando {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""}
              {searchTerm && ` para "${searchTerm}"`}
              {selectedCategory !== "all" &&
                ` na categoria "${categories.find((c) => c.value === selectedCategory)?.label}"`}
            </p>
          </div>

          {/* Products Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {filteredProducts.map((product) => {
              const discountPercentage = product.comparePrice
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : 0

              const totalStock = product.batches.reduce((sum, batch) => sum + batch.availableQuantity, 0)

              if (viewMode === "list") {
                return (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow flex"
                  >
                    <div className="w-48 h-48 relative flex-shrink-0">
                      <img
                        src={product.images[0]?.url || "/placeholder.svg"}
                        alt={product.images[0]?.alt || product.name}
                        className="w-full h-full object-cover"
                      />
                      {discountPercentage > 0 && (
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                          -{discountPercentage}%
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading font-semibold text-card-foreground">{product.name}</h3>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">(4.8)</span>
                          <span className="text-sm text-muted-foreground">• {totalStock} em estoque</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-primary">
                            R$ {product.price.toFixed(2).replace(".", ",")}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              R$ {product.comparePrice.toFixed(2).replace(".", ",")}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/produtos/${product.slug}`}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
                          >
                            Ver Produto
                          </Link>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={product.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.images[0]?.url || "/placeholder.svg"}
                      alt={product.images[0]?.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                    {discountPercentage > 0 && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                        -{discountPercentage}%
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                      {product.category}
                    </div>
                    {totalStock < 10 && (
                      <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Últimas unidades
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-heading font-semibold text-card-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">(4.8)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-primary">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {product.comparePrice.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{totalStock} unidades em estoque</div>
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
                        disabled={totalStock === 0}
                      >
                        {totalStock > 0 ? "Adicionar" : "Esgotado"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="mt-4 text-primary hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
