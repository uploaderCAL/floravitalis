import { NextResponse } from "next/server"
import { withManagerRole, type AuthenticatedRequest } from "@/lib/middleware/auth-middleware"
import { mockDatabase } from "@/lib/data/mock-database"
import { type Product, ProductStatus } from "@/lib/types/database"

// Protected admin endpoint for product management
export const GET = withManagerRole(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let products = [...mockDatabase.products]

    // Apply filters
    if (status && status !== "all") {
      products = products.filter((p) => p.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower),
      )
    }

    // Sort by update date (newest first)
    products.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    // Pagination
    const total = products.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedProducts = products.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      user: req.user, // Include user info for audit
    })
  } catch (error) {
    console.error("Admin products GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
})

export const POST = withManagerRole(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json() // Corrected variable name from request to req

    // Validate required fields
    const requiredFields = ["name", "description", "price", "category", "brand"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate new product
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: body.name,
      slug: body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      description: body.description,
      shortDescription: body.shortDescription || body.description.substring(0, 150),
      sku: body.sku || `SKU${Date.now()}`,
      category: body.category,
      subcategory: body.subcategory,
      brand: body.brand,
      price: Number.parseFloat(body.price),
      comparePrice: body.comparePrice ? Number.parseFloat(body.comparePrice) : undefined,
      costPrice: Number.parseFloat(body.costPrice || body.price * 0.6),
      weight: Number.parseFloat(body.weight || 0),
      dimensions: body.dimensions || { length: 0, width: 0, height: 0 },
      images: body.images || [],
      specifications: body.specifications || [],
      status: body.status || ProductStatus.ACTIVE,
      featured: body.featured || false,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
      batches: [],
    }

    // Add to mock database
    mockDatabase.products.push(newProduct)

    // Log the action
    console.log(`Product created by ${req.user?.name} (${req.user?.email}):`, newProduct.name)

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "Product created successfully",
        createdBy: req.user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Admin products POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
})
