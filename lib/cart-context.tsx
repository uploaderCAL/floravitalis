"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  variant?: string
}

export interface Coupon {
  code: string
  discount: number
  type: "percentage" | "fixed"
  minValue?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  getItemCount: () => number
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  appliedCoupon: Coupon | null
  freight: number
  setFreight: (value: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [freight, setFreight] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("creatinamax-cart")
    const savedCoupon = localStorage.getItem("creatinamax-coupon")
    const savedFreight = localStorage.getItem("creatinamax-freight")

    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon))
    }
    if (savedFreight) {
      setFreight(Number.parseFloat(savedFreight))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("creatinamax-cart", JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("creatinamax-coupon", JSON.stringify(appliedCoupon))
    } else {
      localStorage.removeItem("creatinamax-coupon")
    }
  }, [appliedCoupon])

  useEffect(() => {
    localStorage.setItem("creatinamax-freight", freight.toString())
  }, [freight])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prev.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
    setFreight(0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotal = () => {
    let total = getSubtotal()

    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        total = total * (1 - appliedCoupon.discount / 100)
      } else {
        total = total - appliedCoupon.discount
      }
    }

    return Math.max(0, total + freight)
  }

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const applyCoupon = (coupon: Coupon) => {
    const subtotal = getSubtotal()
    if (coupon.minValue && subtotal < coupon.minValue) {
      throw new Error(`Valor mínimo de R$ ${coupon.minValue.toFixed(2)} não atingido`)
    }
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getSubtotal,
        getItemCount,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        freight,
        setFreight,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
