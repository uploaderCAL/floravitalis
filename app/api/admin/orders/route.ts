import { NextResponse } from "next/server"
import { withOperatorRole, type AuthenticatedRequest } from "@/lib/middleware/auth-middleware"
import { mockDatabase } from "@/lib/data/mock-database"

// Protected admin endpoint for order management
export const GET = withOperatorRole(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let orders = [...mockDatabase.orders]

    // Apply filters
    if (status) {
      orders = orders.filter((o) => o.status === status)
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
      user: req.user,
    })
  } catch (error) {
    console.error("Admin orders GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
})
