import Header from "@/components/header"
import Footer from "@/components/footer"
import { Award, Users, Truck, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-card py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="font-heading font-bold text-4xl text-card-foreground">Quem Somos</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Somos apaixonados por fitness e dedicados a fornecer os melhores suplementos de creatina para atletas e
            entusiastas do Brasil.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-3xl text-foreground">Nossa História</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A CreatinaMax nasceu da paixão por esportes e da busca incansável pela excelência. Fundada em 2020 por
                  atletas experientes, nossa missão sempre foi clara: democratizar o acesso a suplementos de creatina de
                  alta qualidade no Brasil.
                </p>
                <p>
                  Começamos pequenos, mas com grandes sonhos. Hoje, somos uma das marcas mais confiáveis do mercado
                  brasileiro, atendendo milhares de clientes em todo o país com produtos que realmente fazem a diferença
                  nos treinos e resultados.
                </p>
                <p>
                  Nossa equipe é formada por profissionais especializados em nutrição esportiva, que trabalham
                  incansavelmente para garantir que cada produto atenda aos mais altos padrões de qualidade e eficácia.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder-b0blc.png"
                alt="Laboratório CreatinaMax"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading font-bold text-3xl text-card-foreground">Nossos Valores</h2>
            <p className="text-muted-foreground">Os princípios que guiam nossa empresa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Qualidade</h3>
              <p className="text-muted-foreground text-sm">
                Produtos testados e certificados com os mais altos padrões internacionais
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Comunidade</h3>
              <p className="text-muted-foreground text-sm">
                Construímos uma comunidade forte de atletas e entusiastas do fitness
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Agilidade</h3>
              <p className="text-muted-foreground text-sm">Entrega rápida e eficiente para todo o Brasil</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Confiança</h3>
              <p className="text-muted-foreground text-sm">Transparência total em nossos processos e ingredientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading font-bold text-3xl text-foreground">Nossa Equipe</h2>
            <p className="text-muted-foreground">Conheça os profissionais por trás da CreatinaMax</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <img
                src="/placeholder-28et0.png"
                alt="Dr. Carlos Silva"
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
              <div>
                <h3 className="font-heading font-semibold text-foreground">Dr. Carlos Silva</h3>
                <p className="text-muted-foreground text-sm">Fundador & CEO</p>
                <p className="text-muted-foreground text-sm mt-2">Nutricionista esportivo com 15 anos de experiência</p>
              </div>
            </div>
            <div className="text-center space-y-4">
              <img
                src="/professional-female-scientist.png"
                alt="Dra. Ana Costa"
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
              <div>
                <h3 className="font-heading font-semibold text-foreground">Dra. Ana Costa</h3>
                <p className="text-muted-foreground text-sm">Diretora de Qualidade</p>
                <p className="text-muted-foreground text-sm mt-2">Especialista em controle de qualidade farmacêutica</p>
              </div>
            </div>
            <div className="text-center space-y-4">
              <img
                src="/placeholder-13csj.png"
                alt="Rafael Santos"
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
              <div>
                <h3 className="font-heading font-semibold text-foreground">Rafael Santos</h3>
                <p className="text-muted-foreground text-sm">Diretor Comercial</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Expert em marketing esportivo e relacionamento com clientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="font-heading font-bold text-4xl text-primary-foreground">50k+</div>
              <div className="text-primary-foreground/80">Clientes Satisfeitos</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-bold text-4xl text-primary-foreground">4.8</div>
              <div className="text-primary-foreground/80">Avaliação Média</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-bold text-4xl text-primary-foreground">100%</div>
              <div className="text-primary-foreground/80">Produtos Testados</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-bold text-4xl text-primary-foreground">24h</div>
              <div className="text-primary-foreground/80">Suporte Disponível</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
