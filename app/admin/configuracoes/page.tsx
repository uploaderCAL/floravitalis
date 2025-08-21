"use client"

import type React from "react"

import { useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Save, Eye, EyeOff, Upload, X, Plus, Trash2, GripVertical } from "lucide-react"

interface CarouselImage {
  id: string
  url: string
  alt: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Store Info
    storeName: "CreatinaMax",
    cnpj: "00.000.000/0001-00",
    whatsapp: "(11) 99999-9999",
    instagram: "@creatinamax",

    // Logo settings
    logoUrl: "",
    logoAlt: "CreatinaMax Logo",
    useCustomLogo: false,

    // Analytics
    ga4Id: "",
    metaPixelId: "",

    // Payment Gateways
    mercadoPagoToken: "",
    pagarMeKey: "",
    defaultGateway: "mercado_pago",

    // Email
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",

    // SEO
    metaTitle: "CreatinaMax - Suplementos de Creatina Premium",
    metaDescription:
      "A melhor creatina do Brasil. Suplementos de alta qualidade para potencializar seus treinos e resultados.",

    // Maintenance
    maintenanceMode: false,

    // Carousel settings
    carouselImages: [] as CarouselImage[],
    carouselTransition: "fade" as "fade" | "slide" | "zoom",
    carouselAutoPlay: true,
    carouselInterval: 5000,
  })

  const [showPasswords, setShowPasswords] = useState({
    mercadoPago: false,
    pagarMe: false,
    smtp: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  // Logo upload state
  const [logoPreview, setLogoPreview] = useState<string>("")

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (settings.logoUrl) {
      localStorage.setItem("store-logo", settings.logoUrl)
      localStorage.setItem("store-logo-alt", settings.logoAlt)
      localStorage.setItem("use-custom-logo", settings.useCustomLogo.toString())
    }

    localStorage.setItem("carousel-images", JSON.stringify(settings.carouselImages))
    localStorage.setItem("carousel-transition", settings.carouselTransition)
    localStorage.setItem("carousel-autoplay", settings.carouselAutoPlay.toString())
    localStorage.setItem("carousel-interval", settings.carouselInterval.toString())

    setIsSaving(false)
    alert("Configurações salvas com sucesso!")
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  // Logo upload handler
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem.")
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 2MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setSettings((prev) => ({
          ...prev,
          logoUrl: result,
          useCustomLogo: true,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove logo handler
  const handleRemoveLogo = () => {
    setLogoPreview("")
    setSettings((prev) => ({
      ...prev,
      logoUrl: "",
      useCustomLogo: false,
    }))
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  // Carousel image management functions
  const addCarouselImage = () => {
    const newImage: CarouselImage = {
      id: Date.now().toString(),
      url: "",
      alt: "",
      title: "",
      description: "",
      buttonText: "Ver Produtos",
      buttonLink: "/produtos",
    }
    setSettings((prev) => ({
      ...prev,
      carouselImages: [...prev.carouselImages, newImage],
    }))
  }

  const updateCarouselImage = (id: string, field: keyof CarouselImage, value: string) => {
    setSettings((prev) => ({
      ...prev,
      carouselImages: prev.carouselImages.map((img) => (img.id === id ? { ...img, [field]: value } : img)),
    }))
  }

  const removeCarouselImage = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      carouselImages: prev.carouselImages.filter((img) => img.id !== id),
    }))
  }

  const handleCarouselImageUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem.")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateCarouselImage(id, "url", result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Gerencie as configurações da sua loja</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logo Upload Section */}
          <div className="bg-card p-6 rounded-lg border border-border lg:col-span-2">
            <h2 className="font-heading font-semibold text-lg text-card-foreground mb-4">Logo da Loja</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Upload do Logo</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Escolher Arquivo
                    </label>
                    {settings.logoUrl && (
                      <button
                        onClick={handleRemoveLogo}
                        className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remover
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 2MB. Recomendado: 200x60px
                  </p>
                </div>

                {/* Logo Preview */}
                <div className="w-48 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
                  {settings.logoUrl ? (
                    <img
                      src={logoPreview || settings.logoUrl}
                      alt="Preview do logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-1">
                        <span className="text-primary-foreground font-bold text-lg">C</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Texto Alternativo (Alt)</label>
                <input
                  type="text"
                  value={settings.logoAlt}
                  onChange={(e) => handleInputChange("logoAlt", e.target.value)}
                  placeholder="Descrição do logo para acessibilidade"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="use-custom-logo"
                  checked={settings.useCustomLogo}
                  onChange={(e) => handleInputChange("useCustomLogo", e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="use-custom-logo" className="text-sm font-medium text-card-foreground">
                  Usar logo personalizado (desmarque para usar o logo padrão)
                </label>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="font-heading font-semibold text-lg text-card-foreground mb-4">Informações da Loja</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Nome da Loja</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleInputChange("storeName", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">CNPJ</label>
                <input
                  type="text"
                  value={settings.cnpj}
                  onChange={(e) => handleInputChange("cnpj", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">WhatsApp</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Instagram</label>
                <input
                  type="text"
                  value={settings.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="font-heading font-semibold text-lg text-card-foreground mb-4">Analytics</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Google Analytics 4 ID</label>
                <input
                  type="text"
                  value={settings.ga4Id}
                  onChange={(e) => handleInputChange("ga4Id", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Meta Pixel ID</label>
                <input
                  type="text"
                  value={settings.metaPixelId}
                  onChange={(e) => handleInputChange("metaPixelId", e.target.value)}
                  placeholder="123456789012345"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="font-heading font-semibold text-lg text-card-foreground mb-4">Gateways de Pagamento</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Gateway Padrão</label>
                <select
                  value={settings.defaultGateway}
                  onChange={(e) => handleInputChange("defaultGateway", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="mercado_pago">Mercado Pago</option>
                  <option value="pagar_me">Pagar.me</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Mercado Pago Access Token</label>
                <div className="relative">
                  <input
                    type={showPasswords.mercadoPago ? "text" : "password"}
                    value={settings.mercadoPagoToken}
                    onChange={(e) => handleInputChange("mercadoPagoToken", e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("mercadoPago")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.mercadoPago ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Pagar.me API Key</label>
                <div className="relative">
                  <input
                    type={showPasswords.pagarMe ? "text" : "password"}
                    value={settings.pagarMeKey}
                    onChange={(e) => handleInputChange("pagarMeKey", e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("pagarMe")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.pagarMe ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="font-heading font-semibold text-lg text-card-foreground mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Meta Title</label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Meta Description</label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-card p-6 rounded-lg border border-border lg:col-span-2">
            <h2 className="font-heading font-semibold text-lg text-card-foreground mb-4">Configurações de E-mail</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">SMTP Host</label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => handleInputChange("smtpHost", e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">SMTP Port</label>
                <input
                  type="text"
                  value={settings.smtpPort}
                  onChange={(e) => handleInputChange("smtpPort", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">SMTP User</label>
                <input
                  type="email"
                  value={settings.smtpUser}
                  onChange={(e) => handleInputChange("smtpUser", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">SMTP Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.smtp ? "text" : "password"}
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange("smtpPassword", e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("smtp")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.smtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-card p-6 rounded-lg border border-border lg:col-span-2">
            <h2 className="font-heading font-semibold text-lg text-card-foreground mb-4">Sistema</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Modo de Manutenção</h3>
                <p className="text-sm text-muted-foreground">Ativar para colocar a loja em manutenção</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Carousel Management Section */}
          <div className="bg-card p-6 rounded-lg border border-border lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">Carousel Principal</h2>
              <button
                onClick={addCarouselImage}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Imagem
              </button>
            </div>

            {/* Carousel Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Efeito de Transição</label>
                <select
                  value={settings.carouselTransition}
                  onChange={(e) => setSettings((prev) => ({ ...prev, carouselTransition: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="fade">Fade (Desvanecer)</option>
                  <option value="slide">Slide (Deslizar)</option>
                  <option value="zoom">Zoom (Ampliar)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Intervalo (ms)</label>
                <input
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  value={settings.carouselInterval}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, carouselInterval: Number.parseInt(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="carousel-autoplay"
                  checked={settings.carouselAutoPlay}
                  onChange={(e) => setSettings((prev) => ({ ...prev, carouselAutoPlay: e.target.checked }))}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="carousel-autoplay" className="text-sm font-medium text-card-foreground">
                  Reprodução Automática
                </label>
              </div>
            </div>

            {/* Image Size Guide */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">📐 Dimensões Recomendadas</h3>
              <p className="text-sm text-blue-800">
                <strong>Tamanho ideal:</strong> 1920x534px (largura x altura)
                <br />
                <strong>Formato:</strong> JPG, PNG ou WebP
                <br />
                <strong>Tamanho máximo:</strong> 5MB por imagem
                <br />
                <strong>Proporção:</strong> 3.6:1 (paisagem)
              </p>
            </div>

            {/* Carousel Images */}
            <div className="space-y-4">
              {settings.carouselImages.map((image, index) => (
                <div key={image.id} className="border border-border rounded-lg p-4 bg-background">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-medium text-card-foreground">Imagem {index + 1}</h3>
                    </div>
                    <button
                      onClick={() => removeCarouselImage(image.id)}
                      className="text-destructive hover:text-destructive/80 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Image Upload */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">Imagem</label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCarouselImageUpload(image.id, e)}
                            className="hidden"
                            id={`carousel-upload-${image.id}`}
                          />
                          <label
                            htmlFor={`carousel-upload-${image.id}`}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center cursor-pointer"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Escolher Arquivo
                          </label>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="w-full h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
                        {image.url ? (
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.alt || "Preview"}
                            className="max-w-full max-h-full object-cover rounded"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <span className="text-sm text-muted-foreground">1920x534px</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">Texto Alternativo</label>
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => updateCarouselImage(image.id, "alt", e.target.value)}
                          placeholder="Descrição da imagem para acessibilidade"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">Título</label>
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e) => updateCarouselImage(image.id, "title", e.target.value)}
                          placeholder="Título principal do slide"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">Descrição</label>
                        <textarea
                          value={image.description}
                          onChange={(e) => updateCarouselImage(image.id, "description", e.target.value)}
                          placeholder="Descrição do slide"
                          rows={3}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">Texto do Botão</label>
                          <input
                            type="text"
                            value={image.buttonText}
                            onChange={(e) => updateCarouselImage(image.id, "buttonText", e.target.value)}
                            placeholder="Ver Produtos"
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">Link do Botão</label>
                          <input
                            type="text"
                            value={image.buttonLink}
                            onChange={(e) => updateCarouselImage(image.id, "buttonLink", e.target.value)}
                            placeholder="/produtos"
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {settings.carouselImages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma imagem adicionada ao carousel</p>
                  <p className="text-sm">Clique em "Adicionar Imagem" para começar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
