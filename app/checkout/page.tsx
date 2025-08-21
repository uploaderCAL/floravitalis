"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/currency"
import { PaymentService } from "@/lib/payment/payment-service"
import type { PaymentRequest, PaymentResponse } from "@/lib/payment/types"
import { CreditCard, Smartphone, QrCode, Lock, User, MapPin, AlertCircle, CheckCircle } from "lucide-react"

export default function CheckoutPage() {
  const { items, getTotal, getSubtotal, appliedCoupon, freight, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [selectedGateway, setSelectedGateway] = useState("")
  const [availableGateways, setAvailableGateways] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null)
  const [error, setError] = useState("")

  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    installments: 1,
  })

  // Load available gateways
  useEffect(() => {
    PaymentService.getAvailableGateways()
      .then((data) => {
        setAvailableGateways(data.available)
        setSelectedGateway(data.default)
      })
      .catch((err) => {
        console.error("Failed to load gateways:", err)
        setAvailableGateways(["mercado_pago"])
        setSelectedGateway("mercado_pago")
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsProcessing(true)

    try {
      // Build payment request
      const paymentRequest: PaymentRequest = {
        amount: getTotal(),
        currency: "BRL",
        payment_method: {
          type: paymentMethod as any,
          installments: paymentMethod === "credit_card" ? cardData.installments : undefined,
        },
        customer: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          document: customerData.cpf,
          address: {
            street: customerData.address.street,
            number: customerData.address.number,
            complement: customerData.address.complement,
            neighborhood: customerData.address.neighborhood,
            city: customerData.address.city,
            state: customerData.address.state,
            zip_code: customerData.address.zipCode,
          },
        },
        items: items.map((item) => ({
          id: item.id.toString(),
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        metadata: {
          coupon: appliedCoupon?.code,
          freight_cost: freight,
        },
      }

      // Add card data if needed
      if ((paymentMethod === "credit_card" || paymentMethod === "debit_card") && cardData.number) {
        const [expMonth, expYear] = cardData.expiry.split("/")
        paymentRequest.card = {
          number: cardData.number.replace(/\s/g, ""),
          holder_name: cardData.name,
          exp_month: expMonth,
          exp_year: `20${expYear}`,
          cvv: cardData.cvv,
        }
      }

      // Process payment
      const result = await PaymentService.processPayment(paymentRequest, selectedGateway)
      setPaymentResult(result)

      // Clear cart if payment was successful
      if (result.status === "approved") {
        clearCart()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar pagamento")
    } finally {
      setIsProcessing(false)
    }
  }

  // Show payment result
  if (paymentResult) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-card p-8 rounded-lg border border-border text-center space-y-6">
            {paymentResult.status === "approved" ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h1 className="font-heading font-bold text-3xl text-card-foreground">Pagamento Aprovado!</h1>
                <p className="text-muted-foreground">
                  Seu pedido foi processado com sucesso. Você receberá um e-mail de confirmação em breve.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>ID do Pagamento:</strong> {paymentResult.id}
                  </p>
                  <p className="text-sm">
                    <strong>Valor:</strong> {formatCurrency(paymentResult.transaction_amount)}
                  </p>
                  <p className="text-sm">
                    <strong>Gateway:</strong> {paymentResult.gateway}
                  </p>
                </div>
              </>
            ) : paymentResult.status === "pending" ? (
              <>
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
                <h1 className="font-heading font-bold text-3xl text-card-foreground">Pagamento Pendente</h1>
                {paymentResult.pix_qr_code && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Use o código PIX abaixo para finalizar o pagamento:</p>
                    <div className="bg-muted p-4 rounded-lg">
                      <code className="text-sm break-all">{paymentResult.pix_qr_code}</code>
                    </div>
                  </div>
                )}
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>ID do Pagamento:</strong> {paymentResult.id}
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h1 className="font-heading font-bold text-3xl text-card-foreground">Pagamento Rejeitado</h1>
                <p className="text-muted-foreground">
                  Não foi possível processar seu pagamento. Tente novamente ou use outro método.
                </p>
              </>
            )}

            <button
              onClick={() => (window.location.href = "/")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-heading font-bold text-3xl text-foreground">Carrinho Vazio</h1>
          <p className="text-muted-foreground mt-4">Adicione produtos ao carrinho para continuar</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-8">Finalizar Compra</h1>

        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Data & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gateway Selection */}
              {availableGateways.length > 1 && (
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h2 className="font-semibold text-card-foreground mb-4">Gateway de Pagamento</h2>
                  <div className="space-y-2">
                    {availableGateways.map((gateway) => (
                      <label key={gateway} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="gateway"
                          value={gateway}
                          checked={selectedGateway === gateway}
                          onChange={(e) => setSelectedGateway(e.target.value)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="capitalize">{gateway.replace("_", " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="font-semibold text-card-foreground mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Dados Pessoais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome completo *"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="E-mail *"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Telefone *"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="CPF *"
                    value={customerData.cpf}
                    onChange={(e) => setCustomerData({ ...customerData, cpf: e.target.value })}
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="font-semibold text-card-foreground mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço de Entrega
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="CEP *"
                    value={customerData.address.zipCode}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: { ...customerData.address, zipCode: e.target.value },
                      })
                    }
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Rua *"
                    value={customerData.address.street}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: { ...customerData.address, street: e.target.value },
                      })
                    }
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Número *"
                    value={customerData.address.number}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: { ...customerData.address, number: e.target.value },
                      })
                    }
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Complemento"
                    value={customerData.address.complement}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: { ...customerData.address, complement: e.target.value },
                      })
                    }
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Bairro *"
                    value={customerData.address.neighborhood}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: { ...customerData.address, neighborhood: e.target.value },
                      })
                    }
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Cidade *"
                    value={customerData.address.city}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: { ...customerData.address, city: e.target.value },
                      })
                    }
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <select
                    value={customerData.address.state}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: { ...customerData.address, state: e.target.value },
                      })
                    }
                    required
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Estado *</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="font-semibold text-card-foreground mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Forma de Pagamento
                </h2>

                {/* Payment Options */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="pix"
                      checked={paymentMethod === "pix"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <QrCode className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-medium">PIX</span>
                      <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-medium">Cartão de Crédito</span>
                      <p className="text-sm text-muted-foreground">Parcelamento em até 12x</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="debit_card"
                      checked={paymentMethod === "debit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-medium">Cartão de Débito</span>
                      <p className="text-sm text-muted-foreground">Débito à vista</p>
                    </div>
                  </label>
                </div>

                {/* Credit Card Form */}
                {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
                  <div className="space-y-4 border-t border-border pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Número do cartão"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="md:col-span-2 px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Nome no cartão"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {paymentMethod === "credit_card" && (
                        <select
                          value={cardData.installments}
                          onChange={(e) => setCardData({ ...cardData, installments: Number.parseInt(e.target.value) })}
                          className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value={1}>À vista</option>
                          <option value={2}>2x sem juros</option>
                          <option value={3}>3x sem juros</option>
                          <option value={6}>6x sem juros</option>
                          <option value={12}>12x sem juros</option>
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-card-foreground mb-4">Resumo do Pedido</h3>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(getSubtotal())}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-primary">
                      <span>Desconto:</span>
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
                      <span>Frete:</span>
                      <span>{formatCurrency(freight)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(getTotal())}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Processando..." : "Finalizar Pedido"}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Ao finalizar, você concorda com nossos termos de uso e política de privacidade
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
