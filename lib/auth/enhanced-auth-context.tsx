"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, UserRole, UserStatus, MockDatabase } from "@/lib/types/database"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  isAdmin: boolean
  isManager: boolean
  isOperator: boolean
  isCustomer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] Auth provider initializing...")
    // Check for stored session
    const storedUser = localStorage.getItem("floravitalis-user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        console.log("[v0] Found stored user:", userData.email)
        // Verify user still exists in database
        const currentUser = MockDatabase.findUserById(userData.id)
        if (currentUser && currentUser.status === UserStatus.ACTIVE) {
          console.log("[v0] User verified and active")
          setUser(currentUser)
        } else {
          console.log("[v0] User not found or inactive, clearing storage")
          localStorage.removeItem("floravitalis-user")
        }
      } catch (error) {
        console.log("[v0] Error parsing stored user:", error)
        localStorage.removeItem("floravitalis-user")
      }
    }
    setIsLoading(false)
    console.log("[v0] Auth provider initialized")
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log("[v0] Login attempt for:", email)

    try {
      console.log("[v0] Searching for user in database...")
      const foundUser = MockDatabase.findUserByEmail(email)
      console.log("[v0] User found:", foundUser ? foundUser.email : "not found")

      if (!foundUser) {
        console.log("[v0] User not found in database")
        return { success: false, error: "Usuário não encontrado" }
      }

      console.log("[v0] Checking password...")
      if (foundUser.password !== password) {
        console.log("[v0] Password mismatch")
        return { success: false, error: "Senha incorreta" }
      }

      console.log("[v0] Checking user status:", foundUser.status)
      if (foundUser.status !== UserStatus.ACTIVE) {
        console.log("[v0] User not active")
        return { success: false, error: "Usuário inativo ou suspenso" }
      }

      console.log("[v0] Login successful, updating user data...")
      // Update last login
      foundUser.lastLogin = new Date()

      setUser(foundUser)
      localStorage.setItem("floravitalis-user", JSON.stringify(foundUser))

      console.log("[v0] Login completed successfully")
      return { success: true }
    } catch (error) {
      console.error("[v0] Login error:", error)
      return { success: false, error: "Erro interno do servidor" }
    }
  }

  const logout = () => {
    console.log("[v0] Logging out user")
    setUser(null)
    localStorage.removeItem("floravitalis-user")
  }

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  const isAdmin = user?.role === UserRole.ADMIN
  const isManager = user?.role === UserRole.MANAGER || isAdmin
  const isOperator = user?.role === UserRole.OPERATOR || isManager
  const isCustomer = user?.role === UserRole.CUSTOMER

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isOperator,
    isCustomer,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useEnhancedAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useEnhancedAuth must be used within an EnhancedAuthProvider")
  }
  return context
}

// Role-based access control hook
export function useRoleGuard(allowedRoles: UserRole[]) {
  const { user, hasAnyRole } = useEnhancedAuth()

  const hasAccess = user && hasAnyRole(allowedRoles)
  const isLoading = !user

  return { hasAccess, isLoading, user }
}

// Admin access guard component
export function AdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { hasAnyRole } = useEnhancedAuth()

  if (!hasAnyRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR])) {
    return fallback || <div>Acesso negado</div>
  }

  return <>{children}</>
}
