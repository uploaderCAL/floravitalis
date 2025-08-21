"use client"

import { useState } from "react"
import { type Order, ORDER_STATUS_LABELS } from "@/lib/types/order"
import { OrderService } from "@/lib/services/order-service"
import { formatCurrency } from "@/lib/currency"
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, Search } from "lucide-react"

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [customerEmail, setCustomerEmail] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = async () => {
    if (!customerEmail.trim()) return

    setLoading(true)
    setSearchPerformed(true)
    try {
      const ordersData = await OrderService.getOrdersByEmail(customerEmail)
      setOrders(ordersData)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "processing":
        return <Package className="w-5 h-5 text-blue-600" />
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-600" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Meus Pedidos</h1>
            <p className="text-muted-foreground">Acompanhe o status dos seus pedidos</p>
          </div>

          {/* Email Search */}
          {!searchPerformed && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Digite seu email para ver seus pedidos:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="seu@email.com"
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!customerEmail.trim()}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && searchPerformed && (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando seus pedidos...</p>
              </div>
            </div>
          )}

          {/* Orders List */}
          {!loading && searchPerformed && (
            <>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-card p-6 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-semibold text-card-foreground">Pedido {order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-card-foreground">{formatCurrency(order.total)}</div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                          </div>
                          {order.trackingCode && (
                            <div className="text-sm text-muted-foreground">
                              Rastreio: <code className="font-mono">{order.trackingCode}</code>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary hover:text-primary/80 transition-colors flex items-center text-sm font-medium"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-muted-foreground mb-4">Não encontramos pedidos para este email.</p>
                  <button
                    onClick={() => {
                      setSearchPerformed(false)
                      setCustomerEmail("")
                    }}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Tentar outro email
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading font-semibold text-xl text-card-foreground">Pedido {selectedOrder.id}</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Status */}
                  <div className="flex items-center justify-center">
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}
                    >
                      {ORDER_STATUS_LABELS[selectedOrder.status]}
                    </span>
                  </div>

                  {/* Tracking Code */}
                  {selectedOrder.trackingCode && (
                    <div className="text-center">
                      <h3 className="font-medium text-card-foreground mb-2">Código de Rastreamento</h3>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <code className="text-lg font-mono">{selectedOrder.trackingCode}</code>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-card-foreground mb-4">Itens do Pedido</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 bg-muted/50 p-4 rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-card-foreground">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-card-foreground">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                            <div className="text-sm text-muted-foreground">{formatCurrency(item.price)} cada</div>
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
                      <div className="border-t border-border pt-2 flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium text-card-foreground mb-2">Endereço de Entrega</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
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

                  {/* Order Date */}
                  <div className="text-center text-sm text-muted-foreground">
                    Pedido realizado em {new Date(selectedOrder.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
