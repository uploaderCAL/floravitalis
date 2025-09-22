import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/data/mock-database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const product = mockDatabase.products.find((p) => p.id === id || p.slug === id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error("Product GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const productIndex = mockDatabase.products.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Update product
    const updatedProduct = {
      ...mockDatabase.products[productIndex],
      ...body,
      updatedAt: new Date(),
    }

    mockDatabase.products[productIndex] = updatedProduct

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Product PUT error:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const productIndex = mockDatabase.products.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Remove product
    mockDatabase.products.splice(productIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Product DELETE error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
