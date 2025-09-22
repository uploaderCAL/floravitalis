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
    // Check for stored session
    const storedUser = localStorage.getItem("floravitalis-user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        // Verify user still exists in database
        const currentUser = MockDatabase.findUserById(userData.id)
        if (currentUser && currentUser.status === UserStatus.ACTIVE) {
          setUser(currentUser)
        } else {
          localStorage.removeItem("floravitalis-user")
        }
      } catch (error) {
        localStorage.removeItem("floravitalis-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const foundUser = MockDatabase.findUserByEmail(email)

      if (!foundUser) {
        return { success: false, error: "Usuário não encontrado" }
      }

      if (foundUser.password !== password) {
        return { success: false, error: "Senha incorreta" }
      }

      if (foundUser.status !== UserStatus.ACTIVE) {
        return { success: false, error: "Usuário inativo ou suspenso" }
      }

      // Update last login
      foundUser.lastLogin = new Date()

      setUser(foundUser)
      localStorage.setItem("floravitalis-user", JSON.stringify(foundUser))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Erro interno do servidor" }
    }
  }

  const logout = () => {
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
