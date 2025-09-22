"use client"

import AdminLayout from "@/components/admin/admin-layout"
import { Package, ShoppingCart, Users, TrendingUp, Eye, Plus, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { MockDatabase, type DashboardMetrics } from "@/lib/data/mock-database"
import { OrderStatus } from "@/lib/types/database"
import Link from "next/link"

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardMetrics = () => {
      const totalRevenue = MockDatabase.getTotalRevenue()
      const totalOrders = MockDatabase.getTotalOrders()
      const totalCustomers = MockDatabase.getTotalCustomers()
      const averageOrderValue = MockDatabase.getAverageOrderValue()

      // Calculate growth percentages (mock data for demo)
      const revenueGrowth = 8.5
      const ordersGrowth = 12.3
      const customersGrowth = 5.7

      // Get top products by sales
      const topProducts = MockDatabase.products
        .map((product) => {
          const sales = Math.floor(Math.random() * 50) + 10 // Mock sales data
          return {
            productId: product.id,
            productName: product.name,
            totalSold: sales,
            revenue: sales * product.price,
          }
        })
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 4)

      // Get recent orders
      const recentOrders = MockDatabase.orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      // Get low stock products
      const lowStockProducts = MockDatabase.products.filter((product) => {
        const stock = MockDatabase.getAvailableStock(product.id)
        return stock < 20
      })

      // Get expiring batches (within 6 months)
      const sixMonthsFromNow = new Date()
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
      const expiringBatches = MockDatabase.batches.filter((batch) => new Date(batch.expirationDate) <= sixMonthsFromNow)

      setMetrics({
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        topProducts,
        recentOrders,
        lowStockProducts,
        expiringBatches,
      })
      setIsLoading(false)
    }

    loadDashboardMetrics()
  }, [])

  if (isLoading || !metrics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const stats = [
    {
      name: "Receita Total",
      value: `R$ ${metrics.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      change: `+${metrics.revenueGrowth}% este mês`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Pedidos",
      value: metrics.totalOrders.toString(),
      change: `+${metrics.ordersGrowth}% este mês`,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Clientes",
      value: metrics.totalCustomers.toString(),
      change: `+${metrics.customersGrowth}% esta semana`,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Ticket Médio",
      value: `R$ ${metrics.averageOrderValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      change: "+2.1% este mês",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800"
      case OrderStatus.SHIPPED:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.PROCESSING:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.PENDING:
        return "bg-gray-100 text-gray-800"
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "Entregue"
      case OrderStatus.SHIPPED:
        return "Enviado"
      case OrderStatus.PROCESSING:
        return "Processando"
      case OrderStatus.PENDING:
        return "Pendente"
      case OrderStatus.CANCELLED:
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu negócio Flora Vitalis</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Loja
            </Link>
            <Link
              href="/admin/produtos"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts Section */}
        {(metrics.lowStockProducts.length > 0 || metrics.expiringBatches.length > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-yellow-800">Alertas do Sistema</h3>
            </div>
            <div className="space-y-2 text-sm">
              {metrics.lowStockProducts.length > 0 && (
                <p className="text-yellow-700">
                  <strong>{metrics.lowStockProducts.length}</strong> produtos com estoque baixo
                </p>
              )}
              {metrics.expiringBatches.length > 0 && (
                <p className="text-yellow-700">
                  <strong>{metrics.expiringBatches.length}</strong> lotes próximos do vencimento
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">Pedidos Recentes</h2>
              <Link href="/admin/pedidos" className="text-primary hover:text-primary/80 text-sm font-medium">
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {metrics.recentOrders.map((order) => {
                const customer = MockDatabase.findUserById(order.userId)
                return (
                  <div key={order.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-card-foreground">
                        #{order.orderNumber} - {customer?.name || "Cliente"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-card-foreground">
                        R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">Produtos Mais Vendidos</h2>
              <Link href="/admin/produtos" className="text-primary hover:text-primary/80 text-sm font-medium">
                Ver relatório
              </Link>
            </div>
            <div className="space-y-4">
              {metrics.topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground text-sm">{product.productName}</p>
                      <p className="text-xs text-muted-foreground">{product.totalSold} vendas</p>
                    </div>
                  </div>
                  <p className="font-medium text-card-foreground text-sm">
                    R$ {product.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock and Expiring Batches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Products */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">Estoque Baixo</h2>
              <Link href="/admin/estoque" className="text-primary hover:text-primary/80 text-sm font-medium">
                Ver estoque
              </Link>
            </div>
            <div className="space-y-3">
              {metrics.lowStockProducts.slice(0, 5).map((product) => {
                const stock = MockDatabase.getAvailableStock(product.id)
                return (
                  <div key={product.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-card-foreground text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <span className="text-red-600 font-semibold text-sm">{stock} unidades</span>
                  </div>
                )
              })}
              {metrics.lowStockProducts.length === 0 && (
                <p className="text-muted-foreground text-sm">Todos os produtos com estoque adequado</p>
              )}
            </div>
          </div>

          {/* Expiring Batches */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">Lotes Próximos ao Vencimento</h2>
              <Link href="/admin/lotes" className="text-primary hover:text-primary/80 text-sm font-medium">
                Ver lotes
              </Link>
            </div>
            <div className="space-y-3">
              {metrics.expiringBatches.slice(0, 5).map((batch) => {
                const product = MockDatabase.findProductById(batch.productId)
                const daysToExpire = Math.ceil(
                  (new Date(batch.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )
                return (
                  <div key={batch.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-card-foreground text-sm">{product?.name}</p>
                      <p className="text-xs text-muted-foreground">Lote: {batch.batchNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-orange-600 font-semibold text-sm">{daysToExpire} dias</span>
                      <p className="text-xs text-muted-foreground">{batch.availableQuantity} unidades</p>
                    </div>
                  </div>
                )
              })}
              {metrics.expiringBatches.length === 0 && (
                <p className="text-muted-foreground text-sm">Nenhum lote próximo ao vencimento</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
