import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/data/mock-database"
import { type Order, OrderStatus, PaymentStatus, ShippingStatus } from "@/lib/types/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let orders = [...mockDatabase.orders]

    // Apply filters
    if (status) {
      orders = orders.filter((o) => o.status === status)
    }

    if (userId) {
      orders = orders.filter((o) => o.userId === userId)
    }

    if (startDate) {
      orders = orders.filter((o) => o.createdAt >= new Date(startDate))
    }

    if (endDate) {
      orders = orders.filter((o) => o.createdAt <= new Date(endDate))
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Pagination
    const total = orders.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedOrders = orders.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["userId", "items", "shippingAddress", "billingAddress"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Calculate totals
    const subtotal = body.items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0)
    const shippingCost = body.shippingCost || 0
    const discount = body.discount || 0
    const total = subtotal + shippingCost - discount

    // Generate new order
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      orderNumber: `FV${Date.now().toString().slice(-6)}`,
      userId: body.userId,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      shippingStatus: ShippingStatus.PENDING,
      items: body.items,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod: body.paymentMethod,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress,
      notes: body.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [
        {
          id: `hist_${Date.now()}`,
          orderId: `order_${Date.now()}`,
          status: OrderStatus.PENDING,
          notes: "Pedido criado",
          userId: body.userId,
          createdAt: new Date(),
        },
      ],
    }

    // Add to mock database
    mockDatabase.orders.push(newOrder)

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
        message: "Order created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Orders POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
