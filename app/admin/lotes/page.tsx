"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Package, Plus, Search, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MockDatabase, type Product, type Batch } from "@/lib/data/mock-database"
import { BatchQualityStatus } from "@/lib/types/database"

interface BatchFormData {
  productId: string
  batchNumber: string
  manufacturingDate: string
  expirationDate: string
  quantity: string
  costPrice: string
  supplier: string
  qualityStatus: BatchQualityStatus
  notes: string
  coaUrl: string
}

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [qualityFilter, setQualityFilter] = useState("all")
  const [expirationFilter, setExpirationFilter] = useState("all") // all, expiring, expired
  const [isLoading, setIsLoading] = useState(true)

  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [formData, setFormData] = useState<BatchFormData>({
    productId: "",
    batchNumber: "",
    manufacturingDate: "",
    expirationDate: "",
    quantity: "",
    costPrice: "",
    supplier: "",
    qualityStatus: BatchQualityStatus.PENDING,
    notes: "",
    coaUrl: "",
  })

  useEffect(() => {
    loadBatchData()
  }, [])

  const loadBatchData = () => {
    setBatches(MockDatabase.batches)
    setProducts(MockDatabase.products)
    setIsLoading(false)
  }

  const generateBatchNumber = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return ""

    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const sequence = (batches.filter((b) => b.productId === productId).length + 1).toString().padStart(3, "0")

    return `FV${year}${month}${day}${sequence}`
  }

  const filteredBatches = batches.filter((batch) => {
    const product = products.find((p) => p.id === batch.productId)
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduct = selectedProduct === "all" || batch.productId === selectedProduct
    const matchesQuality = qualityFilter === "all" || batch.qualityStatus === qualityFilter

    let matchesExpiration = true
    if (expirationFilter === "expiring") {
      const sixMonthsFromNow = new Date()
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
      matchesExpiration =
        new Date(batch.expirationDate) <= sixMonthsFromNow && new Date(batch.expirationDate) > new Date()
    } else if (expirationFilter === "expired") {
      matchesExpiration = new Date(batch.expirationDate) <= new Date()
    }

    return matchesSearch && matchesProduct && matchesQuality && matchesExpiration
  })

  const handleNewBatch = () => {
    setEditingBatch(null)
    setFormData({
      productId: "",
      batchNumber: "",
      manufacturingDate: new Date().toISOString().split("T")[0],
      expirationDate: "",
      quantity: "",
      costPrice: "",
      supplier: "",
      qualityStatus: BatchQualityStatus.PENDING,
      notes: "",
      coaUrl: "",
    })
    setIsBatchDialogOpen(true)
  }

  const handleEditBatch = (batch: Batch) => {
    setEditingBatch(batch)
    setFormData({
      productId: batch.productId,
      batchNumber: batch.batchNumber,
      manufacturingDate: new Date(batch.manufacturingDate).toISOString().split("T")[0],
      expirationDate: new Date(batch.expirationDate).toISOString().split("T")[0],
      quantity: batch.quantity.toString(),
      costPrice: batch.costPrice.toString(),
      supplier: batch.supplier || "",
      qualityStatus: batch.qualityStatus,
      notes: batch.notes || "",
      coaUrl: "", // COA URL would be stored separately in real implementation
    })
    setIsBatchDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const batchData: Batch = {
      id: editingBatch ? editingBatch.id : (batches.length + 1).toString(),
      productId: formData.productId,
      batchNumber: formData.batchNumber || generateBatchNumber(formData.productId),
      manufacturingDate: new Date(formData.manufacturingDate),
      expirationDate: new Date(formData.expirationDate),
      quantity: Number.parseInt(formData.quantity),
      reservedQuantity: editingBatch?.reservedQuantity || 0,
      availableQuantity: editingBatch
        ? editingBatch.availableQuantity + (Number.parseInt(formData.quantity) - editingBatch.quantity)
        : Number.parseInt(formData.quantity),
      costPrice: Number.parseFloat(formData.costPrice),
      supplier: formData.supplier,
      qualityStatus: formData.qualityStatus,
      notes: formData.notes,
      createdAt: editingBatch?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (editingBatch) {
      // Update existing batch
      const updatedBatches = batches.map((b) => (b.id === editingBatch.id ? batchData : b))
      setBatches(updatedBatches)
      MockDatabase.batches = updatedBatches
    } else {
      // Add new batch
      const updatedBatches = [...batches, batchData]
      setBatches(updatedBatches)
      MockDatabase.batches = updatedBatches
    }

    setIsBatchDialogOpen(false)
  }

  const handleDeleteBatch = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este lote?")) {
      const updatedBatches = batches.filter((b) => b.id !== id)
      setBatches(updatedBatches)
      MockDatabase.batches = updatedBatches
    }
  }

  const getQualityStatusColor = (status: BatchQualityStatus) => {
    switch (status) {
      case BatchQualityStatus.APPROVED:
        return "bg-green-100 text-green-800"
      case BatchQualityStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case BatchQualityStatus.REJECTED:
        return "bg-red-100 text-red-800"
      case BatchQualityStatus.EXPIRED:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getQualityStatusText = (status: BatchQualityStatus) => {
    switch (status) {
      case BatchQualityStatus.APPROVED:
        return "Aprovado"
      case BatchQualityStatus.PENDING:
        return "Pendente"
      case BatchQualityStatus.REJECTED:
        return "Rejeitado"
      case BatchQualityStatus.EXPIRED:
        return "Expirado"
      default:
        return status
    }
  }

  const getQualityStatusIcon = (status: BatchQualityStatus) => {
    switch (status) {
      case BatchQualityStatus.APPROVED:
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case BatchQualityStatus.PENDING:
        return <Clock className="w-4 h-4 text-yellow-600" />
      case BatchQualityStatus.REJECTED:
        return <XCircle className="w-4 h-4 text-red-600" />
      case BatchQualityStatus.EXPIRED:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getDaysToExpiration = (expirationDate: Date) => {
    const today = new Date()
    const expDate = new Date(expirationDate)
    const diffTime = expDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando lotes...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const totalBatches = batches.length
  const approvedBatches = batches.filter((b) => b.qualityStatus === BatchQualityStatus.APPROVED).length
  const pendingBatches = batches.filter((b) => b.qualityStatus === BatchQualityStatus.PENDING).length
  const expiringBatches = batches.filter((b) => {
    const daysToExpire = getDaysToExpiration(b.expirationDate)
    return daysToExpire <= 180 && daysToExpire > 0
  }).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Controle de Lotes</h1>
            <p className="text-muted-foreground">Gerencie lotes de produção e qualidade</p>
          </div>
          <Button onClick={handleNewBatch} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lote
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total de Lotes</p>
                <p className="text-2xl font-bold text-card-foreground">{totalBatches}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Aprovados</p>
                <p className="text-2xl font-bold text-card-foreground">{approvedBatches}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Pendentes</p>
                <p className="text-2xl font-bold text-card-foreground">{pendingBatches}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Próximos ao Vencimento</p>
                <p className="text-2xl font-bold text-card-foreground">{expiringBatches}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por número do lote, produto ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os produtos</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value={BatchQualityStatus.APPROVED}>Aprovados</option>
                <option value={BatchQualityStatus.PENDING}>Pendentes</option>
                <option value={BatchQualityStatus.REJECTED}>Rejeitados</option>
                <option value={BatchQualityStatus.EXPIRED}>Expirados</option>
              </select>
              <select
                value={expirationFilter}
                onChange={(e) => setExpirationFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os vencimentos</option>
                <option value="expiring">Próximos ao vencimento</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Batches Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Lote</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Produto</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Fabricação</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vencimento</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Quantidade</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status Qualidade</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Fornecedor</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => {
                  const product = products.find((p) => p.id === batch.productId)
                  const daysToExpire = getDaysToExpiration(batch.expirationDate)
                  const isExpiring = daysToExpire <= 180 && daysToExpire > 0
                  const isExpired = daysToExpire <= 0

                  return (
                    <tr key={batch.id} className="border-t border-border">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-mono font-medium text-card-foreground">{batch.batchNumber}</p>
                          <p className="text-xs text-muted-foreground">ID: {batch.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-card-foreground">{product?.name}</p>
                          <p className="text-sm text-muted-foreground">{product?.sku}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-card-foreground">
                          {new Date(batch.manufacturingDate).toLocaleDateString("pt-BR")}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span
                            className={`text-card-foreground ${isExpired ? "text-red-600" : isExpiring ? "text-orange-600" : ""}`}
                          >
                            {new Date(batch.expirationDate).toLocaleDateString("pt-BR")}
                          </span>
                          <p
                            className={`text-xs ${isExpired ? "text-red-600" : isExpiring ? "text-orange-600" : "text-muted-foreground"}`}
                          >
                            {isExpired ? "Expirado" : isExpiring ? `${daysToExpire} dias` : `${daysToExpire} dias`}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-card-foreground">{batch.availableQuantity}</p>
                          <p className="text-xs text-muted-foreground">
                            Total: {batch.quantity} | Reservado: {batch.reservedQuantity}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getQualityStatusIcon(batch.qualityStatus)}
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${getQualityStatusColor(batch.qualityStatus)}`}
                          >
                            {getQualityStatusText(batch.qualityStatus)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-card-foreground">{batch.supplier || "N/A"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditBatch(batch)}>
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBatch(batch.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Batch Form Dialog */}
        <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBatch ? "Editar Lote" : "Novo Lote"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações do Lote</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Produto *</label>
                    <Select
                      value={formData.productId}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          productId: value,
                          batchNumber: generateBatchNumber(value),
                          costPrice: products.find((p) => p.id === value)?.costPrice.toString() || "",
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.sku}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Número do Lote</label>
                    <Input
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                      placeholder="FV240101001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Data de Fabricação *</label>
                    <Input
                      type="date"
                      value={formData.manufacturingDate}
                      onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Data de Vencimento *</label>
                    <Input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quantidade *</label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="1000"
                      required
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
                    <label className="block text-sm font-medium mb-2">Fornecedor</label>
                    <Input
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      placeholder="Nome do fornecedor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status de Qualidade</label>
                    <Select
                      value={formData.qualityStatus}
                      onValueChange={(value: BatchQualityStatus) => setFormData({ ...formData, qualityStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BatchQualityStatus.PENDING}>Pendente</SelectItem>
                        <SelectItem value={BatchQualityStatus.APPROVED}>Aprovado</SelectItem>
                        <SelectItem value={BatchQualityStatus.REJECTED}>Rejeitado</SelectItem>
                        <SelectItem value={BatchQualityStatus.EXPIRED}>Expirado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL do COA (Certificado de Análise)</label>
                  <Input
                    value={formData.coaUrl}
                    onChange={(e) => setFormData({ ...formData, coaUrl: e.target.value })}
                    placeholder="https://exemplo.com/coa/lote123.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Observações</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Observações sobre o lote..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsBatchDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingBatch ? "Atualizar" : "Criar"} Lote</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
