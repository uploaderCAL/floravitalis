"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X, Search } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import CartDrawer from "./cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [logoSettings, setLogoSettings] = useState({
    logoUrl: "",
    logoAlt: "CreatinaMax Logo",
    useCustomLogo: false,
  })

  const { getItemCount } = useCart()

  useEffect(() => {
    const savedLogo = localStorage.getItem("store-logo")
    const savedAlt = localStorage.getItem("store-logo-alt")
    const useCustom = localStorage.getItem("use-custom-logo") === "true"

    if (savedLogo && useCustom) {
      setLogoSettings({
        logoUrl: savedLogo,
        logoAlt: savedAlt || "CreatinaMax Logo",
        useCustomLogo: useCustom,
      })
    }
  }, [])

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              {logoSettings.useCustomLogo && logoSettings.logoUrl ? (
                <img
                  src={logoSettings.logoUrl || "/placeholder.svg"}
                  alt={logoSettings.logoAlt}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl">C</span>
                  </div>
                  <span className="font-heading font-bold text-xl text-foreground">CreatinaMax</span>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link href="/produtos" className="text-foreground hover:text-primary transition-colors">
                Produtos
              </Link>
              <Link href="/quem-somos" className="text-foreground hover:text-primary transition-colors">
                Quem Somos
              </Link>
              <Link href="/contato" className="text-foreground hover:text-primary transition-colors">
                Contato
              </Link>
            </nav>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-foreground hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-foreground hover:text-primary transition-colors">
                  Início
                </Link>
                <Link href="/produtos" className="text-foreground hover:text-primary transition-colors">
                  Produtos
                </Link>
                <Link href="/quem-somos" className="text-foreground hover:text-primary transition-colors">
                  Quem Somos
                </Link>
                <Link href="/contato" className="text-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Header
