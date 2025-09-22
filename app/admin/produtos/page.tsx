"use client"

import type React from "react"
import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Plus, Search, Edit, Trash2, Eye, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MockDatabase, type Product } from "@/lib/data/mock-database"
import { ProductCategory, ProductStatus } from "@/lib/types/database"
import Link from "next/link"

interface ProductFormData {
  name: string
  slug: string
  description: string
  shortDescription: string
  sku: string
  category: ProductCategory
  subcategory: string
  brand: string
  price: string
  comparePrice: string
  costPrice: string
  weight: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  status: ProductStatus
  featured: boolean
  seoTitle: string
  seoDescription: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    sku: "",
    category: ProductCategory.CREATINE,
    subcategory: "",
    brand: "Flora Vitalis",
    price: "",
    comparePrice: "",
    costPrice: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    status: ProductStatus.ACTIVE,
    featured: false,
    seoTitle: "",
    seoDescription: "",
  })

  useEffect(() => {
    setProducts(MockDatabase.products)
    setIsLoading(false)
  }, [])

  const categories = Object.values(ProductCategory)
  const statuses = Object.values(ProductStatus)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const generateSKU = (name: string, category: ProductCategory) => {
    const categoryCode = category.toUpperCase().substring(0, 4)
    const nameCode = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 4)
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `FV-${categoryCode}-${nameCode}-${randomNum}`
  }

  const handleNewProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      sku: "",
      category: ProductCategory.CREATINE,
      subcategory: "",
      brand: "Flora Vitalis",
      price: "",
      comparePrice: "",
      costPrice: "",
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      status: ProductStatus.ACTIVE,
      featured: false,
      seoTitle: "",
      seoDescription: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription || "",
      sku: product.sku,
      category: product.category,
      subcategory: product.subcategory || "",
      brand: product.brand,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      costPrice: product.costPrice.toString(),
      weight: product.weight.toString(),
      dimensions: {
        length: product.dimensions.length.toString(),
        width: product.dimensions.width.toString(),
        height: product.dimensions.height.toString(),
      },
      status: product.status,
      featured: product.featured,
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const slug = formData.slug || generateSlug(formData.name)
    const sku = formData.sku || generateSKU(formData.name, formData.category)

    const productData: Product = {
      id: editingProduct ? editingProduct.id : (products.length + 1).toString(),
      name: formData.name,
      slug,
      description: formData.description,
      shortDescription: formData.shortDescription,
      sku,
      category: formData.category,
      subcategory: formData.subcategory,
      brand: formData.brand,
      price: Number.parseFloat(formData.price),
      comparePrice: formData.comparePrice ? Number.parseFloat(formData.comparePrice) : undefined,
      costPrice: Number.parseFloat(formData.costPrice),
      weight: Number.parseFloat(formData.weight),
      dimensions: {
        length: Number.parseFloat(formData.dimensions.length),
        width: Number.parseFloat(formData.dimensions.width),
        height: Number.parseFloat(formData.dimensions.height),
      },
      images: editingProduct?.images || [
        {
          id: "1",
          productId: editingProduct ? editingProduct.id : (products.length + 1).toString(),
          url: "/flora-vitalis-creatine.jpeg",
          alt: formData.name,
          order: 1,
          isPrimary: true,
        },
      ],
      specifications: editingProduct?.specifications || [],
      status: formData.status,
      featured: formData.featured,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      createdAt: editingProduct?.createdAt || new Date(),
      updatedAt: new Date(),
      batches: editingProduct?.batches || [],
    }

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map((p) => (p.id === editingProduct.id ? productData : p))
      setProducts(updatedProducts)
      MockDatabase.products = updatedProducts
    } else {
      // Add new product
      const updatedProducts = [...products, productData]
      setProducts(updatedProducts)
      MockDatabase.products = updatedProducts
    }

    setIsDialogOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const updatedProducts = products.filter((p) => p.id !== id)
      setProducts(updatedProducts)
      MockDatabase.products = updatedProducts
    }
  }

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "bg-green-100 text-green-800"
      case ProductStatus.INACTIVE:
        return "bg-gray-100 text-gray-800"
      case ProductStatus.OUT_OF_STOCK:
        return "bg-red-100 text-red-800"
      case ProductStatus.DISCONTINUED:
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "Ativo"
      case ProductStatus.INACTIVE:
        return "Inativo"
      case ProductStatus.OUT_OF_STOCK:
        return "Sem Estoque"
      case ProductStatus.DISCONTINUED:
        return "Descontinuado"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando produtos...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Produtos</h1>
            <p className="text-muted-foreground">Gerencie seu catálogo de produtos Flora Vitalis</p>
          </div>
          <Button onClick={handleNewProduct} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar produtos por nome ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Produto</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Preço</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Estoque</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stock = MockDatabase.getAvailableStock(product.id)
                  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0]

                  return (
                    <tr key={product.id} className="border-t border-border">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={primaryImage?.url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-card-foreground">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                            {product.featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                Destaque
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-card-foreground">{product.sku}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-medium text-card-foreground">
                            R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                          {product.comparePrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              R$ {product.comparePrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-medium ${
                              stock > 20 ? "text-green-600" : stock > 5 ? "text-yellow-600" : "text-red-600"
                            }`}
                          >
                            {stock}
                          </span>
                          {stock <= 5 && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/produtos/${product.slug}`}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredProducts.length} de {products.length} produtos
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
              Anterior
            </button>
            <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm">1</button>
            <button className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
              Próximo
            </button>
          </div>
        </div>

        {/* Product Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome do Produto *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setFormData({
                          ...formData,
                          name,
                          slug: generateSlug(name),
                          seoTitle: name + " - Flora Vitalis",
                        })
                      }}
                      placeholder="Ex: Creatina Monohidratada 300g"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="creatina-monohidratada-300g"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">SKU</label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="FV-CREAT-MONO-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Marca</label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Flora Vitalis"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição Curta</label>
                  <Input
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Creatina pura para máxima performance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição Completa</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição detalhada do produto..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Category and Pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Categoria e Preços</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria *</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: ProductCategory) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subcategoria</label>
                    <Input
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      placeholder="Monohidratada, Creapure, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preço de Venda (R$) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="89.90"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preço Comparativo (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.comparePrice}
                      onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                      placeholder="119.90"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preço de Custo (R$) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      placeholder="45.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: ProductStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {getStatusText(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Physical Properties */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Propriedades Físicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Peso (g) *</label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Comprimento (cm)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.dimensions.length}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, length: e.target.value },
                        })
                      }
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Largura (cm)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.dimensions.width}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, width: e.target.value },
                        })
                      }
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Altura (cm)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.dimensions.height}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, height: e.target.value },
                        })
                      }
                      placeholder="12"
                    />
                  </div>
                </div>
              </div>

              {/* SEO and Marketing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">SEO e Marketing</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-border"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Produto em destaque
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Título SEO</label>
                    <Input
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="Creatina Monohidratada 300g - Flora Vitalis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição SEO</label>
                    <Textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="Compre Creatina Monohidratada 300g Flora Vitalis. Produto de alta qualidade..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingProduct ? "Atualizar" : "Criar"} Produto</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
