import type { Order } from "@/lib/types/order"

// Mock orders data for demo
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerEmail: "cliente@email.com",
    items: [
      {
        id: "1",
        productId: "creatina-monohidratada",
        name: "Creatina Monohidratada 300g",
        price: 89.9,
        quantity: 2,
        image: "/creatine-powder.png",
      },
    ],
    subtotal: 179.8,
    shipping: 15.0,
    discount: 0,
    total: 194.8,
    status: "processing",
    paymentMethod: "pix",
    paymentStatus: "approved",
    shippingAddress: {
      name: "João Silva",
      email: "cliente@email.com",
      phone: "(11) 99999-9999",
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
    },
    trackingCode: "BR123456789",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "ORD-002",
    customerEmail: "maria@email.com",
    items: [
      {
        id: "2",
        productId: "creatina-creapure",
        name: "Creatina Creapure 250g",
        price: 129.9,
        quantity: 1,
        image: "/placeholder-ugk65.png",
      },
    ],
    subtotal: 129.9,
    shipping: 12.0,
    discount: 13.0,
    total: 128.9,
    status: "shipped",
    paymentMethod: "credit_card",
    paymentStatus: "approved",
    shippingAddress: {
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(21) 88888-8888",
      street: "Av. Copacabana",
      number: "456",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "22070-001",
    },
    couponCode: "PRIMEIRA10",
    trackingCode: "BR987654321",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
]

export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockOrders
  }

  static async getOrderById(id: string): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockOrders.find((order) => order.id === id) || null
  }

  static async getOrdersByEmail(email: string): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockOrders.filter((order) => order.customerEmail === email)
  }

  static async updateOrderStatus(id: string, status: Order["status"], trackingCode?: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const orderIndex = mockOrders.findIndex((order) => order.id === id)
    if (orderIndex !== -1) {
      mockOrders[orderIndex].status = status
      mockOrders[orderIndex].updatedAt = new Date().toISOString()
      if (trackingCode) {
        mockOrders[orderIndex].trackingCode = trackingCode
      }
      return true
    }
    return false
  }

  static async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(mockOrders.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockOrders.unshift(newOrder)
    return newOrder
  }
}
