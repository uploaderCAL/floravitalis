import { NextResponse } from "next/server"
import { withAdminRole, type AuthenticatedRequest } from "@/lib/middleware/auth-middleware"
import { mockDatabase } from "@/lib/data/mock-database"
import { type UserRole, UserStatus } from "@/lib/types/database"

// Admin-only endpoint for user management
export const GET = withAdminRole(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let users = [...mockDatabase.users]

    // Apply filters
    if (role && role !== "all") {
      users = users.filter((u) => u.role === role)
    }

    if (status && status !== "all") {
      users = users.filter((u) => u.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      users = users.filter(
        (u) => u.name.toLowerCase().includes(searchLower) || u.email.toLowerCase().includes(searchLower),
      )
    }

    // Remove password from response
    const safeUsers = users.map(({ password, ...user }) => user)

    // Sort by creation date (newest first)
    safeUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Pagination
    const total = safeUsers.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedUsers = safeUsers.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      user: req.user,
    })
  } catch (error) {
    console.error("Admin users GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
})

export const POST = withAdminRole(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json()

    // Validate required fields
    const requiredFields = ["name", "email", "password", "role"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if email already exists
    const existingUser = mockDatabase.users.find((u) => u.email === body.email)
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = mockDatabase.createUser({
      name: body.name,
      email: body.email,
      password: body.password, // In production, hash this
      phone: body.phone,
      cpf: body.cpf,
      role: body.role as UserRole,
      status: body.status || UserStatus.ACTIVE,
      addresses: [],
    })

    // Remove password from response
    const { password, ...safeUser } = newUser

    // Log the action
    console.log(`User created by ${req.user?.name} (${req.user?.email}):`, newUser.email)

    return NextResponse.json(
      {
        success: true,
        data: safeUser,
        message: "User created successfully",
        createdBy: req.user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Admin users POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
})
