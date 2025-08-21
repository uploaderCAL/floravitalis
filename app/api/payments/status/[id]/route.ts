import { type NextRequest, NextResponse } from "next/server"
import { PaymentGatewayFactory } from "@/lib/payment/gateway-factory"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const gateway = searchParams.get("gateway") || PaymentGatewayFactory.getDefaultProvider()

    if (!id) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 })
    }

    // Get payment gateway
    const paymentGateway = PaymentGatewayFactory.create(gateway)

    // Get payment status
    const result = await paymentGateway.getPaymentStatus(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payment status error:", error)

    return NextResponse.json(
      {
        error: "Failed to get payment status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
