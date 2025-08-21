import type { PaymentGateway, PaymentRequest, PaymentResponse } from "./types"

export class PagarMeGateway implements PaymentGateway {
  name = "pagar_me"
  private apiKey: string
  private isDevelopment: boolean

  constructor(apiKey: string, isDevelopment = false) {
    this.apiKey = apiKey
    this.isDevelopment = isDevelopment
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (this.isDevelopment) {
      return this.processDemoPayment(request)
    }

    const baseUrl = "https://api.pagar.me/core/v5"

    try {
      const paymentData = this.buildPaymentData(request)

      const response = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(this.apiKey + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Pagar.me API Error: ${data.message || "Unknown error"}`)
      }

      return this.mapResponse(data)
    } catch (error) {
      console.error("Pagar.me payment error:", error)
      throw error
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    if (this.isDevelopment) {
      return this.getDemoPaymentStatus(paymentId)
    }

    const baseUrl = "https://api.pagar.me/core/v5"

    try {
      const response = await fetch(`${baseUrl}/orders/${paymentId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(this.apiKey + ":").toString("base64")}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Pagar.me API Error: ${data.message || "Unknown error"}`)
      }

      return this.mapResponse(data)
    } catch (error) {
      console.error("Pagar.me status error:", error)
      throw error
    }
  }

  private buildPaymentData(request: PaymentRequest) {
    const baseData = {
      amount: Math.round(request.amount * 100), // Pagar.me uses cents
      currency: "BRL",
      customer: {
        name: request.customer.name,
        email: request.customer.email,
        document: request.customer.document,
        type: "individual",
        address: {
          line_1: `${request.customer.address.street}, ${request.customer.address.number}`,
          line_2: request.customer.address.complement || "",
          neighborhood: request.customer.address.neighborhood,
          city: request.customer.address.city,
          state: request.customer.address.state,
          zip_code: request.customer.address.zip_code,
          country: "BR",
        },
        phones: {
          mobile_phone: {
            country_code: "55",
            area_code: request.customer.phone.slice(0, 2),
            number: request.customer.phone.slice(2),
          },
        },
      },
      items: request.items.map((item) => ({
        id: item.id,
        description: item.title,
        amount: Math.round(item.unit_price * 100),
        quantity: item.quantity,
      })),
      metadata: {
        ...request.metadata,
        source: "creatinamax_ecommerce",
      },
    }

    if (request.payment_method.type === "pix") {
      return {
        ...baseData,
        payments: [
          {
            payment_method: "pix",
            pix: {
              expires_in: 3600, // 1 hour
            },
          },
        ],
      }
    }

    if (request.payment_method.type === "credit_card" && request.card) {
      return {
        ...baseData,
        payments: [
          {
            payment_method: "credit_card",
            credit_card: {
              installments: request.payment_method.installments || 1,
              statement_descriptor: "CREATINAMAX",
              card: {
                number: request.card.number,
                holder_name: request.card.holder_name,
                exp_month: Number.parseInt(request.card.exp_month),
                exp_year: Number.parseInt(request.card.exp_year),
                cvv: request.card.cvv,
              },
            },
          },
        ],
      }
    }

    if (request.payment_method.type === "debit_card" && request.card) {
      return {
        ...baseData,
        payments: [
          {
            payment_method: "debit_card",
            debit_card: {
              statement_descriptor: "CREATINAMAX",
              card: {
                number: request.card.number,
                holder_name: request.card.holder_name,
                exp_month: Number.parseInt(request.card.exp_month),
                exp_year: Number.parseInt(request.card.exp_year),
                cvv: request.card.cvv,
              },
            },
          },
        ],
      }
    }

    throw new Error(`Unsupported payment method: ${request.payment_method.type}`)
  }

  private mapResponse(data: any): PaymentResponse {
    const payment = data.charges?.[0] || data.payments?.[0] || {}

    return {
      id: data.id,
      status: this.mapStatus(data.status || payment.status),
      payment_method_id: payment.payment_method,
      transaction_amount: (data.amount || payment.amount) / 100, // Convert from cents
      pix_qr_code: payment.last_transaction?.qr_code,
      pix_qr_code_base64: payment.last_transaction?.qr_code_url,
      installments: payment.installments,
      gateway: this.name,
      gateway_payment_id: data.id,
      created_at: data.created_at,
    }
  }

  private mapStatus(status: string): PaymentResponse["status"] {
    switch (status) {
      case "paid":
        return "approved"
      case "pending":
      case "processing":
        return "pending"
      case "failed":
      case "canceled":
        return "rejected"
      default:
        return "pending"
    }
  }

  // Demo implementations for development
  private async processDemoPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const demoId = `demo_pm_${Date.now()}`

    // Demo logic: Different behavior than MercadoPago for testing
    let status: PaymentResponse["status"] = "pending"

    if (request.payment_method.type === "pix") {
      status = "pending"
    } else if (request.amount < 500) {
      status = "approved"
    } else {
      status = "rejected"
    }

    return {
      id: demoId,
      status,
      payment_method_id: request.payment_method.type,
      transaction_amount: request.amount,
      pix_qr_code: request.payment_method.type === "pix" ? "demo_pix_code_67890" : undefined,
      pix_qr_code_base64: request.payment_method.type === "pix" ? "data:image/png;base64,demo_base64_pm" : undefined,
      installments: request.payment_method.installments,
      gateway: this.name,
      gateway_payment_id: demoId,
      created_at: new Date().toISOString(),
    }
  }

  private async getDemoPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    return {
      id: paymentId,
      status: "approved",
      payment_method_id: "pix",
      transaction_amount: 100,
      gateway: this.name,
      gateway_payment_id: paymentId,
      created_at: new Date().toISOString(),
    }
  }
}
