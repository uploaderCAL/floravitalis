import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/data/mock-database"
import { type WebhookEvent, WebhookEventType, WebhookStatus } from "@/lib/types/database"

// Webhook endpoint for n8n integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data, source } = body

    // Validate webhook payload
    if (!type || !data) {
      return NextResponse.json({ success: false, error: "Missing required fields: type, data" }, { status: 400 })
    }

    // Create webhook event record
    const webhookEvent: WebhookEvent = {
      id: `webhook_${Date.now()}`,
      type: type as WebhookEventType,
      payload: { ...data, source: source || "n8n" },
      status: WebhookStatus.PENDING,
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Process webhook based on type
    let processResult = { success: true, message: "Webhook processed successfully" }

    switch (type) {
      case WebhookEventType.ORDER_CREATED:
        processResult = await processOrderCreated(data)
        break
      case WebhookEventType.ORDER_UPDATED:
        processResult = await processOrderUpdated(data)
        break
      case WebhookEventType.PAYMENT_CONFIRMED:
        processResult = await processPaymentConfirmed(data)
        break
      case WebhookEventType.INVENTORY_LOW:
        processResult = await processInventoryLow(data)
        break
      case WebhookEventType.BATCH_EXPIRED:
        processResult = await processBatchExpired(data)
        break
      default:
        processResult = { success: false, message: `Unknown webhook type: ${type}` }
    }

    // Update webhook status
    webhookEvent.status = processResult.success ? WebhookStatus.SUCCESS : WebhookStatus.FAILED
    webhookEvent.attempts = 1
    webhookEvent.updatedAt = new Date()

    // Store webhook event
    mockDatabase.webhookEvents.push(webhookEvent)

    return NextResponse.json(
      {
        success: processResult.success,
        message: processResult.message,
        webhookId: webhookEvent.id,
      },
      { status: processResult.success ? 200 : 400 },
    )
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ success: false, error: "Webhook processing failed" }, { status: 500 })
  }
}

// Webhook event processors
async function processOrderCreated(data: any) {
  try {
    // Send order confirmation email via n8n
    // Update inventory levels
    // Trigger fulfillment workflow
    console.log("Processing order created webhook:", data)
    return { success: true, message: "Order created webhook processed" }
  } catch (error) {
    return { success: false, message: "Failed to process order created webhook" }
  }
}

async function processOrderUpdated(data: any) {
  try {
    // Send status update email
    // Update tracking information
    // Trigger shipping workflow if status is shipped
    console.log("Processing order updated webhook:", data)
    return { success: true, message: "Order updated webhook processed" }
  } catch (error) {
    return { success: false, message: "Failed to process order updated webhook" }
  }
}

async function processPaymentConfirmed(data: any) {
  try {
    // Update order payment status
    // Send payment confirmation email
    // Trigger fulfillment process
    console.log("Processing payment confirmed webhook:", data)
    return { success: true, message: "Payment confirmed webhook processed" }
  } catch (error) {
    return { success: false, message: "Failed to process payment confirmed webhook" }
  }
}

async function processInventoryLow(data: any) {
  try {
    // Send low inventory alert
    // Create purchase order if auto-reorder is enabled
    // Notify procurement team
    console.log("Processing inventory low webhook:", data)
    return { success: true, message: "Inventory low webhook processed" }
  } catch (error) {
    return { success: false, message: "Failed to process inventory low webhook" }
  }
}

async function processBatchExpired(data: any) {
  try {
    // Mark batch as expired
    // Remove from available inventory
    // Send expiration alert
    console.log("Processing batch expired webhook:", data)
    return { success: true, message: "Batch expired webhook processed" }
  } catch (error) {
    return { success: false, message: "Failed to process batch expired webhook" }
  }
}

// GET endpoint to retrieve webhook events (for monitoring)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let webhooks = [...mockDatabase.webhookEvents]

    // Apply filters
    if (status) {
      webhooks = webhooks.filter((w) => w.status === status)
    }

    if (type) {
      webhooks = webhooks.filter((w) => w.type === type)
    }

    // Sort by creation date (newest first)
    webhooks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Pagination
    const total = webhooks.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedWebhooks = webhooks.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedWebhooks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Webhooks GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch webhook events" }, { status: 500 })
  }
}
