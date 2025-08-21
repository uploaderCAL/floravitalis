"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselImage {
  id: string
  url: string
  alt: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

interface HeroCarouselProps {
  images: CarouselImage[]
  transitionEffect: "fade" | "slide" | "zoom"
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function HeroCarousel({
  images,
  transitionEffect = "fade",
  autoPlay = true,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [currentIndex, autoPlay, autoPlayInterval, images.length])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 600)
  }

  if (images.length === 0) {
    return (
      <section className="relative h-[534px] flex items-center justify-center bg-muted">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Nenhuma imagem configurada</h2>
          <p className="text-muted-foreground">Configure as imagens do carousel no painel admin</p>
        </div>
      </section>
    )
  }

  const getTransitionClasses = (index: number) => {
    const isActive = index === currentIndex

    switch (transitionEffect) {
      case "fade":
        return `absolute inset-0 transition-opacity duration-600 ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`

      case "slide":
        return `absolute inset-0 transition-transform duration-600 ease-in-out ${
          index === currentIndex
            ? "translate-x-0 z-10"
            : index < currentIndex
              ? "-translate-x-full z-0"
              : "translate-x-full z-0"
        }`

      case "zoom":
        return `absolute inset-0 transition-all duration-600 ease-in-out ${
          isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"
        }`

      default:
        return "absolute inset-0"
    }
  }

  return (
    <section className="relative h-[534px] overflow-hidden">
      {/* Carousel Images */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={getTransitionClasses(index)}
          style={{
            backgroundImage: `url('${image.url}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="space-y-8">
                <h1 className="font-heading font-bold text-5xl lg:text-7xl text-white leading-tight">{image.title}</h1>
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                  {image.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a
                    href={image.buttonLink}
                    className="bg-primary text-primary-foreground px-10 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 inline-flex items-center justify-center text-lg shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {image.buttonText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
