"use client"

import AdminLayout from "@/components/admin/admin-layout"
import { Package, ShoppingCart, Users, TrendingUp, Eye, Plus } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      name: "Produtos",
      value: "24",
      change: "+2 este mês",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Pedidos",
      value: "156",
      change: "+12 hoje",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Clientes",
      value: "89",
      change: "+5 esta semana",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Receita",
      value: "R$ 12.450",
      change: "+8% este mês",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentOrders = [
    { id: "001", customer: "João Silva", total: "R$ 89,90", status: "Pago", date: "Hoje" },
    { id: "002", customer: "Maria Santos", total: "R$ 129,90", status: "Pendente", date: "Ontem" },
    { id: "003", customer: "Pedro Costa", total: "R$ 149,90", status: "Enviado", date: "2 dias" },
    { id: "004", customer: "Ana Oliveira", total: "R$ 109,90", status: "Pago", date: "3 dias" },
  ]

  const topProducts = [
    { name: "Creatina Monohidratada 300g", sales: 45, revenue: "R$ 4.045,50" },
    { name: "Creatina Creapure 250g", sales: 32, revenue: "R$ 4.156,80" },
    { name: "Creatina HCL 200g", sales: 28, revenue: "R$ 4.197,20" },
    { name: "Creatina Alcalina 250g", sales: 21, revenue: "R$ 2.937,90" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu negócio</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Ver Loja
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">Pedidos Recentes</h2>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">Ver todos</button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-card-foreground">
                      #{order.id} - {order.customer}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-card-foreground">{order.total}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Pago"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">Produtos Mais Vendidos</h2>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">Ver relatório</button>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} vendas</p>
                    </div>
                  </div>
                  <p className="font-medium text-card-foreground text-sm">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
