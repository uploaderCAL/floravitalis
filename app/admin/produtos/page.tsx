"use client"

import type React from "react"

import { useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: "active" | "inactive"
  image: string
  description?: string
  weight?: string
}

interface ProductFormData {
  name: string
  category: string
  price: string
  stock: string
  status: "active" | "inactive"
  image: string
  description: string
  weight: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Creatina Monohidratada 300g",
      category: "Monohidratada",
      price: 89.9,
      stock: 45,
      status: "active",
      image: "/flora-vitalis-creatine.jpeg",
      description: "Creatina monohidratada pura de alta qualidade",
      weight: "300g",
    },
    {
      id: 2,
      name: "Creatina Creapure 250g",
      category: "Premium",
      price: 129.9,
      stock: 32,
      status: "active",
      image: "/placeholder-8gu55.png",
    },
    {
      id: 3,
      name: "Creatina HCL 200g",
      category: "HCL",
      price: 149.9,
      stock: 28,
      status: "active",
      image: "/placeholder-dtgw2.png",
    },
    {
      id: 4,
      name: "Creatina Alcalina 250g",
      category: "Alcalina",
      price: 139.9,
      stock: 0,
      status: "inactive",
      image: "/placeholder-nnjl8.png",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "active",
    image: "",
    description: "",
    weight: "",
  })

  const categories = ["all", "Monohidratada", "Premium", "HCL", "Alcalina", "Micronizada", "Combo"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleNewProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "active",
      image: "",
      description: "",
      weight: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      image: product.image,
      description: product.description || "",
      weight: product.weight || "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      status: formData.status,
      image: formData.image || "/flora-vitalis-creatine.jpeg",
      description: formData.description,
      weight: formData.weight,
    }

    if (editingProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === editingProduct.id ? productData : p)))
    } else {
      // Add new product
      setProducts([...products, productData])
    }

    setIsDialogOpen(false)
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Produtos</h1>
            <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
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
                  placeholder="Buscar produtos..."
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
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button className="px-4 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-accent transition-colors flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Preço</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Estoque</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-border">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-card-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-card-foreground">R$ {product.price.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-medium ${
                          product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-yellow-600" : "text-red-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
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
                ))}
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
              2
            </button>
            <button className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
              Próximo
            </button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Produto</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Creatina Monohidratada 300g"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preço (R$)</label>
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
                  <label className="block text-sm font-medium mb-2">Estoque</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="45"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Peso</label>
                  <Input
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="300g"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL da Imagem</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/flora-vitalis-creatine.jpeg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada do produto..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
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
