interface FreightOption {
  name: string
  price: number
  days: number
}

interface CEPInfo {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export async function getCEPInfo(cep: string): Promise<CEPInfo> {
  const cleanCEP = cep.replace(/\D/g, "")

  if (cleanCEP.length !== 8) {
    throw new Error("CEP deve ter 8 dígitos")
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
  const data = await response.json()

  if (data.erro) {
    throw new Error("CEP não encontrado")
  }

  return data
}

export function calculateFreight(cep: string, weight: number): FreightOption[] {
  // MVP freight calculation based on weight and CEP
  const cleanCEP = cep.replace(/\D/g, "")
  const region = getRegionByCEP(cleanCEP)

  const basePrice = weight * 2.5 // R$ 2.50 per 100g
  const regionMultiplier = getRegionMultiplier(region)

  return [
    {
      name: "PAC",
      price: basePrice * regionMultiplier,
      days: region === "SP" ? 2 : region === "Southeast" ? 3 : region === "South" ? 4 : 7,
    },
    {
      name: "SEDEX",
      price: basePrice * regionMultiplier * 1.8,
      days: region === "SP" ? 1 : region === "Southeast" ? 2 : region === "South" ? 3 : 5,
    },
  ]
}

function getRegionByCEP(cep: string): string {
  const firstDigit = Number.parseInt(cep[0])

  if (
    cep.startsWith("01") ||
    cep.startsWith("02") ||
    cep.startsWith("03") ||
    cep.startsWith("04") ||
    cep.startsWith("05") ||
    cep.startsWith("08")
  ) {
    return "SP" // São Paulo capital
  }

  if (firstDigit >= 0 && firstDigit <= 3) {
    return "Southeast" // Southeast region
  }

  if (firstDigit >= 8 && firstDigit <= 9) {
    return "South" // South region
  }

  return "Other" // Other regions
}

function getRegionMultiplier(region: string): number {
  switch (region) {
    case "SP":
      return 1.0
    case "Southeast":
      return 1.2
    case "South":
      return 1.4
    default:
      return 1.8
  }
}
