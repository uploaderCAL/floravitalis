import type { PaymentGateway, PaymentRequest, PaymentResponse } from "./types"

export class MercadoPagoGateway implements PaymentGateway {
  name = "mercado_pago"
  private accessToken: string
  private isDevelopment: boolean

  constructor(accessToken: string, isDevelopment = false) {
    this.accessToken = accessToken
    this.isDevelopment = isDevelopment
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (this.isDevelopment) {
      return this.processDemoPayment(request)
    }

    const baseUrl = "https://api.mercadopago.com"

    try {
      const paymentData = this.buildPaymentData(request)

      const response = await fetch(`${baseUrl}/v1/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`MercadoPago API Error: ${data.message || "Unknown error"}`)
      }

      return this.mapResponse(data)
    } catch (error) {
      console.error("MercadoPago payment error:", error)
      throw error
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    if (this.isDevelopment) {
      return this.getDemoPaymentStatus(paymentId)
    }

    const baseUrl = "https://api.mercadopago.com"

    try {
      const response = await fetch(`${baseUrl}/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`MercadoPago API Error: ${data.message || "Unknown error"}`)
      }

      return this.mapResponse(data)
    } catch (error) {
      console.error("MercadoPago status error:", error)
      throw error
    }
  }

  private buildPaymentData(request: PaymentRequest) {
    const baseData = {
      transaction_amount: request.amount,
      description: `Pedido CreatinaMax - ${request.items.length} item(s)`,
      payment_method_id: this.getPaymentMethodId(request.payment_method),
      payer: {
        email: request.customer.email,
        first_name: request.customer.name.split(" ")[0],
        last_name: request.customer.name.split(" ").slice(1).join(" "),
        identification: {
          type: "CPF",
          number: request.customer.document,
        },
        address: {
          street_name: request.customer.address.street,
          street_number: request.customer.address.number,
          neighborhood: request.customer.address.neighborhood,
          city: request.customer.address.city,
          federal_unit: request.customer.address.state,
          zip_code: request.customer.address.zip_code,
        },
      },
      metadata: {
        ...request.metadata,
        source: "creatinamax_ecommerce",
      },
    }

    if (request.payment_method.type === "credit_card" && request.card) {
      return {
        ...baseData,
        installments: request.payment_method.installments || 1,
        token: "demo_card_token", // In production, tokenize card first
      }
    }

    return baseData
  }

  private getPaymentMethodId(paymentMethod: PaymentRequest["payment_method"]): string {
    switch (paymentMethod.type) {
      case "pix":
        return "pix"
      case "credit_card":
        return "visa" // Default, should be detected from card
      case "debit_card":
        return "debvisa" // Default, should be detected from card
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod.type}`)
    }
  }

  private mapResponse(data: any): PaymentResponse {
    return {
      id: data.id.toString(),
      status: this.mapStatus(data.status),
      payment_method_id: data.payment_method_id,
      transaction_amount: data.transaction_amount,
      pix_qr_code: data.point_of_interaction?.transaction_data?.qr_code,
      pix_qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
      installments: data.installments,
      gateway: this.name,
      gateway_payment_id: data.id.toString(),
      created_at: data.date_created,
    }
  }

  private mapStatus(status: string): PaymentResponse["status"] {
    switch (status) {
      case "approved":
        return "approved"
      case "pending":
      case "in_process":
        return "pending"
      case "rejected":
      case "cancelled":
        return "rejected"
      default:
        return "pending"
    }
  }

  // Demo implementations for development
  private async processDemoPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const demoId = `demo_mp_${Date.now()}`

    // Demo logic: PIX always pending, cards approved if amount < 1000
    let status: PaymentResponse["status"] = "pending"

    if (request.payment_method.type === "pix") {
      status = "pending"
    } else if (request.amount < 1000) {
      status = "approved"
    } else {
      status = "rejected"
    }

    return {
      id: demoId,
      status,
      payment_method_id: this.getPaymentMethodId(request.payment_method),
      transaction_amount: request.amount,
      pix_qr_code: request.payment_method.type === "pix" ? "demo_pix_code_12345" : undefined,
      pix_qr_code_base64: request.payment_method.type === "pix" ? "data:image/png;base64,demo_base64" : undefined,
      installments: request.payment_method.installments,
      gateway: this.name,
      gateway_payment_id: demoId,
      created_at: new Date().toISOString(),
    }
  }

  private async getDemoPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    // In demo, simulate status progression
    const isOld = paymentId.includes("demo_mp_")

    return {
      id: paymentId,
      status: isOld ? "approved" : "pending",
      payment_method_id: "pix",
      transaction_amount: 100,
      gateway: this.name,
      gateway_payment_id: paymentId,
      created_at: new Date().toISOString(),
    }
  }
}
