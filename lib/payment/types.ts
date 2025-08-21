export interface PaymentMethod {
  type: "pix" | "credit_card" | "debit_card"
  installments?: number
}

export interface CardData {
  number: string
  holder_name: string
  exp_month: string
  exp_year: string
  cvv: string
}

export interface CustomerData {
  name: string
  email: string
  phone: string
  document: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
  }
}

export interface PaymentRequest {
  amount: number
  currency: string
  payment_method: PaymentMethod
  customer: CustomerData
  card?: CardData
  items: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
  }>
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  id: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  payment_method_id?: string
  transaction_amount: number
  pix_qr_code?: string
  pix_qr_code_base64?: string
  installments?: number
  gateway: string
  gateway_payment_id: string
  created_at: string
}

export interface PaymentGateway {
  name: string
  processPayment(request: PaymentRequest): Promise<PaymentResponse>
  getPaymentStatus(paymentId: string): Promise<PaymentResponse>
}
