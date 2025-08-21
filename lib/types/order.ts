export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface ShippingAddress {
  name: string
  email: string
  phone: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface Order {
  id: string
  customerId?: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "pix" | "credit_card" | "debit_card"
  paymentStatus: "pending" | "approved" | "rejected" | "refunded"
  shippingAddress: ShippingAddress
  couponCode?: string
  trackingCode?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const ORDER_STATUS_LABELS = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
}

export const PAYMENT_STATUS_LABELS = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  refunded: "Reembolsado",
}
