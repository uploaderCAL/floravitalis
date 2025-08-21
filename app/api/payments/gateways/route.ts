import { NextResponse } from "next/server"
import { PaymentGatewayFactory } from "@/lib/payment/gateway-factory"

export async function GET() {
  try {
    const availableGateways = PaymentGatewayFactory.getAvailableProviders()
    const defaultGateway = PaymentGatewayFactory.getDefaultProvider()

    return NextResponse.json({
      available: availableGateways,
      default: defaultGateway,
      development: process.env.NODE_ENV === "development",
    })
  } catch (error) {
    console.error("Gateway info error:", error)

    return NextResponse.json({ error: "Failed to get gateway information" }, { status: 500 })
  }
}
