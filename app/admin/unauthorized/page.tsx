"use client"

import { useRouter } from "next/navigation"
import { useEnhancedAuth } from "@/lib/auth/enhanced-auth-context"
import { Shield, ArrowLeft, LogOut } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()
  const { user, logout } = useEnhancedAuth()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("/admin")
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta área do sistema.</p>
        </div>

        {user && (
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Usuário atual:</p>
            <p className="font-semibold text-card-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{user.role}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-secondary/90 transition-colors inline-flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Ir para Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-destructive text-destructive-foreground py-2 px-4 rounded-lg font-semibold hover:bg-destructive/90 transition-colors inline-flex items-center justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Fazer Logout
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Se você acredita que deveria ter acesso a esta área,</p>
          <p>entre em contato com o administrador do sistema.</p>
        </div>
      </div>
    </div>
  )
}
