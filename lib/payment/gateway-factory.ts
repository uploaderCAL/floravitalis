import type { PaymentGateway } from "./types"
import { MercadoPagoGateway } from "./mercado-pago"
import { PagarMeGateway } from "./pagar-me"

export class PaymentGatewayFactory {
  static create(provider: string): PaymentGateway {
    const isDevelopment = process.env.NODE_ENV === "development"

    switch (provider.toLowerCase()) {
      case "mercado_pago":
        const mpToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
        if (!mpToken && !isDevelopment) {
          throw new Error("MERCADO_PAGO_ACCESS_TOKEN is required")
        }
        return new MercadoPagoGateway(mpToken || "demo_token", isDevelopment)

      case "pagar_me":
        const pmKey = process.env.PAGAR_ME_API_KEY
        if (!pmKey && !isDevelopment) {
          throw new Error("PAGAR_ME_API_KEY is required")
        }
        return new PagarMeGateway(pmKey || "demo_key", isDevelopment)

      default:
        throw new Error(`Unsupported payment provider: ${provider}`)
    }
  }

  static getDefaultProvider(): string {
    return process.env.DEFAULT_PAYMENT_GATEWAY || "mercado_pago"
  }

  static getAvailableProviders(): string[] {
    const providers = []

    if (process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.NODE_ENV === "development") {
      providers.push("mercado_pago")
    }

    if (process.env.PAGAR_ME_API_KEY || process.env.NODE_ENV === "development") {
      providers.push("pagar_me")
    }

    return providers.length > 0 ? providers : ["mercado_pago"] // Default fallback
  }
}
