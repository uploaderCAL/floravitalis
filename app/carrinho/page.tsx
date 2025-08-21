"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/currency"
import { getCEPInfo, calculateFreight } from "@/lib/freight"
import { Plus, Minus, X, Truck, Tag, CreditCard } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotal,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    freight,
    setFreight,
  } = useCart()

  const [cep, setCep] = useState("")
  const [cepInfo, setCepInfo] = useState<any>(null)
  const [freightOptions, setFreightOptions] = useState<any[]>([])
  const [selectedFreight, setSelectedFreight] = useState<any>(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [isCalculatingFreight, setIsCalculatingFreight] = useState(false)

  // Mock coupons for demo
  const availableCoupons = [
    { code: "PRIMEIRA10", discount: 10, type: "percentage" as const, minValue: 50 },
    { code: "FRETE20", discount: 20, type: "fixed" as const, minValue: 100 },
    { code: "CREATINA15", discount: 15, type: "percentage" as const, minValue: 80 },
  ]

  const handleCalculateFreight = async () => {
    if (!cep) return

    setIsCalculatingFreight(true)
    try {
      const info = await getCEPInfo(cep)
      setCepInfo(info)

      // Calculate total weight (assuming 300g per product for demo)
      const totalWeight = items.reduce((weight, item) => weight + item.quantity * 300, 0)
      const options = calculateFreight(cep, totalWeight)
      setFreightOptions(options)
    } catch (error) {
      alert("Erro ao calcular frete: " + (error as Error).message)
    } finally {
      setIsCalculatingFreight(false)
    }
  }

  const handleSelectFreight = (option: any) => {
    setSelectedFreight(option)
    setFreight(option.price)
  }

  const handleApplyCoupon = () => {
    setCouponError("")
    const coupon = availableCoupons.find((c) => c.code === couponCode.toUpperCase())

    if (!coupon) {
      setCouponError("Cupom inválido")
      return
    }

    try {
      applyCoupon(coupon)
      setCouponCode("")
    } catch (error) {
      setCouponError((error as Error).message)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <h1 className="font-heading font-bold text-3xl text-foreground">Carrinho Vazio</h1>
          <p className="text-muted-foreground">Adicione produtos ao seu carrinho para continuar</p>
          <Link
            href="/produtos"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
          >
            Ver Produtos
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-8">Carrinho de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors mt-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Freight Calculator */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Calcular Frete
              </h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={handleCalculateFreight}
                    disabled={isCalculatingFreight || cep.length !== 8}
                    className="w-full mt-2 bg-secondary text-secondary-foreground py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50"
                  >
                    {isCalculatingFreight ? "Calculando..." : "Calcular"}
                  </button>
                </div>

                {cepInfo && (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {cepInfo.localidade} - {cepInfo.uf}
                    </p>
                  </div>
                )}

                {freightOptions.length > 0 && (
                  <div className="space-y-2">
                    {freightOptions.map((option, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="freight"
                          value={option.name}
                          onChange={() => handleSelectFreight(option)}
                          className="text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{option.name}</span>
                            <span className="font-semibold">{formatCurrency(option.price)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Entrega em {option.days} dias úteis</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Cupom de Desconto
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                  <div>
                    <span className="font-semibold text-primary">{appliedCoupon.code}</span>
                    <p className="text-sm text-muted-foreground">
                      {appliedCoupon.type === "percentage"
                        ? `${appliedCoupon.discount}% de desconto`
                        : `${formatCurrency(appliedCoupon.discount)} de desconto`}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Digite o código do cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
                  >
                    Aplicar Cupom
                  </button>
                  {couponError && <p className="text-sm text-destructive">{couponError}</p>}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-card-foreground mb-4">Resumo do Pedido</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-primary">
                    <span>Desconto ({appliedCoupon.code}):</span>
                    <span>
                      -
                      {appliedCoupon.type === "percentage"
                        ? formatCurrency(getSubtotal() * (appliedCoupon.discount / 100))
                        : formatCurrency(appliedCoupon.discount)}
                    </span>
                  </div>
                )}
                {freight > 0 && (
                  <div className="flex justify-between">
                    <span>Frete ({selectedFreight?.name}):</span>
                    <span>{formatCurrency(freight)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(getTotal())}</span>
                  </div>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center block flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Finalizar Compra
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
