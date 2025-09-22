"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEnhancedAuth } from "@/lib/auth/enhanced-auth-context"
import { Lock, User, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useEnhancedAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted with:", { email, password: password ? "***" : "empty" })
    setError("")
    setIsLoading(true)

    try {
      console.log("[v0] Calling login function...")
      const result = await login(email, password)
      console.log("[v0] Login result:", result)

      if (result.success) {
        console.log("[v0] Login successful, redirecting to admin...")
        router.push("/admin")
      } else {
        console.log("[v0] Login failed:", result.error)
        setError(result.error || "Erro ao fazer login")
      }
    } catch (err) {
      console.error("[v0] Login exception:", err)
      setError("Erro interno do servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">FV</span>
            </div>
          </div>
          <h2 className="mt-6 font-heading font-bold text-3xl text-foreground">Admin Flora Vitalis</h2>
          <p className="mt-2 text-muted-foreground">Faça login para acessar o painel administrativo</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="E-mail"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Credenciais de demonstração:</p>
              <div className="space-y-1">
                <p>
                  <strong>Admin:</strong> admin@floravitalis.com.br / admin123
                </p>
                <p>
                  <strong>Gerente:</strong> gerente@floravitalis.com.br / gerente123
                </p>
                <p>
                  <strong>Operador:</strong> operador@floravitalis.com.br / operador123
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
