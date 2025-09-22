import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/data/mock-database"
import { UserRole, UserStatus } from "@/lib/types/database"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name: string
    role: UserRole
    status: UserStatus
  }
}

// API route authentication middleware
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Get authorization header
      const authHeader = req.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ success: false, error: "Missing or invalid authorization header" }, { status: 401 })
      }

      // Extract token (in a real app, this would be a JWT)
      const token = authHeader.substring(7)

      // For demo purposes, we'll use email as token
      // In production, you'd verify JWT and extract user info
      const user = mockDatabase.users.find((u) => u.email === token && u.status === UserStatus.ACTIVE)

      if (!user) {
        return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
      }

      // Add user to request
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      }

      return handler(authenticatedReq)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
    }
  }
}

// Role-based authorization middleware
export function withRole(allowedRoles: UserRole[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
    withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user) {
        return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 })
      }

      // Check if user has required role
      const hasPermission =
        allowedRoles.includes(req.user.role) ||
        req.user.role === UserRole.ADMIN || // Admin has access to everything
        (req.user.role === UserRole.MANAGER && allowedRoles.includes(UserRole.OPERATOR)) // Manager can access operator routes

      if (!hasPermission) {
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient permissions",
            requiredRoles: allowedRoles,
            userRole: req.user.role,
          },
          { status: 403 },
        )
      }

      return handler(req)
    })
}

// Admin-only middleware
export const withAdminRole = withRole([UserRole.ADMIN])

// Manager+ middleware (Manager and Admin)
export const withManagerRole = withRole([UserRole.MANAGER, UserRole.ADMIN])

// Operator+ middleware (Operator, Manager, and Admin)
export const withOperatorRole = withRole([UserRole.OPERATOR, UserRole.MANAGER, UserRole.ADMIN])

// Customer middleware (all authenticated users)
export const withCustomerRole = withRole([UserRole.CUSTOMER, UserRole.OPERATOR, UserRole.MANAGER, UserRole.ADMIN])
