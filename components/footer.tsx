import Link from "next/link"
import { Instagram, MessageCircle, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="font-heading font-bold text-xl text-card-foreground">CreatinaMax</span>
            </div>
            <p className="text-muted-foreground text-sm">
              A melhor creatina do Brasil. Suplementos de alta qualidade para potencializar seus treinos e resultados.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-card-foreground">Links Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/produtos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Produtos
              </Link>
              <Link href="/quem-somos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Quem Somos
              </Link>
              <Link href="/contato" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contato
              </Link>
              <Link href="/termos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Termos de Uso
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-card-foreground">Atendimento</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </Link>
              <Link
                href="/trocas-devolucoes"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Trocas e Devoluções
              </Link>
              <Link href="/rastreamento" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Rastrear Pedido
              </Link>
              <Link
                href="/politica-privacidade"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Política de Privacidade
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-card-foreground">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>contato@creatinamax.com.br</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  São Paulo, SP
                  <br />
                  Brasil
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 CreatinaMax. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
