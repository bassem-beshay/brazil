import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SiteContentProvider } from '@/context/SiteContentContext';
import { getSiteContent } from '@/lib/siteContent';
import { Facebook, Instagram, Mail, MapPin, Menu as MenuIcon, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Girassol Brasil Viagens e Turismo | Viagens pelo Mundo',
  description: 'Pacotes completos para Egito, Jordânia, Dubai, Oriente Médio, Índia, Tailândia e outros destinos, com segurança, conforto e atendimento personalizado.',
  openGraph: {
    title: 'Girassol Brasil Viagens e Turismo',
    description: 'Realizando sonhos, conectando destinos.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export const dynamic = 'force-dynamic';

const navigation = [
  { href: '/', label: 'Início' },
  { href: '/destinations', label: 'Destinos' },
  { href: '/tours', label: 'Pacotes' },
  { href: '/about', label: 'Sobre Nós' },
  { href: '/faq', label: 'Perguntas Frequentes' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contato' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await getSiteContent();

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }} className="bg-[#F8F9FA] text-[#263238] antialiased">
        <AuthProvider>
          <SiteContentProvider initialContent={siteContent}>
            <div className="bg-[#0B4EA2] text-white text-[11px] py-2 px-6 hidden sm:block">
              <div className="max-w-7xl mx-auto flex justify-between items-center gap-6 font-medium">
                <span className="flex items-center gap-2 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                  OPERADORA BRASILEIRA ESPECIALISTA EM EGITO, JORDÂNIA, DUBAI, ORIENTE MÉDIO, ÍNDIA, TAILÂNDIA &amp; OUTROS DESTINOS
                </span>
                <a href="https://wa.me/5585999948137" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white hover:text-[#F59E0B] transition-colors whitespace-nowrap">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp: +55 85 99994-8137
                </a>
              </div>
            </div>

            <header className="sticky top-0 left-0 right-0 z-50 glass-effect shadow-premium border-b border-gray-100/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center gap-4">
                <Link href="/" className="group shrink-0" aria-label="Girassol Brasil Viagens e Turismo">
                  <Image
                    src="/brand/girassol-brasil-transparent.png"
                    alt="Girassol Brasil Viagens e Turismo"
                    width={1322}
                    height={784}
                    priority
                    className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </Link>

                <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#263238]">
                  {navigation.map((item) => (
                    <Link key={item.href} href={item.href} className="hover:text-[#0B4EA2] transition-colors py-2 whitespace-nowrap">
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="hidden lg:flex items-center">
                  <Link href="/contact" className="bg-gradient-to-r from-[#0B4EA2] to-[#F59E0B] hover:from-[#073B7A] hover:to-[#D97706] text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                    Pedir Orçamento
                  </Link>
                </div>

                <details className="lg:hidden relative">
                  <summary className="list-none cursor-pointer w-11 h-11 rounded-xl bg-[#0B4EA2] text-white flex items-center justify-center" aria-label="Abrir menu">
                    <MenuIcon className="w-5 h-5" />
                  </summary>
                  <nav className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 flex flex-col">
                    {navigation.map((item) => (
                      <Link key={item.href} href={item.href} className="px-4 py-3 text-sm font-semibold text-[#263238] hover:text-[#0B4EA2] hover:bg-blue-50 rounded-xl transition-colors">
                        {item.label}
                      </Link>
                    ))}
                    <Link href="/contact" className="mt-2 bg-[#F59E0B] text-[#082F5B] font-bold text-sm px-4 py-3 rounded-xl text-center">Pedir Orçamento</Link>
                  </nav>
                </details>
              </div>
            </header>

            <main className="min-h-screen">{children}</main>

            <footer className="bg-[#082F5B] text-white pt-20 pb-10 mt-24 border-t-4 border-[#F59E0B]">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                <div className="space-y-5">
                  <Image src="/brand/girassol-brasil-transparent.png" alt="Girassol Brasil Viagens e Turismo" width={1322} height={784} className="h-24 w-auto object-contain object-left" />
                  <p className="text-sm text-blue-100/80 leading-relaxed text-justify">
                    Agência brasileira especialista em organização de viagens nacionais e internacionais, com atendimento personalizado, segurança, conforto, amor e cuidado.
                  </p>
                  <Image src="/brand/girassol-group.png" alt="Grupo Girassol Brasil e Egito" width={1318} height={726} className="w-full max-w-[240px] h-auto rounded-lg bg-white" />
                </div>

                <div>
                  <h2 className="font-semibold text-xs mb-5 text-[#F59E0B] uppercase tracking-wider">Navegação</h2>
                  <ul className="space-y-3 text-sm text-blue-100/80">
                    {navigation.map((item) => <li key={item.href}><Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link></li>)}
                    <li><Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
                    <li><Link href="/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold text-xs mb-5 text-[#F59E0B] uppercase tracking-wider">Somos membros de</h2>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-3"><Image src="/brand/abav-0177-ce.jpg" alt="ABAV número 0177-CE" width={347} height={159} className="w-full h-24 object-contain" /></div>
                    <div className="bg-white rounded-xl p-3"><Image src="/brand/cadastur.jpg" alt="Cadastur — empresa credenciada" width={347} height={159} className="w-full h-24 object-contain" /></div>
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-xs mb-5 text-[#F59E0B] uppercase tracking-wider">Contato</h2>
                  <div className="space-y-4 text-sm text-blue-100/80">
                    <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" /> Rua Joaquim Nabuco, 2105, Loja B, Aldeota, Fortaleza - CE, CEP 60.125-121, Brasil.</p>
                    <a href="tel:+5585999948137" className="flex items-center gap-2 hover:text-white"><Phone className="w-4 h-4 text-[#F59E0B]" /> +55 85 99994-8137</a>
                    <a href="tel:+558530676311" className="flex items-center gap-2 hover:text-white"><Phone className="w-4 h-4 text-[#F59E0B]" /> +55 85 3067-6311</a>
                    <a href="mailto:contato@girassolviagens.com" className="flex items-center gap-2 hover:text-white"><Mail className="w-4 h-4 text-[#F59E0B]" /> contato@girassolviagens.com</a>
                  </div>
                  <h3 className="font-semibold text-xs text-white mt-7 mb-3">Siga-nos nas redes sociais</h3>
                  <div className="flex gap-3">
                    <a href="https://www.instagram.com/girassolviagens/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-[#F59E0B] text-[#082F5B] flex items-center justify-center hover:scale-105 transition-transform"><Instagram className="w-5 h-5" /></a>
                    <a href="https://www.facebook.com/share/1AuRMxhyHX/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-[#0B4EA2] border border-white/30 text-white flex items-center justify-center hover:scale-105 transition-transform"><Facebook className="w-5 h-5" /></a>
                    <a href="https://wa.me/5585999948137" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-105 transition-transform"><MessageCircle className="w-5 h-5" /></a>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-6 border-t border-white/10 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-blue-100/60">
                <p>&copy; {new Date().getFullYear()} Girassol Brasil Viagens e Turismo. Todos os direitos reservados.</p>
                <p>CNPJ 17.215.361/0001-58 &bull; ABAV 0177-CE &bull; Cadastur desde 2013</p>
              </div>
            </footer>
          </SiteContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
