import type { PaymentRequest, PaymentResponse } from "./types"

export class PaymentService {
  static async processPayment(paymentData: PaymentRequest, gateway?: string): Promise<PaymentResponse> {
    const response = await fetch("/api/payments/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...paymentData,
        gateway,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Payment processing failed")
    }

    return response.json()
  }

  static async getPaymentStatus(paymentId: string, gateway?: string): Promise<PaymentResponse> {
    const params = new URLSearchParams()
    if (gateway) {
      params.set("gateway", gateway)
    }

    const response = await fetch(`/api/payments/status/${paymentId}?${params.toString()}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get payment status")
    }

    return response.json()
  }

  static async getAvailableGateways() {
    const response = await fetch("/api/payments/gateways")

    if (!response.ok) {
      throw new Error("Failed to get gateway information")
    }

    return response.json()
  }
}
