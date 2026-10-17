"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Award, BadgeCheck, Building2, ChevronRight, Compass,
  CreditCard, Globe2, Headphones, Heart, Landmark, MapPin, Route,
  Send, ShieldCheck, Star, Timer,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/context/SiteContentContext';

const trustItems = [
  { icon: Award, text: 'Membro da ABAV 0177- CE — Associação Brasileira de Agências de Viagens' },
  { icon: BadgeCheck, text: 'Agência Cadastrada no Cadastur desde 2013' },
  { icon: Building2, text: 'Empresa com CNPJ desde 2013' },
  { icon: Landmark, text: 'Membro do Grupo Girassol Viagens Brasil – Egito' },
];

const benefits = [
  { icon: Globe2, title: 'Variados Destinos', text: 'Opções nacionais e internacionais para diferentes estilos de viagem.' },
  { icon: CreditCard, title: 'Facilidades de Aquisição', text: 'Condições planejadas para tornar sua próxima viagem possível.' },
  { icon: Route, title: 'Roteiros Encantadores', text: 'Programas cuidadosamente organizados para experiências inesquecíveis.' },
  { icon: Timer, title: 'Reservas Rápidas', text: 'Atendimento ágil e acompanhamento em todas as etapas da reserva.' },
  { icon: Headphones, title: 'Qualidade no Atendimento', text: 'Orientação personalizada antes, durante e depois da viagem.' },
  { icon: Heart, title: 'Amor e Cuidado', text: 'Cada detalhe é tratado com dedicação, respeito e responsabilidade.' },
];

export default function HomePage() {
  const { MOCK_DESTINATIONS, MOCK_TOURS, MOCK_REVIEWS } = useSiteContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const featuredTours = useMemo(() => {
    const selected = [
      MOCK_TOURS.find((tour) => tour.slug === 'egito-classico-e-cruzeiro-no-nilo'),
      MOCK_TOURS.find((tour) => tour.slug === 'maravilhas-da-jordania'),
      MOCK_TOURS.find((tour) => tour.is_multi_destination),
    ].filter(Boolean);
    return selected.length === 3 ? selected : MOCK_TOURS.slice(0, 3);
  }, [MOCK_TOURS]);

  const visibleReviews = MOCK_REVIEWS.filter((review) => review.rating > 1);
  const heroImage = MOCK_TOURS[0]?.primary_image || '/site-assets/cc25b2eb94a7e175.png';

  const submitNewsletter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('company')) return;
    if (captchaAnswer.trim() !== '7') {
      setCaptchaError('Resposta incorreta. Digite 7 para confirmar.');
      return;
    }
    setCaptchaError('');
    alert('Obrigado por se inscrever na nossa newsletter!');
    event.currentTarget.reset();
    setCaptchaAnswer('');
  };

  return (
    <div className="w-full relative bg-[#F8F9FA] pb-20">
      <section className="relative w-full min-h-[84vh] flex items-center justify-center bg-[#082F5B] overflow-hidden">
        <div
          className="absolute inset-0 opacity-45 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061D36] via-[#082F5B]/65 to-black/60" />

        <div className="relative max-w-6xl mx-auto px-6 text-center z-10 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-6 border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            OPERADORA BRASILEIRA ESPECIALISTA EM EGITO, JORDÂNIA, DUBAI, ORIENTE MÉDIO, ÍNDIA, TAILÂNDIA &amp; OUTROS DESTINOS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 font-display leading-[1.1]"
          >
            Descubra o Mundo com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#FDBA2D] to-[#FFCC4D]">
              Anos de Excelência
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#ECEFF1] text-base sm:text-xl max-w-4xl mx-auto font-light leading-relaxed mb-10 space-y-2"
          >
            <p>Egito, Jordânia, Dubai, Omã, Turquia, Túnica, Marrocos, Índia, Tailândia, Marrocos e outros destinos inesquecíveis.</p>
            <p>Pacotes completos, segurança, conforto supremo e o cuidado de especialistas.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Link
              href="/tours"
              className="bg-[#F59E0B] hover:bg-[#D97706] text-[#082F5B] font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base"
            >
              Ver Destinos e Pacotes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact#orcamento"
              className="glass-effect-dark hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full border border-white/30 shadow-lg transition-all text-sm sm:text-base"
            >
              Solicitar Orçamento Grátis
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-effect rounded-2xl max-w-3xl mx-auto p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-center shadow-2xl border border-white/50"
          >
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 flex-1 border border-gray-100 w-full shadow-inner">
              <MapPin className="w-5 h-5 text-[#0B4EA2] shrink-0" />
              <input
                type="text"
                placeholder="Para onde deseja viajar?"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full text-xs sm:text-sm outline-none text-[#263238] placeholder:text-gray-400"
              />
            </div>
            <Link
              href={`/tours?search=${encodeURIComponent(searchQuery)}`}
              className="bg-[#0B4EA2] hover:bg-[#073B7A] text-white font-bold text-sm px-7 py-3.5 rounded-xl w-full sm:w-auto text-center shadow-md transition-all whitespace-nowrap"
            >
              Buscar Roteiros
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 -mt-10 relative z-20">
        {trustItems.map((item) => (
          <div key={item.text} className="bg-white rounded-2xl p-6 shadow-premium border border-gray-100 flex gap-4 hover:border-[#F59E0B]/50 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-[#0B4EA2]/10 rounded-xl flex items-center justify-center text-[#0B4EA2] shrink-0">
              <item.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#263238] leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0B4EA2]/10 text-[#0B4EA2] font-bold text-xs uppercase tracking-widest px-5 py-2 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            POR QUE ESCOLHER GIRASSO BRASIL VIAGENS E TURISMO
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#263238] mb-4">
            Especialistas em Organizar Viagens Inesquecíveis
          </h2>
          <p className="text-sm sm:text-base text-[#546E7A] leading-relaxed">
            Do Brasil para o mundo: cuidamos de cada detalhe da sua viagem com segurança, conforto e atendimento personalizado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 hover:border-[#F59E0B]/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B4EA2] to-[#F59E0B] flex items-center justify-center text-white shadow-md mb-5">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#263238] mb-3">{benefit.title}</h3>
              <p className="text-sm text-[#546E7A] leading-relaxed">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-[#0B4EA2] text-xs font-bold uppercase tracking-wider block mb-2">Experiências Mais Procuradas</span>
            <h2 className="text-3xl font-bold tracking-tight text-[#263238]">Pacotes de Viagem em Destaque</h2>
            <p className="text-sm text-[#546E7A] mt-2">Egito, Jordânia e uma jornada multidestinos selecionados do nosso catálogo.</p>
          </div>
          <Link href="/tours" className="text-sm font-bold text-[#0B4EA2] hover:text-[#F59E0B] transition-colors flex items-center gap-1">
            Ver Todos os Pacotes &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTours.map((tour) => tour && (
            <Link href={`/tours/${tour.slug}`} key={tour.id} className="bg-white rounded-3xl overflow-hidden shadow-premium shadow-premium-hover border border-gray-100 block group">
              <div className="h-64 relative w-full overflow-hidden bg-gray-100">
                <img src={tour.primary_image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {tour.reviews_count > 0 && (
                  <div className="absolute top-4 left-4 bg-[#F59E0B] text-xs font-bold px-3 py-1 rounded-full text-[#082F5B] shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {tour.average_rating} ({tour.reviews_count})
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-lg">{tour.city_name}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center text-xs font-bold text-[#0B4EA2] uppercase mb-2.5">
                  <span>{tour.category}</span>
                  <span className="text-gray-500 font-normal">{tour.duration_days} Dias</span>
                </div>
                <h3 className="font-bold text-lg text-[#263238] group-hover:text-[#0B4EA2] transition-colors mb-3 line-clamp-2 leading-snug">{tour.name}</h3>
                <p className="text-xs text-[#546E7A] line-clamp-2 mb-5 leading-relaxed font-light">{tour.description}</p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[11px] text-gray-400 block">A partir de</span>
                    <span className="font-bold text-xl text-[#0B4EA2]">{Number(tour.base_price) > 0 ? `$${tour.base_price}` : 'Consulte'} <span className="text-xs font-normal text-gray-500">USD</span></span>
                  </div>
                  <span className="bg-[#0B4EA2]/10 group-hover:bg-[#0B4EA2] group-hover:text-white transition-all text-[#0B4EA2] text-xs font-semibold px-4 py-2 rounded-xl">Ver Detalhes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#0B4EA2] text-xs font-bold uppercase tracking-wider block mb-2">Explore Lugares Fascinantes</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#263238] mb-3">Destinos Populares</h2>
          <p className="text-sm text-[#546E7A]">Do Brasil para o mundo, com roteiros culturais, praias, desertos e experiências únicas.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DESTINATIONS.slice(0, 4).map((destination) => (
            <Link href={`/destinations/${destination.slug}`} key={destination.id} className="relative h-96 rounded-3xl overflow-hidden group shadow-premium block">
              <img src={destination.cover_image} alt={destination.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] text-[#F59E0B] font-bold uppercase tracking-wider block mb-1">{destination.country} &bull; {destination.ideal_duration}</span>
                <h3 className="font-bold text-xl text-white mb-2 leading-snug group-hover:text-[#F59E0B] transition-colors">{destination.name}</h3>
                <p className="text-xs text-gray-200 line-clamp-2 font-light mb-3">{destination.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/destinations" className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-[#0B4EA2] text-[#0B4EA2] font-bold text-xs px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all">
            Explorar Todos os Destinos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#0B4EA2] text-xs font-bold uppercase tracking-wider block mb-2">O Que Dizem Nossos Clientes</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#263238] mb-4">Avaliações Reais de Viajantes</h2>
          <a href="https://br.trustpilot.com/review/girassolviagens.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B4EA2] hover:text-[#F59E0B]">
            <ShieldCheck className="w-4 h-4" /> Ver todas as avaliações no Trustpilot
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#F59E0B] mb-4">
                  {Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="w-4 h-4 fill-current" />)}
                </div>
                <h3 className="font-bold text-base text-[#263238] mb-2">“{review.title}”</h3>
                <p className="text-xs text-[#546E7A] leading-relaxed mb-6 font-light">{review.comment}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-xs text-[#263238]">{review.author}</p>
                <p className="text-[10px] text-gray-400">{review.country} &bull; {review.date}</p>
                <p className="text-[10px] text-[#0B4EA2] font-semibold mt-1">{review.tour_name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="bg-gradient-to-r from-[#082F5B] via-[#0B4EA2] to-[#F59E0B] rounded-3xl p-10 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <Compass className="w-10 h-10 mx-auto mb-4 text-[#FDBA2D]" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Receba Ofertas Exclusivas &amp; Dicas de Viagem</h2>
            <p className="text-sm text-white/85 mb-8 font-light">Assine nossa newsletter e receba novidades sobre destinos, pacotes e promoções.</p>
            <form onSubmit={submitNewsletter} className="grid grid-cols-1 sm:grid-cols-[1fr_9rem_auto] gap-3 max-w-2xl mx-auto text-left">
              <input name="email" type="email" required aria-label="Seu e-mail" placeholder="Seu melhor e-mail..." className="bg-white text-[#263238] placeholder:text-gray-400 px-5 py-3.5 rounded-xl text-sm outline-none shadow-inner" />
              <input name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <label className="sr-only" htmlFor="newsletter-captcha">Quanto é 3 + 4?</label>
              <input id="newsletter-captcha" inputMode="numeric" required value={captchaAnswer} onChange={(event) => setCaptchaAnswer(event.target.value)} placeholder="3 + 4 = ?" className="bg-white text-[#263238] placeholder:text-gray-500 px-4 py-3.5 rounded-xl text-sm outline-none shadow-inner" />
              <button type="submit" className="bg-[#F59E0B] hover:bg-[#D97706] text-[#082F5B] font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
                Inscrever-se <Send className="w-4 h-4" />
              </button>
              {captchaError && <p className="sm:col-span-3 text-xs text-white font-semibold text-center" role="alert">{captchaError}</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
