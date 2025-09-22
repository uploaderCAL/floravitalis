import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/data/mock-database"
import { type InventoryMovement, MovementType } from "@/lib/types/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const productId = searchParams.get("productId")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let movements = [...mockDatabase.inventoryMovements]

    // Apply filters
    if (productId) {
      movements = movements.filter((m) => m.productId === productId)
    }

    if (type) {
      movements = movements.filter((m) => m.type === type)
    }

    if (startDate) {
      movements = movements.filter((m) => m.createdAt >= new Date(startDate))
    }

    if (endDate) {
      movements = movements.filter((m) => m.createdAt <= new Date(endDate))
    }

    // Sort by creation date (newest first)
    movements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Pagination
    const total = movements.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedMovements = movements.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedMovements,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Inventory movements GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch inventory movements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["productId", "type", "quantity", "reason", "userId"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create inventory movement
    const newMovement: InventoryMovement = {
      id: `movement_${Date.now()}`,
      productId: body.productId,
      batchId: body.batchId,
      type: body.type as MovementType,
      quantity: Number.parseInt(body.quantity),
      reason: body.reason,
      userId: body.userId,
      orderId: body.orderId,
      createdAt: new Date(),
    }

    // Update batch quantities if batchId provided
    if (body.batchId) {
      const batch = mockDatabase.batches.find((b) => b.id === body.batchId)
      if (batch) {
        if (body.type === MovementType.IN) {
          batch.quantity += newMovement.quantity
          batch.availableQuantity += newMovement.quantity
        } else if (body.type === MovementType.OUT) {
          batch.availableQuantity -= newMovement.quantity
        }
        batch.updatedAt = new Date()
      }
    }

    // Add to mock database
    mockDatabase.inventoryMovements.push(newMovement)

    return NextResponse.json(
      {
        success: true,
        data: newMovement,
        message: "Inventory movement recorded successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Inventory movements POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to record inventory movement" }, { status: 500 })
  }
}
