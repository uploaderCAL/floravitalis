"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { Bell, LogOut, User } from "lucide-react"

export default function AdminHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="lg:ml-0 ml-12">
          <h1 className="font-heading font-semibold text-xl text-foreground">Painel Administrativo</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{user?.name}</span>
          </div>

          <button
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
