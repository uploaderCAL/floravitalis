import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/data/mock-database"
import { type Batch, BatchQualityStatus } from "@/lib/types/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const productId = searchParams.get("productId")
    const qualityStatus = searchParams.get("qualityStatus")
    const expiring = searchParams.get("expiring") // days until expiration

    let batches = [...mockDatabase.batches]

    // Apply filters
    if (productId) {
      batches = batches.filter((b) => b.productId === productId)
    }

    if (qualityStatus) {
      batches = batches.filter((b) => b.qualityStatus === qualityStatus)
    }

    if (expiring) {
      const daysUntilExpiration = Number.parseInt(expiring)
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + daysUntilExpiration)
      batches = batches.filter((b) => b.expirationDate <= expirationDate)
    }

    // Sort by expiration date (soonest first)
    batches.sort((a, b) => a.expirationDate.getTime() - b.expirationDate.getTime())

    // Pagination
    const total = batches.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedBatches = batches.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedBatches,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Batches GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch batches" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["productId", "quantity", "manufacturingDate", "expirationDate"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate batch number if not provided
    const batchNumber = body.batchNumber || `BATCH${Date.now().toString().slice(-6)}`

    // Generate new batch
    const newBatch: Batch = {
      id: `batch_${Date.now()}`,
      productId: body.productId,
      batchNumber,
      manufacturingDate: new Date(body.manufacturingDate),
      expirationDate: new Date(body.expirationDate),
      quantity: Number.parseInt(body.quantity),
      reservedQuantity: 0,
      availableQuantity: Number.parseInt(body.quantity),
      costPrice: Number.parseFloat(body.costPrice || 0),
      supplier: body.supplier,
      qualityStatus: body.qualityStatus || BatchQualityStatus.PENDING,
      notes: body.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add to mock database
    mockDatabase.batches.push(newBatch)

    return NextResponse.json(
      {
        success: true,
        data: newBatch,
        message: "Batch created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Batches POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create batch" }, { status: 500 })
  }
}
