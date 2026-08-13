"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Award, ShieldCheck, Users, Globe2, Heart, 
  MapPin, CheckCircle, Star, Phone, MessageCircle, ArrowRight 
} from 'lucide-react';
import { MOCK_TEAM, MOCK_REVIEWS, MOCK_OFFICES } from '@/lib/mockData';

export default function AboutPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* 1. Hero Banner */}
      <section className="relative h-[60vh] min-h-[420px] bg-[#1A252C] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/40 to-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="text-[#FBC02D] font-bold text-xs uppercase tracking-widest block mb-3">
            Quem Somos &bull; Nossa História
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 font-display">
            Sobre a Girasol Tours
          </h1>
          <p className="text-gray-200 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Mais de 20 anos dedicados a proporcionar jornadas inesquecíveis, autênticas e seguras pelo Egito, Oriente Médio e América do Sul.
          </p>
        </div>
      </section>

      {/* 2. Brand Story & Credentials */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-premium border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#1B5E20]/10 text-[#1B5E20] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4" /> Operadora Receptiva Oficial (DMC)
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#263238]">
                A Sua Ponte de Confiança entre o Mundo Lusófono e o Egito
              </h2>
              <p className="text-sm sm:text-base text-[#546E7A] leading-relaxed font-light">
                A **Girasol Viagens e Turismo** é uma das principais operadoras de turismo receptivo (Destination Management Company) do Egito, com atuação estendida à Jordânia, Dubai e América do Sul (Brasil).
              </p>
              <p className="text-sm text-[#546E7A] leading-relaxed font-light">
                Devidamente licenciada pelo **Ministério do Turismo e Antiguidades do Egito (Licença Categoria A - Nº 2208)** e membro atuante da **IATA** e da **Associação Egípcia de Agências de Viagem (ETAA)**, nossa missão é conectar os viajantes à história viva dos faraós com o mais alto nível de conforto, pontualidade e acolhimento humano.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-2xl font-bold text-[#1B5E20] block mb-1">20+</span>
                  <span className="text-xs text-gray-500 font-medium">Anos de Excelência no Turismo</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-2xl font-bold text-[#1B5E20] block mb-1">15.000+</span>
                  <span className="text-xs text-gray-500 font-medium">Viajantes Satisfeitos</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544885935-98dd03b09034?q=80&w=800" 
                  alt="Cruzeiro no Rio Nilo Girasol"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#1B5E20] text-white p-6 rounded-2xl shadow-xl hidden sm:block max-w-xs">
                <p className="text-xs font-semibold leading-relaxed">
                  "Cuidamos de cada detalhe como se você fosse da nossa família."
                </p>
                <span className="text-[10px] text-[#FBC02D] font-bold mt-2 block">
                  — Filosofia Girasol
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Nossos Pilares de Atuação (Core Pillars) */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#1B5E20] text-xs font-bold uppercase tracking-wider block mb-2">
            Nossos Valores
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[#263238]">
            Por Que Milhares de Viajantes Confiam na Girasol
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Globe2,
              title: "Guias Especializados em Português",
              desc: "Contamos com um time seleto de egiptólogos profissionais e acadêmicos que falam fluentemente o português, tornando as explicações históricas cativantes e profundas."
            },
            {
              icon: ShieldCheck,
              title: "Logística Própria & Segurança Total",
              desc: "Frota moderna de veículos com ar-condicionado, motoristas de extrema pontualidade, atendimento VIP nos aeroportos e suporte presencial contínuo."
            },
            {
              icon: Heart,
              title: "Roteiros Sob Medida & Flexibilidade",
              desc: "Desde viagens românticas em cruzeiros luxuosos a grupos familiares e expedições históricas completas, adaptamos tudo aos seus desejos."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 hover:border-[#1B5E20]/30 transition-all">
              <div className="w-14 h-14 bg-[#1B5E20]/10 text-[#1B5E20] rounded-2xl flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#263238] mb-3">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#546E7A] leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Equipe & Liderança */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#1B5E20] text-xs font-bold uppercase tracking-wider block mb-2">
            Nossa Equipe
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[#263238]">
            Conheça Quem Faz a Magia Acontecer
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TEAM.map((member, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-premium border border-gray-100 group">
              <div className="h-72 w-full overflow-hidden bg-gray-100">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-[#263238] mb-1">{member.name}</h3>
                <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider block mb-3">
                  {member.role}
                </span>
                <p className="text-xs text-[#546E7A] leading-relaxed font-light">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Escritórios e Presença Internacional */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-premium border border-gray-100">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#1B5E20] text-xs font-bold uppercase tracking-wider block mb-2">Presença Global</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#263238]">
              Nossos Escritórios no Egito & no Brasil
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_OFFICES.map((office, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1B5E20]" />
                  <h4 className="font-bold text-sm text-[#263238]">{office.city}</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{office.address}</p>
                <p className="text-xs font-semibold text-[#1B5E20] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {office.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Box */}
      <section className="max-w-7xl mx-auto px-6 mt-20 text-center">
        <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-3xl p-10 sm:p-14 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para Planejar Sua Viagem dos Sonhos?</h2>
          <p className="text-sm text-gray-200 max-w-xl mx-auto mb-8 font-light">
            Nossos consultores estão à sua disposição para desenhar o roteiro ideal, com valores transparentes e assistência em cada passo.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/contact#orcamento" 
              className="bg-[#FBC02D] hover:bg-yellow-400 text-[#263238] font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm shadow-md transition-all"
            >
              Pedir Orçamento Grátis
            </Link>
            <a 
              href="https://wa.me/201060873700" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm border border-white/30 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" /> Conversar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
