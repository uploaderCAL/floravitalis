"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroCarousel from "@/components/hero-carousel"
import Link from "next/link"
import { Star, Truck, Shield, Award, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { mockDatabase } from "@/lib/data/mock-database"
import type { Product } from "@/lib/types/database"

interface CarouselImage {
  id: string
  url: string
  alt: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export default function HomePage() {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])
  const [carouselTransition, setCarouselTransition] = useState<"fade" | "slide" | "zoom">("fade")
  const [carouselAutoPlay, setCarouselAutoPlay] = useState(true)
  const [carouselInterval, setCarouselInterval] = useState(5000)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    const savedImages = localStorage.getItem("carousel-images")
    const savedTransition = localStorage.getItem("carousel-transition")
    const savedAutoPlay = localStorage.getItem("carousel-autoplay")
    const savedInterval = localStorage.getItem("carousel-interval")

    if (savedImages) {
      try {
        setCarouselImages(JSON.parse(savedImages))
      } catch (e) {
        console.error("Error parsing carousel images:", e)
      }
    } else {
      setCarouselImages([
        {
          id: "default-1",
          url: "/carousel/hero-creatine-1.png",
          alt: "Creatina Flora Vitalis Premium",
          title: "A Melhor Creatina do Brasil",
          description:
            "Potencialize seus treinos com nossa linha premium de creatina. Qualidade internacional, resultados comprovados.",
          buttonText: "Ver Produtos",
          buttonLink: "/produtos",
        },
        {
          id: "default-2",
          url: "/carousel/hero-creatine-2.png",
          alt: "Suplementos de Alta Performance",
          title: "Performance Máxima Garantida",
          description:
            "Desenvolvida com tecnologia avançada para atletas que buscam excelência. Aumente sua força e resistência.",
          buttonText: "Comprar Agora",
          buttonLink: "/produtos",
        },
        {
          id: "default-3",
          url: "/carousel/hero-creatine-3.png",
          alt: "Resultados Comprovados",
          title: "Resultados em 30 Dias",
          description:
            "Milhares de clientes satisfeitos comprovam a eficácia dos nossos produtos. Transforme seu corpo hoje mesmo.",
          buttonText: "Saiba Mais",
          buttonLink: "/quem-somos",
        },
      ])
    }

    if (savedTransition) {
      setCarouselTransition(savedTransition as "fade" | "slide" | "zoom")
    }

    if (savedAutoPlay) {
      setCarouselAutoPlay(savedAutoPlay === "true")
    }

    if (savedInterval) {
      setCarouselInterval(Number.parseInt(savedInterval))
    }

    const featured = mockDatabase.products
      .filter((product) => product.featured && product.status === "active")
      .slice(0, 3)
    setFeaturedProducts(featured)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroCarousel
        images={carouselImages}
        transitionEffect={carouselTransition}
        autoPlay={carouselAutoPlay}
        autoPlayInterval={carouselInterval}
      />

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Frete Grátis</h3>
              <p className="text-muted-foreground text-sm">Acima de R$ 99 para todo o Brasil</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Compra Segura</h3>
              <p className="text-muted-foreground text-sm">Pagamento 100% seguro e protegido</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Qualidade Premium</h3>
              <p className="text-muted-foreground text-sm">Produtos testados e aprovados</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Satisfação Garantida</h3>
              <p className="text-muted-foreground text-sm">30 dias para troca ou devolução</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading font-bold text-3xl text-foreground">Produtos em Destaque</h2>
            <p className="text-muted-foreground">Os mais vendidos da nossa loja</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const discountPercentage = product.comparePrice
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : 0

              return (
                <div
                  key={product.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.images[0]?.url || "/placeholder.svg"}
                      alt={product.images[0]?.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                    {discountPercentage > 0 && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                        -{discountPercentage}%
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-heading font-semibold text-card-foreground">{product.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">(4.8)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-primary">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {product.comparePrice.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/produtos/${product.slug}`}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center"
                    >
                      Ver Produto
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/produtos"
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors inline-flex items-center"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading font-bold text-3xl text-primary-foreground">
            Pronto para Potencializar seus Treinos?
          </h2>
          <p className="text-primary-foreground/90 text-lg">
            Junte-se a milhares de atletas que já confiam na Flora Vitalis
          </p>
          <Link
            href="/produtos"
            className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors inline-flex items-center"
          >
            Comprar Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
