import { type NextRequest, NextResponse } from "next/server"
import { PaymentGatewayFactory } from "@/lib/payment/gateway-factory"
import type { PaymentRequest } from "@/lib/payment/types"

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest & { gateway?: string } = await request.json()

    // Validate required fields
    if (!body.amount || !body.customer || !body.payment_method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get payment gateway
    const gatewayProvider = body.gateway || PaymentGatewayFactory.getDefaultProvider()
    const gateway = PaymentGatewayFactory.create(gatewayProvider)

    // Process payment
    const result = await gateway.processPayment(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payment processing error:", error)

    return NextResponse.json(
      {
        error: "Payment processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
