export interface User {
  id: string
  email: string
  password: string // In real app, this would be hashed
  name: string
  phone?: string
  cpf?: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  addresses: Address[]
}

export interface Address {
  id: string
  userId: string
  type: "billing" | "shipping"
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  category: ProductCategory
  subcategory?: string
  brand: string
  price: number
  comparePrice?: number
  costPrice: number
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  images: ProductImage[]
  specifications: ProductSpecification[]
  status: ProductStatus
  featured: boolean
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
  batches: Batch[]
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt: string
  order: number
  isPrimary: boolean
}

export interface ProductSpecification {
  id: string
  productId: string
  name: string
  value: string
  order: number
}

export interface Batch {
  id: string
  productId: string
  batchNumber: string
  manufacturingDate: Date
  expirationDate: Date
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  costPrice: number
  supplier?: string
  qualityStatus: BatchQualityStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryMovement {
  id: string
  productId: string
  batchId?: string
  type: MovementType
  quantity: number
  reason: string
  userId: string
  orderId?: string
  createdAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingStatus: ShippingStatus
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  shippingAddress: Address
  billingAddress: Address
  trackingCode?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  statusHistory: OrderStatusHistory[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  batchId?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderStatusHistory {
  id: string
  orderId: string
  status: OrderStatus
  notes?: string
  userId: string
  createdAt: Date
}

export interface WebhookEvent {
  id: string
  type: WebhookEventType
  payload: Record<string, any>
  status: WebhookStatus
  attempts: number
  lastAttempt?: Date
  nextAttempt?: Date
  createdAt: Date
  updatedAt: Date
}

// Enums
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  OPERATOR = "operator",
  CUSTOMER = "customer",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum ProductCategory {
  CREATINE = "creatine",
  PROTEIN = "protein",
  VITAMINS = "vitamins",
  AMINO_ACIDS = "amino_acids",
  PRE_WORKOUT = "pre_workout",
  POST_WORKOUT = "post_workout",
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued",
}

export enum BatchQualityStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export enum MovementType {
  IN = "in",
  OUT = "out",
  ADJUSTMENT = "adjustment",
  TRANSFER = "transfer",
  RETURN = "return",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

export enum ShippingStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  SHIPPED = "shipped",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  FAILED = "failed",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  PIX = "pix",
  BANK_SLIP = "bank_slip",
  PAYPAL = "paypal",
}

export enum WebhookEventType {
  ORDER_CREATED = "order.created",
  ORDER_UPDATED = "order.updated",
  ORDER_CANCELLED = "order.cancelled",
  PAYMENT_CONFIRMED = "payment.confirmed",
  INVENTORY_LOW = "inventory.low",
  BATCH_EXPIRED = "batch.expired",
}

export enum WebhookStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  RETRYING = "retrying",
}

// Dashboard Analytics Types
export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  topProducts: ProductSales[]
  recentOrders: Order[]
  lowStockProducts: Product[]
  expiringBatches: Batch[]
}

export interface ProductSales {
  productId: string
  productName: string
  totalSold: number
  revenue: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Mock Database Interface
export interface MockDatabase {
  users: User[]
  products: Product[]
  batches: Batch[]
  orders: Order[]
  inventoryMovements: InventoryMovement[]
  webhookEvents: WebhookEvent[]
}
