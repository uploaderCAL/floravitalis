"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useEnhancedAuth } from "@/lib/auth/enhanced-auth-context"
import { UserRole } from "@/lib/types/database"
import AdminSidebar from "./admin-sidebar"
import AdminHeader from "./admin-header"

interface AdminLayoutProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export default function AdminLayout({
  children,
  requiredRoles = [UserRole.OPERATOR, UserRole.MANAGER, UserRole.ADMIN],
}: AdminLayoutProps) {
  const { user, isLoading, hasAnyRole } = useEnhancedAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login")
    } else if (!isLoading && user && !hasAnyRole(requiredRoles)) {
      // User is authenticated but doesn't have required role
      router.push("/admin/unauthorized")
    }
  }, [user, isLoading, router, hasAnyRole, requiredRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!hasAnyRole(requiredRoles)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
          <p className="text-sm text-muted-foreground">
            Seu nível: {user.role} | Requerido: {requiredRoles.join(", ")}
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
