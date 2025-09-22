import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/data/mock-database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const order = mockDatabase.orders.find((o) => o.id === id || o.orderNumber === id)

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Order GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const orderIndex = mockDatabase.orders.findIndex((o) => o.id === id)
    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const currentOrder = mockDatabase.orders[orderIndex]

    // Update order
    const updatedOrder = {
      ...currentOrder,
      ...body,
      updatedAt: new Date(),
    }

    // Add status history if status changed
    if (body.status && body.status !== currentOrder.status) {
      updatedOrder.statusHistory.push({
        id: `hist_${Date.now()}`,
        orderId: id,
        status: body.status,
        notes: body.statusNotes || `Status alterado para ${body.status}`,
        userId: body.updatedBy || "system",
        createdAt: new Date(),
      })
    }

    mockDatabase.orders[orderIndex] = updatedOrder

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    })
  } catch (error) {
    console.error("Order PUT error:", error)
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}
