"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Package, Search, Eye, Truck, CheckCircle, XCircle, Clock, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MockDatabase, type Order, type OrderStatusHistory } from "@/lib/data/mock-database"
import { OrderStatus, PaymentStatus, ShippingStatus, PaymentMethod } from "@/lib/types/database"

interface StatusUpdateData {
  orderId: string
  newStatus: OrderStatus
  notes: string
  trackingCode?: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all") // all, today, week, month
  const [isLoading, setIsLoading] = useState(true)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false)
  const [statusUpdateData, setStatusUpdateData] = useState<StatusUpdateData>({
    orderId: "",
    newStatus: OrderStatus.PENDING,
    notes: "",
    trackingCode: "",
  })

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const allOrders = MockDatabase.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setOrders(allOrders)
    setIsLoading(false)
  }

  const filteredOrders = orders.filter((order) => {
    const customer = MockDatabase.findUserById(order.userId)
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const orderDate = new Date(order.createdAt)
      const today = new Date()

      if (dateFilter === "today") {
        matchesDate = orderDate.toDateString() === today.toDateString()
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesDate = orderDate >= weekAgo
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesDate = orderDate >= monthAgo
      }
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate
  })

  const handleStatusUpdate = (order: Order) => {
    setStatusUpdateData({
      orderId: order.id,
      newStatus: getNextStatus(order.status),
      notes: "",
      trackingCode: order.trackingCode || "",
    })
    setIsStatusUpdateOpen(true)
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return OrderStatus.CONFIRMED
      case OrderStatus.CONFIRMED:
        return OrderStatus.PROCESSING
      case OrderStatus.PROCESSING:
        return OrderStatus.SHIPPED
      case OrderStatus.SHIPPED:
        return OrderStatus.DELIVERED
      default:
        return currentStatus
    }
  }

  const submitStatusUpdate = () => {
    const order = orders.find((o) => o.id === statusUpdateData.orderId)
    if (!order) return

    // Update order status
    order.status = statusUpdateData.newStatus
    order.updatedAt = new Date()

    if (statusUpdateData.trackingCode) {
      order.trackingCode = statusUpdateData.trackingCode
    }

    // Update shipping status based on order status
    if (statusUpdateData.newStatus === OrderStatus.SHIPPED) {
      order.shippingStatus = ShippingStatus.SHIPPED
    } else if (statusUpdateData.newStatus === OrderStatus.DELIVERED) {
      order.shippingStatus = ShippingStatus.DELIVERED
    }

    // Add status history entry
    const statusHistory: OrderStatusHistory = {
      id: (order.statusHistory.length + 1).toString(),
      orderId: order.id,
      status: statusUpdateData.newStatus,
      notes: statusUpdateData.notes,
      userId: "1", // Current admin user
      createdAt: new Date(),
    }
    order.statusHistory.push(statusHistory)

    // Update the orders array
    setOrders([...orders])
    MockDatabase.orders = orders

    setIsStatusUpdateOpen(false)

    // If order details is open for this order, refresh it
    if (selectedOrder?.id === order.id) {
      setSelectedOrder(order)
    }
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.PROCESSING:
        return "bg-purple-100 text-purple-800"
      case OrderStatus.SHIPPED:
        return "bg-indigo-100 text-indigo-800"
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800"
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800"
      case OrderStatus.RETURNED:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Pendente"
      case OrderStatus.CONFIRMED:
        return "Confirmado"
      case OrderStatus.PROCESSING:
        return "Processando"
      case OrderStatus.SHIPPED:
        return "Enviado"
      case OrderStatus.DELIVERED:
        return "Entregue"
      case OrderStatus.CANCELLED:
        return "Cancelado"
      case OrderStatus.RETURNED:
        return "Devolvido"
      default:
        return status
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case PaymentStatus.PAID:
        return "bg-green-100 text-green-800"
      case PaymentStatus.FAILED:
        return "bg-red-100 text-red-800"
      case PaymentStatus.REFUNDED:
        return "bg-gray-100 text-gray-800"
      case PaymentStatus.PARTIALLY_REFUNDED:
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusText = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return "Pendente"
      case PaymentStatus.PAID:
        return "Pago"
      case PaymentStatus.FAILED:
        return "Falhou"
      case PaymentStatus.REFUNDED:
        return "Reembolsado"
      case PaymentStatus.PARTIALLY_REFUNDED:
        return "Parcialmente Reembolsado"
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return "Cartão de Crédito"
      case PaymentMethod.DEBIT_CARD:
        return "Cartão de Débito"
      case PaymentMethod.PIX:
        return "PIX"
      case PaymentMethod.BANK_SLIP:
        return "Boleto"
      case PaymentMethod.PAYPAL:
        return "PayPal"
      default:
        return method
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-4 h-4" />
      case OrderStatus.CONFIRMED:
        return <CheckCircle className="w-4 h-4" />
      case OrderStatus.PROCESSING:
        return <Package className="w-4 h-4" />
      case OrderStatus.SHIPPED:
        return <Truck className="w-4 h-4" />
      case OrderStatus.DELIVERED:
        return <CheckCircle className="w-4 h-4" />
      case OrderStatus.CANCELLED:
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando pedidos...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING).length
  const processingOrders = orders.filter((o) => o.status === OrderStatus.PROCESSING).length
  const shippedOrders = orders.filter((o) => o.status === OrderStatus.SHIPPED).length
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, order) => sum + order.total, 0)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Gerenciamento de Pedidos</h1>
            <p className="text-muted-foreground">Gerencie todos os pedidos e acompanhe status</p>
          </div>
          <div className="text-sm text-muted-foreground">Total: {totalOrders} pedidos</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Pedidos Pendentes</p>
                <p className="text-2xl font-bold text-card-foreground">{pendingOrders}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Processando</p>
                <p className="text-2xl font-bold text-card-foreground">{processingOrders}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Enviados</p>
                <p className="text-2xl font-bold text-card-foreground">{shippedOrders}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Receita Total</p>
                <p className="text-2xl font-bold text-card-foreground">
                  R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
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
                  placeholder="Buscar por número do pedido, cliente ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value={OrderStatus.PENDING}>Pendente</option>
                <option value={OrderStatus.CONFIRMED}>Confirmado</option>
                <option value={OrderStatus.PROCESSING}>Processando</option>
                <option value={OrderStatus.SHIPPED}>Enviado</option>
                <option value={OrderStatus.DELIVERED}>Entregue</option>
                <option value={OrderStatus.CANCELLED}>Cancelado</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os pagamentos</option>
                <option value={PaymentStatus.PENDING}>Pendente</option>
                <option value={PaymentStatus.PAID}>Pago</option>
                <option value={PaymentStatus.FAILED}>Falhou</option>
                <option value={PaymentStatus.REFUNDED}>Reembolsado</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todas as datas</option>
                <option value="today">Hoje</option>
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Pedido</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Pagamento</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const customer = MockDatabase.findUserById(order.userId)

                  return (
                    <tr key={order.id} className="border-t border-border hover:bg-muted/25">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-card-foreground">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">ID: {order.id}</p>
                          {order.trackingCode && (
                            <p className="text-xs text-muted-foreground">Rastreio: {order.trackingCode}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-card-foreground">{customer?.name}</p>
                          <p className="text-sm text-muted-foreground">{customer?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-card-foreground">
                            R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${getPaymentStatusColor(order.paymentStatus)}`}
                          >
                            {getPaymentStatusText(order.paymentStatus)}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getPaymentMethodText(order.paymentMethod)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-card-foreground">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => viewOrderDetails(order)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          {order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
                            <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(order)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Atualizar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Os pedidos aparecerão aqui quando forem realizados"}
            </p>
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido {selectedOrder?.orderNumber}</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Status and Payment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(selectedOrder.status)}
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}
                  >
                    {getPaymentStatusText(selectedOrder.paymentStatus)}
                  </span>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Informações do Cliente</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    {(() => {
                      const customer = MockDatabase.findUserById(selectedOrder.userId)
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p>
                              <strong>Nome:</strong> {customer?.name}
                            </p>
                            <p>
                              <strong>Email:</strong> {customer?.email}
                            </p>
                            <p>
                              <strong>Telefone:</strong> {customer?.phone}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>CPF:</strong> {customer?.cpf || "N/A"}
                            </p>
                            <p>
                              <strong>Cliente desde:</strong>{" "}
                              {customer ? new Date(customer.createdAt).toLocaleDateString("pt-BR") : "N/A"}
                            </p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Endereço de Entrega</h3>
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
                  <h3 className="font-semibold text-lg mb-3">Itens do Pedido</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => {
                      const product = MockDatabase.findProductById(item.productId)
                      const primaryImage = product?.images.find((img) => img.isPrimary) || product?.images[0]

                      return (
                        <div key={item.id} className="flex items-center space-x-4 bg-muted/50 p-4 rounded-lg">
                          <img
                            src={primaryImage?.url || "/placeholder.svg"}
                            alt={product?.name || "Produto"}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-card-foreground">{product?.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              SKU: {product?.sku} | Quantidade: {item.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Preço unitário: R$ {item.unitPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="font-medium text-card-foreground">
                            R$ {item.totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Resumo do Pedido</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {selectedOrder.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>R$ {selectedOrder.shippingCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto:</span>
                        <span>-R$ {selectedOrder.discount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>R$ {selectedOrder.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Histórico de Status</h3>
                  <div className="space-y-3">
                    {selectedOrder.statusHistory.map((history) => {
                      const user = MockDatabase.findUserById(history.userId)
                      return (
                        <div key={history.id} className="flex items-start space-x-3 bg-muted/50 p-4 rounded-lg">
                          {getStatusIcon(history.status)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(history.status)}`}>
                                {getStatusText(history.status)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                por {user?.name} em {new Date(history.createdAt).toLocaleString("pt-BR")}
                              </span>
                            </div>
                            {history.notes && <p className="text-sm text-card-foreground mt-1">{history.notes}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tracking Code */}
                {selectedOrder.trackingCode && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Código de Rastreamento</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <code className="text-sm font-mono">{selectedOrder.trackingCode}</code>
                    </div>
                  </div>
                )}

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Observações</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Atualizar Status do Pedido</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Novo Status</label>
                <Select
                  value={statusUpdateData.newStatus}
                  onValueChange={(value: OrderStatus) => setStatusUpdateData({ ...statusUpdateData, newStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.PENDING}>Pendente</SelectItem>
                    <SelectItem value={OrderStatus.CONFIRMED}>Confirmado</SelectItem>
                    <SelectItem value={OrderStatus.PROCESSING}>Processando</SelectItem>
                    <SelectItem value={OrderStatus.SHIPPED}>Enviado</SelectItem>
                    <SelectItem value={OrderStatus.DELIVERED}>Entregue</SelectItem>
                    <SelectItem value={OrderStatus.CANCELLED}>Cancelado</SelectItem>
                    <SelectItem value={OrderStatus.RETURNED}>Devolvido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {statusUpdateData.newStatus === OrderStatus.SHIPPED && (
                <div>
                  <label className="block text-sm font-medium mb-2">Código de Rastreamento</label>
                  <Input
                    value={statusUpdateData.trackingCode}
                    onChange={(e) => setStatusUpdateData({ ...statusUpdateData, trackingCode: e.target.value })}
                    placeholder="BR123456789"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <Textarea
                  value={statusUpdateData.notes}
                  onChange={(e) => setStatusUpdateData({ ...statusUpdateData, notes: e.target.value })}
                  placeholder="Adicione observações sobre a atualização do status..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsStatusUpdateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={submitStatusUpdate}>Atualizar Status</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
