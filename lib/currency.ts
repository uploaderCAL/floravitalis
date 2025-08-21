export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function parseCurrency(value: string): number {
  return Number.parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."))
}
