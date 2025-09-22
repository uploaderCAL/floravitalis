"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Package, Search, TrendingUp, TrendingDown, RotateCcw, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MockDatabase, type Product, type Batch, type InventoryMovement } from "@/lib/data/mock-database"
import { MovementType } from "@/lib/types/database"

interface StockAdjustment {
  productId: string
  batchId?: string
  quantity: number
  reason: string
  type: MovementType
}

interface ProductStock {
  product: Product
  totalStock: number
  batches: Batch[]
  recentMovements: InventoryMovement[]
}

export default function AdminInventoryPage() {
  const [productStocks, setProductStocks] = useState<ProductStock[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [stockFilter, setStockFilter] = useState("all") // all, low, out, adequate
  const [isLoading, setIsLoading] = useState(true)

  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentData, setAdjustmentData] = useState<StockAdjustment>({
    productId: "",
    batchId: "",
    quantity: 0,
    reason: "",
    type: MovementType.ADJUSTMENT,
  })

  const [isMovementHistoryOpen, setIsMovementHistoryOpen] = useState(false)
  const [selectedMovements, setSelectedMovements] = useState<InventoryMovement[]>([])

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = () => {
    const stocks: ProductStock[] = MockDatabase.products.map((product) => {
      const batches = MockDatabase.getBatchesByProductId(product.id)
      const totalStock = MockDatabase.getAvailableStock(product.id)
      const recentMovements = MockDatabase.inventoryMovements
        .filter((movement) => movement.productId === product.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      return {
        product,
        totalStock,
        batches,
        recentMovements,
      }
    })

    setProductStocks(stocks)
    setIsLoading(false)
  }

  const filteredStocks = productStocks.filter((stock) => {
    const matchesSearch =
      stock.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || stock.product.category === selectedCategory

    let matchesStockFilter = true
    if (stockFilter === "low") matchesStockFilter = stock.totalStock > 0 && stock.totalStock <= 20
    else if (stockFilter === "out") matchesStockFilter = stock.totalStock === 0
    else if (stockFilter === "adequate") matchesStockFilter = stock.totalStock > 20

    return matchesSearch && matchesCategory && matchesStockFilter
  })

  const handleStockAdjustment = (product: Product) => {
    setSelectedProduct(product)
    setAdjustmentData({
      productId: product.id,
      batchId: "",
      quantity: 0,
      reason: "",
      type: MovementType.ADJUSTMENT,
    })
    setIsAdjustmentDialogOpen(true)
  }

  const handleSubmitAdjustment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct) return

    // Create new inventory movement
    const newMovement: InventoryMovement = {
      id: (MockDatabase.inventoryMovements.length + 1).toString(),
      productId: adjustmentData.productId,
      batchId: adjustmentData.batchId || undefined,
      type: adjustmentData.type,
      quantity: Math.abs(adjustmentData.quantity),
      reason: adjustmentData.reason,
      userId: "1", // Current admin user
      createdAt: new Date(),
    }

    // Update batch quantities if specific batch selected
    if (adjustmentData.batchId) {
      const batch = MockDatabase.batches.find((b) => b.id === adjustmentData.batchId)
      if (batch) {
        if (adjustmentData.type === MovementType.IN) {
          batch.quantity += Math.abs(adjustmentData.quantity)
          batch.availableQuantity += Math.abs(adjustmentData.quantity)
        } else if (adjustmentData.type === MovementType.OUT) {
          batch.quantity -= Math.abs(adjustmentData.quantity)
          batch.availableQuantity -= Math.abs(adjustmentData.quantity)
        } else if (adjustmentData.type === MovementType.ADJUSTMENT) {
          const delta = adjustmentData.quantity
          batch.quantity += delta
          batch.availableQuantity += delta
        }
        batch.updatedAt = new Date()
      }
    }

    MockDatabase.inventoryMovements.push(newMovement)
    loadInventoryData()
    setIsAdjustmentDialogOpen(false)
  }

  const viewMovementHistory = (product: Product) => {
    const movements = MockDatabase.inventoryMovements
      .filter((movement) => movement.productId === product.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setSelectedMovements(movements)
    setIsMovementHistoryOpen(true)
  }

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "text-red-600 bg-red-100"
    if (stock <= 5) return "text-red-600 bg-red-50"
    if (stock <= 20) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  const getMovementIcon = (type: MovementType) => {
    switch (type) {
      case MovementType.IN:
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case MovementType.OUT:
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case MovementType.ADJUSTMENT:
        return <RotateCcw className="w-4 h-4 text-blue-600" />
      default:
        return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const getMovementTypeText = (type: MovementType) => {
    switch (type) {
      case MovementType.IN:
        return "Entrada"
      case MovementType.OUT:
        return "Saída"
      case MovementType.ADJUSTMENT:
        return "Ajuste"
      case MovementType.TRANSFER:
        return "Transferência"
      case MovementType.RETURN:
        return "Devolução"
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando estoque...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const totalProducts = productStocks.length
  const lowStockProducts = productStocks.filter((s) => s.totalStock > 0 && s.totalStock <= 20).length
  const outOfStockProducts = productStocks.filter((s) => s.totalStock === 0).length
  const totalValue = productStocks.reduce((sum, stock) => sum + stock.totalStock * stock.product.costPrice, 0)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Controle de Estoque</h1>
            <p className="text-muted-foreground">Gerencie o estoque de produtos e lotes</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => loadInventoryData()} variant="outline" className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total de Produtos</p>
                <p className="text-2xl font-bold text-card-foreground">{totalProducts}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Estoque Baixo</p>
                <p className="text-2xl font-bold text-card-foreground">{lowStockProducts}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Sem Estoque</p>
                <p className="text-2xl font-bold text-card-foreground">{outOfStockProducts}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Valor Total</p>
                <p className="text-2xl font-bold text-card-foreground">
                  R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
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
                  placeholder="Buscar produtos por nome ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="creatine">Creatina</SelectItem>
                  <SelectItem value="protein">Proteína</SelectItem>
                  <SelectItem value="vitamins">Vitaminas</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estoques</SelectItem>
                  <SelectItem value="adequate">Estoque adequado</SelectItem>
                  <SelectItem value="low">Estoque baixo</SelectItem>
                  <SelectItem value="out">Sem estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Produto</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Estoque Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Lotes</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Valor Estoque</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Última Movimentação</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => {
                  const primaryImage = stock.product.images.find((img) => img.isPrimary) || stock.product.images[0]
                  const stockValue = stock.totalStock * stock.product.costPrice
                  const lastMovement = stock.recentMovements[0]

                  return (
                    <tr key={stock.product.id} className="border-t border-border">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={primaryImage?.url || "/placeholder.svg"}
                            alt={stock.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-card-foreground">{stock.product.name}</p>
                            <p className="text-sm text-muted-foreground">{stock.product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-card-foreground">{stock.product.sku}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-medium ${getStockStatusColor(stock.totalStock)}`}
                          >
                            {stock.totalStock} unidades
                          </span>
                          {stock.totalStock <= 5 && stock.totalStock > 0 && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                          {stock.totalStock === 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-card-foreground">{stock.batches.length} lotes</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-card-foreground">
                          R$ {stockValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {lastMovement ? (
                          <div className="flex items-center space-x-2">
                            {getMovementIcon(lastMovement.type)}
                            <div>
                              <p className="text-sm text-card-foreground">
                                {getMovementTypeText(lastMovement.type)} - {lastMovement.quantity}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(lastMovement.createdAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Nenhuma movimentação</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleStockAdjustment(stock.product)}>
                            Ajustar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => viewMovementHistory(stock.product)}>
                            Histórico
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

        {/* Stock Adjustment Dialog */}
        <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajustar Estoque - {selectedProduct?.name}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmitAdjustment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Movimentação</label>
                  <Select
                    value={adjustmentData.type}
                    onValueChange={(value: MovementType) => setAdjustmentData({ ...adjustmentData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MovementType.IN}>Entrada</SelectItem>
                      <SelectItem value={MovementType.OUT}>Saída</SelectItem>
                      <SelectItem value={MovementType.ADJUSTMENT}>Ajuste</SelectItem>
                      <SelectItem value={MovementType.RETURN}>Devolução</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lote (Opcional)</label>
                  <Select
                    value={adjustmentData.batchId}
                    onValueChange={(value) => setAdjustmentData({ ...adjustmentData, batchId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um lote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os lotes</SelectItem>
                      {selectedProduct &&
                        MockDatabase.getBatchesByProductId(selectedProduct.id).map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.batchNumber} - {batch.availableQuantity} disponível
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantidade {adjustmentData.type === MovementType.ADJUSTMENT ? "(+/-)" : ""}
                  </label>
                  <Input
                    type="number"
                    value={adjustmentData.quantity}
                    onChange={(e) => setAdjustmentData({ ...adjustmentData, quantity: Number(e.target.value) })}
                    placeholder="Ex: 100 ou -50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Motivo da Movimentação</label>
                <Textarea
                  value={adjustmentData.reason}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                  placeholder="Descreva o motivo da movimentação..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Confirmar Movimentação</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Movement History Dialog */}
        <Dialog open={isMovementHistoryOpen} onOpenChange={setIsMovementHistoryOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Histórico de Movimentações</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {selectedMovements.length > 0 ? (
                <div className="space-y-3">
                  {selectedMovements.map((movement) => {
                    const user = MockDatabase.findUserById(movement.userId)
                    const batch = movement.batchId ? MockDatabase.batches.find((b) => b.id === movement.batchId) : null

                    return (
                      <div key={movement.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {getMovementIcon(movement.type)}
                            <div>
                              <p className="font-medium text-card-foreground">
                                {getMovementTypeText(movement.type)} - {movement.quantity} unidades
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(movement.createdAt).toLocaleString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Por: {user?.name}</p>
                            {batch && <p className="text-xs text-muted-foreground">Lote: {batch.batchNumber}</p>}
                          </div>
                        </div>
                        <p className="text-sm text-card-foreground">{movement.reason}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhuma movimentação encontrada</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
