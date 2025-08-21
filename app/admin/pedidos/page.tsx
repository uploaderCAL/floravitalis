"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { type Order, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/types/order"
import { OrderService } from "@/lib/services/order-service"
import { formatCurrency } from "@/lib/currency"
import { Eye, Package, Truck, CheckCircle, XCircle, Search } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const ordersData = await OrderService.getAllOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"], trackingCode?: string) => {
    setUpdating(orderId)
    try {
      await OrderService.updateOrderStatus(orderId, newStatus, trackingCode)
      await loadOrders()
      alert("Status do pedido atualizado com sucesso!")
    } catch (error) {
      alert("Erro ao atualizar status do pedido")
    } finally {
      setUpdating(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando pedidos...</p>
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
            <h1 className="font-heading font-bold text-2xl text-foreground">Pedidos</h1>
            <p className="text-muted-foreground">Gerencie todos os pedidos da loja</p>
          </div>
          <div className="text-sm text-muted-foreground">Total: {orders.length} pedidos</div>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por ID ou email do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="processing">Processando</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/25">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{order.id}</div>
                      {order.trackingCode && (
                        <div className="text-sm text-muted-foreground">Rastreio: {order.trackingCode}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{order.shippingAddress.name}</div>
                      <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{formatCurrency(order.total)}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === "processing" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "shipped", "BR" + Math.random().toString().slice(2, 11))
                            }
                            disabled={updating === order.id}
                            className="p-1 text-muted-foreground hover:text-blue-600 transition-colors disabled:opacity-50"
                            title="Marcar como enviado"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "delivered")}
                            disabled={updating === order.id}
                            className="p-1 text-muted-foreground hover:text-green-600 transition-colors disabled:opacity-50"
                            title="Marcar como entregue"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Os pedidos aparecerão aqui quando forem realizados"}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-card-foreground">
                  Detalhes do Pedido {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}
                  >
                    {ORDER_STATUS_LABELS[selectedOrder.status]}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}
                  >
                    {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus]}
                  </span>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Informações do Cliente</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                    <p>
                      <strong>Nome:</strong> {selectedOrder.shippingAddress.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Endereço de Entrega</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p>
                      {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.number}
                    </p>
                    {selectedOrder.shippingAddress.complement && <p>{selectedOrder.shippingAddress.complement}</p>}
                    <p>{selectedOrder.shippingAddress.neighborhood}</p>
                    <p>
                      {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.state}
                    </p>
                    <p>CEP: {selectedOrder.shippingAddress.zipCode}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Itens do Pedido</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-muted/50 p-4 rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-card-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="font-medium text-card-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Resumo do Pedido</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>{formatCurrency(selectedOrder.shipping)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto:</span>
                        <span>-{formatCurrency(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Code */}
                {selectedOrder.trackingCode && (
                  <div>
                    <h3 className="font-medium text-card-foreground mb-2">Código de Rastreamento</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <code className="text-sm font-mono">{selectedOrder.trackingCode}</code>
                    </div>
                  </div>
                )}

                {/* Order Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Criado em:</span>
                    <p className="text-muted-foreground">{new Date(selectedOrder.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <span className="font-medium">Atualizado em:</span>
                    <p className="text-muted-foreground">{new Date(selectedOrder.updatedAt).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
