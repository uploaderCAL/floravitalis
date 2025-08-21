import Header from "@/components/header"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-card py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="font-heading font-bold text-4xl text-card-foreground">Entre em Contato</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Informações de Contato</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Telefone</h3>
                      <p className="text-muted-foreground">(11) 99999-9999</p>
                      <p className="text-sm text-muted-foreground">WhatsApp disponível</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">E-mail</h3>
                      <p className="text-muted-foreground">contato@creatinamax.com.br</p>
                      <p className="text-sm text-muted-foreground">Resposta em até 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Endereço</h3>
                      <p className="text-muted-foreground">
                        Rua das Flores, 123
                        <br />
                        Vila Madalena - São Paulo, SP
                        <br />
                        CEP: 05435-000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">
                        Segunda a Sexta: 8h às 18h
                        <br />
                        Sábado: 8h às 14h
                        <br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-4">Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <span className="font-bold">IG</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 rounded-lg border border-border">
              <h2 className="font-heading font-bold text-2xl text-card-foreground mb-6">Envie sua Mensagem</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-card-foreground mb-2">
                    Assunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida-produto">Dúvida sobre produto</option>
                    <option value="pedido">Pedido</option>
                    <option value="troca-devolucao">Troca/Devolução</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="reclamacao">Reclamação</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Descreva sua dúvida ou mensagem..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading font-bold text-3xl text-card-foreground">Perguntas Frequentes</h2>
            <p className="text-muted-foreground">Encontre respostas para as dúvidas mais comuns</p>
          </div>

          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold text-card-foreground mb-2">Qual o prazo de entrega?</h3>
              <p className="text-muted-foreground">
                O prazo varia de acordo com sua região. Para São Paulo capital: 1-2 dias úteis. Para outras capitais:
                2-5 dias úteis. Interior: 3-7 dias úteis.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold text-card-foreground mb-2">Como posso rastrear meu pedido?</h3>
              <p className="text-muted-foreground">
                Após a confirmação do pagamento, você receberá um código de rastreamento por e-mail. Você também pode
                acompanhar pelo nosso site na seção "Meus Pedidos".
              </p>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold text-card-foreground mb-2">Posso trocar ou devolver um produto?</h3>
              <p className="text-muted-foreground">
                Sim! Você tem até 30 dias para trocar ou devolver qualquer produto, desde que esteja em sua embalagem
                original e lacrada.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold text-card-foreground mb-2">Como tomar creatina corretamente?</h3>
              <p className="text-muted-foreground">
                Recomendamos 3-5g por dia, preferencialmente após o treino. Consulte sempre um nutricionista para
                orientação personalizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
