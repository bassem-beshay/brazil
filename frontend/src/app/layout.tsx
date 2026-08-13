import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Compass, ShoppingBag, Heart, User as UserIcon, MessageCircle, Phone, Award, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Girasol Viagens e Turismo | Pacotes de Luxo para o Egito & América do Sul',
  description: 'Descubra o Egito e a América do Sul com excelência. Pacotes completos: Pirâmides, Cruzeiro 5★ no Rio Nilo, Mar Vermelho e roteiros sob medida com guias em português.',
  openGraph: {
    title: 'Girasol Viagens e Turismo | Experiências e Roteiros de Luxo',
    description: 'Pacotes personalizados e cruzeiros pelo Rio Nilo com atendimento VIP 24/7.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }} className="bg-[#F8F9FA] text-[#263238] antialiased">
        <AuthProvider>
          {/* Top Announcement Bar */}
          <div className="bg-[#1B5E20] text-white text-xs py-2 px-6 hidden sm:block">
            <div className="max-w-7xl mx-auto flex justify-between items-center font-medium">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FBC02D]" />
                  Licença Min. Turismo Egito Nº 2208 A | Membro IATA
                </span>
                <span className="hidden md:inline text-white/60">|</span>
                <span className="hidden md:flex items-center gap-1">
                  Guias egiptólogos especializados fluentes em Português
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a 
                  href="https://wa.me/201060873700" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-white hover:text-[#FBC02D] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  WhatsApp 24h: +20 106 087 3700
                </a>
              </div>
            </div>
          </div>

          {/* Header Sticky Navigation */}
          <header className="sticky top-0 left-0 right-0 z-50 glass-effect shadow-premium border-b border-gray-100/80">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl tracking-tight text-[#263238]">
                    GIRASOL<span className="text-[#1B5E20]">.</span>
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-[#1B5E20] -mt-1">
                    Viagens & Turismo
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#263238]">
                <Link href="/" className="hover:text-[#1B5E20] transition-colors py-2">
                  Início
                </Link>
                <Link href="/destinations" className="hover:text-[#1B5E20] transition-colors py-2">
                  Destinos
                </Link>
                <Link href="/tours" className="hover:text-[#1B5E20] transition-colors py-2">
                  Pacotes & Cruzeiros
                </Link>
                <Link href="/about" className="hover:text-[#1B5E20] transition-colors py-2">
                  Sobre Nós
                </Link>
                <Link href="/blog" className="hover:text-[#1B5E20] transition-colors py-2">
                  Blog & Dicas
                </Link>
                <Link href="/faq" className="hover:text-[#1B5E20] transition-colors py-2">
                  FAQ & Vistos
                </Link>
                <Link href="/contact" className="hover:text-[#1B5E20] transition-colors py-2">
                  Contato
                </Link>
              </nav>

              {/* Quick Actions / CTA */}
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="text-[#546E7A] hover:text-[#1B5E20] transition-colors p-2 rounded-lg hover:bg-gray-50 hidden sm:flex items-center justify-center"
                  title="Meus Favoritos"
                >
                  <Heart className="w-5 h-5" />
                </Link>

                <Link 
                  href="/contact" 
                  className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#1B5E20] text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Pedir Orçamento Grátis
                </Link>

                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-200 hover:border-[#1B5E20] transition-all bg-white text-xs font-semibold text-[#263238]"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#1B5E20]" />
                  <span className="hidden sm:inline">Minha Conta</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* Luxury Footer */}
          <footer className="bg-[#263238] text-white pt-20 pb-10 mt-24 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              {/* Brand Col */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  <Compass className="w-7 h-7 text-[#FBC02D]" />
                  <span className="font-bold text-2xl tracking-tight text-white">
                    GIRASOL<span className="text-[#FBC02D]">.</span>
                  </span>
                </div>
                <p className="text-sm text-[#CFD8DC] leading-relaxed max-w-md">
                  Operadora de turismo receptivo de excelência (DMC). Especialistas em viagens inesquecíveis pelo Egito, cruzeiros no Nilo, Mar Vermelho, Jordânia, Dubai e roteiros de alto padrão na América do Sul com guias fluentes em português.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <span className="text-[11px] px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800/80 text-[#FBC02D] font-semibold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Licença Min. Turismo 2208 A
                  </span>
                  <span className="text-[11px] px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800/80 text-white font-semibold">
                    IATA Certified
                  </span>
                  <span className="text-[11px] px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800/80 text-emerald-400 font-semibold">
                    ★ Trustpilot 4.3/5.0
                  </span>
                </div>
              </div>

              {/* Destinos */}
              <div>
                <h4 className="font-semibold text-xs mb-5 text-[#FBC02D] uppercase tracking-wider">Principais Destinos</h4>
                <ul className="space-y-3 text-sm text-[#CFD8DC]">
                  <li><Link href="/destinations/cairo" className="hover:text-white transition-colors">Cairo & Pirâmides</Link></li>
                  <li><Link href="/destinations/luxor-aswan" className="hover:text-white transition-colors">Cruzeiro no Rio Nilo</Link></li>
                  <li><Link href="/destinations/hurghada" className="hover:text-white transition-colors">Hurghada & Mar Vermelho</Link></li>
                  <li><Link href="/destinations/rio-de-janeiro" className="hover:text-white transition-colors">Rio de Janeiro & Brasil</Link></li>
                  <li><Link href="/destinations/egito-jordania-dubai" className="hover:text-white transition-colors">Egito, Jordânia & Dubai</Link></li>
                  <li><Link href="/destinations" className="text-[#FBC02D] hover:underline transition-colors font-medium">Ver Todos os Destinos &rarr;</Link></li>
                </ul>
              </div>

              {/* Links Rápidos */}
              <div>
                <h4 className="font-semibold text-xs mb-5 text-[#FBC02D] uppercase tracking-wider">Links & Recursos</h4>
                <ul className="space-y-3 text-sm text-[#CFD8DC]">
                  <li><Link href="/about" className="hover:text-white transition-colors">Sobre a Girasol</Link></li>
                  <li><Link href="/tours" className="hover:text-white transition-colors">Pacotes de Viagem</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Dicas de Viagem</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">Perguntas Frequentes (FAQ)</Link></li>
                  <li><Link href="/faq#vistos" className="hover:text-white transition-colors">Informações de Visto</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Fale com um Especialista</Link></li>
                </ul>
              </div>

              {/* Contato & Newsletter */}
              <div>
                <h4 className="font-semibold text-xs mb-5 text-[#FBC02D] uppercase tracking-wider">Atendimento 24/7</h4>
                <div className="space-y-3 text-xs text-[#CFD8DC] mb-5">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#FBC02D]" /> +20 2 3771 5511
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#FBC02D]" /> +20 1227 011 900
                  </p>
                  <p className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp: +20 106 087 3700
                  </p>
                </div>
                <h5 className="font-semibold text-xs text-white mb-2">Newsletter VIP</h5>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Seu e-mail..." 
                    className="bg-gray-800 border border-gray-700 text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:border-[#FBC02D] w-full text-white placeholder:text-gray-500" 
                  />
                  <button className="bg-[#1B5E20] hover:bg-[#2E7D32] transition-colors text-white font-semibold text-xs px-3.5 py-2 rounded-lg">
                    OK
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-footer */}
            <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#90A4AE]">
              <p>&copy; {new Date().getFullYear()} Girasol Viagens e Turismo. Todos os direitos reservados.</p>
              <div className="flex gap-6">
                <Link href="/terms" className="hover:text-white transition-colors">Termos de Uso e Reserva</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Suporte ao Viajante</Link>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
