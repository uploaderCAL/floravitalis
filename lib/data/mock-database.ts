import {
  type User,
  type Product,
  type Batch,
  type Order,
  type InventoryMovement,
  type WebhookEvent,
  UserRole,
  UserStatus,
  ProductCategory,
  ProductStatus,
  BatchQualityStatus,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
  PaymentMethod,
  MovementType,
  WebhookEventType,
  WebhookStatus,
} from "@/lib/types/database"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@floravitalis.com.br",
    password: "admin123", // In real app, this would be hashed
    name: "Administrador Sistema",
    phone: "(11) 99999-9999",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    lastLogin: new Date(),
    addresses: [],
  },
  {
    id: "2",
    email: "gerente@floravitalis.com.br",
    password: "gerente123",
    name: "Maria Silva",
    phone: "(11) 98888-8888",
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    addresses: [],
  },
  {
    id: "3",
    email: "operador@floravitalis.com.br",
    password: "operador123",
    name: "João Santos",
    phone: "(11) 97777-7777",
    role: UserRole.OPERATOR,
    status: UserStatus.ACTIVE,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    addresses: [],
  },
  {
    id: "4",
    email: "cliente@email.com",
    password: "cliente123",
    name: "Ana Costa",
    phone: "(11) 96666-6666",
    cpf: "123.456.789-00",
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    addresses: [
      {
        id: "1",
        userId: "4",
        type: "shipping",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 45",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        isDefault: true,
      },
    ],
  },
]

// Mock Products with comprehensive data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Creatina Monohidratada 300g",
    slug: "creatina-monohidratada-300g",
    description:
      "Creatina monohidratada pura de alta qualidade, ideal para aumentar força e potência muscular. Produto testado e aprovado pelos melhores laboratórios do país.",
    shortDescription: "Creatina pura para máxima performance",
    sku: "FV-CREAT-MONO-300",
    category: ProductCategory.CREATINE,
    subcategory: "Monohidratada",
    brand: "Flora Vitalis",
    price: 89.9,
    comparePrice: 119.9,
    costPrice: 45.0,
    weight: 300,
    dimensions: { length: 10, width: 10, height: 12 },
    images: [
      {
        id: "1",
        productId: "1",
        url: "/flora-vitalis-creatine.jpeg",
        alt: "Creatina Monohidratada 300g Flora Vitalis",
        order: 1,
        isPrimary: true,
      },
    ],
    specifications: [
      { id: "1", productId: "1", name: "Peso Líquido", value: "300g", order: 1 },
      { id: "2", productId: "1", name: "Porções por Embalagem", value: "60", order: 2 },
      { id: "3", productId: "1", name: "Creatina por Porção", value: "5g", order: 3 },
    ],
    status: ProductStatus.ACTIVE,
    featured: true,
    seoTitle: "Creatina Monohidratada 300g - Flora Vitalis | Máxima Performance",
    seoDescription:
      "Compre Creatina Monohidratada 300g Flora Vitalis. Produto de alta qualidade para aumentar força e potência muscular. Frete grátis acima de R$ 99.",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    batches: [],
  },
  {
    id: "2",
    name: "Creatina Creapure 500g",
    slug: "creatina-creapure-500g",
    description:
      "Creatina Creapure importada da Alemanha, a mais pura do mundo. Certificada e testada para máxima absorção e resultados.",
    shortDescription: "Creatina alemã premium Creapure",
    sku: "FV-CREAT-CREAP-500",
    category: ProductCategory.CREATINE,
    subcategory: "Creapure",
    brand: "Flora Vitalis",
    price: 129.9,
    comparePrice: 159.9,
    costPrice: 75.0,
    weight: 500,
    dimensions: { length: 12, width: 12, height: 15 },
    images: [
      {
        id: "2",
        productId: "2",
        url: "/flora-vitalis-creatine.jpeg",
        alt: "Creatina Creapure 500g Flora Vitalis",
        order: 1,
        isPrimary: true,
      },
    ],
    specifications: [
      { id: "4", productId: "2", name: "Peso Líquido", value: "500g", order: 1 },
      { id: "5", productId: "2", name: "Porções por Embalagem", value: "100", order: 2 },
      { id: "6", productId: "2", name: "Creatina por Porção", value: "5g", order: 3 },
    ],
    status: ProductStatus.ACTIVE,
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    batches: [],
  },
  {
    id: "3",
    name: "Creatina Creapure 250g",
    slug: "creatina-creapure-250g",
    description:
      "Versão compacta da nossa Creatina Creapure alemã. Ideal para quem quer experimentar a qualidade premium.",
    shortDescription: "Creatina alemã premium formato compacto",
    sku: "FV-CREAT-CREAP-250",
    category: ProductCategory.CREATINE,
    subcategory: "Creapure",
    brand: "Flora Vitalis",
    price: 79.9,
    comparePrice: 99.9,
    costPrice: 45.0,
    weight: 250,
    dimensions: { length: 9, width: 9, height: 11 },
    images: [
      {
        id: "3",
        productId: "3",
        url: "/flora-vitalis-creatine.jpeg",
        alt: "Creatina Creapure 250g Flora Vitalis",
        order: 1,
        isPrimary: true,
      },
    ],
    specifications: [
      { id: "7", productId: "3", name: "Peso Líquido", value: "250g", order: 1 },
      { id: "8", productId: "3", name: "Porções por Embalagem", value: "50", order: 2 },
      { id: "9", productId: "3", name: "Creatina por Porção", value: "5g", order: 3 },
    ],
    status: ProductStatus.ACTIVE,
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    batches: [],
  },
]

// Mock Batches
export const mockBatches: Batch[] = [
  {
    id: "1",
    productId: "1",
    batchNumber: "FV240101001",
    manufacturingDate: new Date("2024-01-01"),
    expirationDate: new Date("2026-01-01"),
    quantity: 1000,
    reservedQuantity: 50,
    availableQuantity: 950,
    costPrice: 45.0,
    supplier: "Fornecedor Premium Ltda",
    qualityStatus: BatchQualityStatus.APPROVED,
    notes: "Lote aprovado em todos os testes de qualidade",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    productId: "2",
    batchNumber: "FV240115001",
    manufacturingDate: new Date("2024-01-15"),
    expirationDate: new Date("2026-01-15"),
    quantity: 500,
    reservedQuantity: 25,
    availableQuantity: 475,
    costPrice: 75.0,
    supplier: "Creapure GmbH",
    qualityStatus: BatchQualityStatus.APPROVED,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    productId: "3",
    batchNumber: "FV240201001",
    manufacturingDate: new Date("2024-02-01"),
    expirationDate: new Date("2026-02-01"),
    quantity: 300,
    reservedQuantity: 15,
    availableQuantity: 285,
    costPrice: 45.0,
    supplier: "Creapure GmbH",
    qualityStatus: BatchQualityStatus.APPROVED,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
]

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "FV-2024-001",
    userId: "4",
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    shippingStatus: ShippingStatus.DELIVERED,
    items: [
      {
        id: "1",
        orderId: "1",
        productId: "1",
        batchId: "1",
        quantity: 2,
        unitPrice: 89.9,
        totalPrice: 179.8,
      },
    ],
    subtotal: 179.8,
    shippingCost: 0,
    discount: 0,
    total: 179.8,
    paymentMethod: PaymentMethod.PIX,
    shippingAddress: {
      id: "1",
      userId: "4",
      type: "shipping",
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      isDefault: true,
    },
    billingAddress: {
      id: "1",
      userId: "4",
      type: "billing",
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      isDefault: true,
    },
    trackingCode: "BR123456789",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-05"),
    statusHistory: [
      {
        id: "1",
        orderId: "1",
        status: OrderStatus.PENDING,
        userId: "4",
        createdAt: new Date("2024-03-01"),
      },
      {
        id: "2",
        orderId: "1",
        status: OrderStatus.CONFIRMED,
        userId: "2",
        createdAt: new Date("2024-03-01"),
      },
      {
        id: "3",
        orderId: "1",
        status: OrderStatus.SHIPPED,
        userId: "3",
        createdAt: new Date("2024-03-02"),
      },
      {
        id: "4",
        orderId: "1",
        status: OrderStatus.DELIVERED,
        userId: "3",
        createdAt: new Date("2024-03-05"),
      },
    ],
  },
]

// Mock Inventory Movements
export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: "1",
    productId: "1",
    batchId: "1",
    type: MovementType.IN,
    quantity: 1000,
    reason: "Entrada inicial do lote",
    userId: "2",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    productId: "1",
    batchId: "1",
    type: MovementType.OUT,
    quantity: 2,
    reason: "Venda - Pedido FV-2024-001",
    userId: "3",
    orderId: "1",
    createdAt: new Date("2024-03-01"),
  },
]

// Mock Webhook Events
export const mockWebhookEvents: WebhookEvent[] = [
  {
    id: "1",
    type: WebhookEventType.ORDER_CREATED,
    payload: {
      orderId: "1",
      orderNumber: "FV-2024-001",
      total: 179.8,
      customerEmail: "cliente@email.com",
    },
    status: WebhookStatus.SUCCESS,
    attempts: 1,
    lastAttempt: new Date("2024-03-01"),
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
]

// Database service functions
export class MockDatabase {
  static users = mockUsers
  static products = mockProducts
  static batches = mockBatches
  static orders = mockOrders
  static inventoryMovements = mockInventoryMovements
  static webhookEvents = mockWebhookEvents

  // User methods
  static findUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email)
  }

  static findUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id)
  }

  static createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const newUser: User = {
      ...userData,
      id: (this.users.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  }

  // Product methods
  static findProductBySlug(slug: string): Product | undefined {
    return this.products.find((product) => product.slug === slug)
  }

  static findProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id)
  }

  static getActiveProducts(): Product[] {
    return this.products.filter((product) => product.status === ProductStatus.ACTIVE)
  }

  static getFeaturedProducts(): Product[] {
    return this.products.filter((product) => product.featured && product.status === ProductStatus.ACTIVE)
  }

  // Batch methods
  static getBatchesByProductId(productId: string): Batch[] {
    return this.batches.filter((batch) => batch.productId === productId)
  }

  static getAvailableStock(productId: string): number {
    const productBatches = this.getBatchesByProductId(productId)
    return productBatches.reduce((total, batch) => total + batch.availableQuantity, 0)
  }

  // Order methods
  static findOrderById(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id)
  }

  static getOrdersByUserId(userId: string): Order[] {
    return this.orders.filter((order) => order.userId === userId)
  }

  static createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Order {
    const orderNumber = `FV-${new Date().getFullYear()}-${String(this.orders.length + 1).padStart(3, "0")}`
    const newOrder: Order = {
      ...orderData,
      id: (this.orders.length + 1).toString(),
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.orders.push(newOrder)
    return newOrder
  }

  // Analytics methods
  static getTotalRevenue(): number {
    return this.orders
      .filter((order) => order.paymentStatus === PaymentStatus.PAID)
      .reduce((total, order) => total + order.total, 0)
  }

  static getTotalOrders(): number {
    return this.orders.length
  }

  static getTotalCustomers(): number {
    return this.users.filter((user) => user.role === UserRole.CUSTOMER).length
  }

  static getAverageOrderValue(): number {
    const paidOrders = this.orders.filter((order) => order.paymentStatus === PaymentStatus.PAID)
    if (paidOrders.length === 0) return 0
    return this.getTotalRevenue() / paidOrders.length
  }
}

export const mockDatabase = {
  users: mockUsers,
  products: mockProducts,
  batches: mockBatches,
  orders: mockOrders,
  inventoryMovements: mockInventoryMovements,
  webhookEvents: mockWebhookEvents,
}
