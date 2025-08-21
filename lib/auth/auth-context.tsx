"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "editor"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Demo users for development
  const demoUsers = [
    {
      id: "1",
      email: "admin@creatinamax.com.br",
      password: "admin123",
      name: "Admin CreatinaMax",
      role: "admin" as const,
    },
    {
      id: "2",
      email: "editor@creatinamax.com.br",
      password: "editor123",
      name: "Editor CreatinaMax",
      role: "editor" as const,
    },
  ]

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem("creatinamax-admin-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Demo authentication - in production, this would call an API
    const foundUser = demoUsers.find((u) => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error("Credenciais inválidas")
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem("creatinamax-admin-user", JSON.stringify(userWithoutPassword))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("creatinamax-admin-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
