"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Shield, Sparkles, MapPin, Award, Headphones, 
  Heart, Star, ArrowRight, CheckCircle2, ChevronRight, Send, Compass
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AIChatBot } from '@/components/AIChatBot';
import { MOCK_DESTINATIONS, MOCK_TOURS, MOCK_REVIEWS } from '@/lib/mockData';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Form states
  const [aiBudget, setAiBudget] = useState('2000');
  const [aiStyle, setAiStyle] = useState('egito-nilo');
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    
    // Simulate smart AI recommendation matching Portuguese criteria
    setTimeout(() => {
      if (aiStyle === 'egito-nilo') {
        setAiRecommendation({
          title: "Expedição Faraônica Recomendada",
          style: "Egito Clássico & Cruzeiro 5★ no Rio Nilo",
          days: 8,
          price: "1.450",
          tour: MOCK_TOURS[0]
        });
      } else if (aiStyle === 'mar-vermelho') {
        setAiRecommendation({
          title: "História & Relaxamento no Mar Vermelho",
          style: "Pirâmides, Templos & Resort All-Inclusive",
          days: 11,
          price: "1.980",
          tour: MOCK_TOURS[1]
        });
      } else {
        setAiRecommendation({
          title: "Grande Jornada Multi-Destino",
          style: "Egito & Jordânia (Petra e Wadi Rum)",
          days: 14,
          price: "3.250",
          tour: MOCK_TOURS[3]
        });
      }
      setAiLoading(false);
    }, 600);
  };

  return (
    <div className="w-full relative bg-[#F8F9FA] pb-20">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center bg-[#1A252C] overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 opacity-45 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1800')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/40 to-black/60" />

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-widest mb-6 border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-[#FBC02D] animate-pulse" />
            Operadora Receptiva Oficial no Egito & América do Sul
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 font-display leading-[1.15]"
          >
            Descubra o Egito com <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBC02D] via-amber-300 to-yellow-400">
              Anos de Excelência
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#ECEFF1] text-base sm:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-10"
          >
            Pacotes completos: Pirâmides + Cruzeiro 5 estrelas no Rio Nilo. Viaje com máxima segurança, conforto supremo e guias egiptólogos fluentes em português.
          </motion.p>

          {/* Quick Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Link 
              href="/tours" 
              className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base"
            >
              Explorar Pacotes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/contact#orcamento" 
              className="glass-effect-dark hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full border border-white/30 shadow-lg transition-all text-sm sm:text-base"
            >
              Solicitar Orçamento Grátis
            </Link>
          </motion.div>

          {/* Floating Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-effect rounded-2xl max-w-3xl mx-auto p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-center shadow-2xl border border-white/50"
          >
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 flex-1 border border-gray-100 w-full shadow-inner">
              <MapPin className="w-5 h-5 text-[#1B5E20] shrink-0" />
              <input 
                type="text" 
                placeholder="Para onde deseja viajar? (Ex: Cairo, Cruzeiro Nilo, Hurghada, Rio...)" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm outline-none text-[#263238] placeholder:text-gray-400" 
              />
            </div>

            <Link 
              href={`/tours?search=${encodeURIComponent(searchQuery)}`}
              className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-95 text-white font-bold text-sm px-7 py-3.5 rounded-xl w-full sm:w-auto text-center shadow-md transition-all whitespace-nowrap"
            >
              Buscar Roteiros
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Trust Badges Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6 -mt-10 relative z-20">
        {[
          { icon: Award, title: "Certificação IATA & Min. Turismo", desc: "Agência credenciada sob a Licença Oficial Nº 2208 A no Egito." },
          { icon: Shield, title: "Segurança & Conforto VIP", desc: "Traslados privativos em carros modernos, motoristas dedicados e seguro viagem." },
          { icon: Headphones, title: "Atendimento 24h em Português", desc: "Suporte contínuo via WhatsApp antes, durante e após a sua viagem." },
          { icon: Sparkles, title: "Guias Especializados", desc: "Egiptólogos profissionais e apaixonados que falam o seu idioma nativo." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-premium border border-gray-100 flex gap-4 hover:border-[#1B5E20]/30 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-[#1B5E20]/10 rounded-xl flex items-center justify-center text-[#1B5E20] shrink-0">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1.5 text-[#263238]">{item.title}</h3>
              <p className="text-xs text-[#546E7A] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Por Que Escolher a Girasol (Why Choose Us - Exactly from girasoltours.com) */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#1B5E20]/10 text-[#1B5E20] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1B5E20] animate-pulse" />
            Por Que Escolher a Girasol
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#263238] mb-4">
            Seu Parceiro de Confiança no Turismo do Egito e América do Sul
          </h2>
          <p className="text-sm sm:text-base text-[#546E7A] leading-relaxed">
            Combinamos profundo conhecimento local com padrões internacionais de atendimento para entregar viagens que superam todas as expectativas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100 hover:border-[#1B5E20]/30 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white shrink-0 shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#263238] mb-3">Especialistas no Egito</h3>
              <p className="text-sm text-[#546E7A] leading-relaxed mb-4">
                Ao viajar com a Girasol Viagens e Turismo, você escolhe uma equipe de profissionais e especialistas no Egito com mais de 20 anos de experiência. Cuidamos de cada detalhe da sua jornada para garantir uma experiência memorável.
              </p>
              <Link href="/about" className="text-xs font-bold text-[#1B5E20] hover:text-[#2E7D32] inline-flex items-center gap-1">
                Saiba Mais Sobre Nós <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100 hover:border-[#1B5E20]/30 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white shrink-0 shadow-md">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#263238] mb-3">Privilégios & Estrutura Própria</h3>
              <p className="text-sm text-[#546E7A] leading-relaxed mb-4">
                Com escritórios próprios no Cairo, Luxor, Aswan, Hurghada e Sharm El Sheikh, e parceiros no Brasil e em todo o mundo, você recebe suporte presencial de alto nível onde quer que esteja.
              </p>
              <Link href="/contact" className="text-xs font-bold text-[#1B5E20] hover:text-[#2E7D32] inline-flex items-center gap-1">
                Ver Nossos Escritórios <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100 hover:border-[#1B5E20]/30 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white shrink-0 shadow-md">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#263238] mb-3">Suporte Dedicado 24/7</h3>
              <p className="text-sm text-[#546E7A] leading-relaxed mb-4">
                Cuidamos de todas as suas solicitações com rapidez e eficiência. Nossa equipe dedicada está disponível 24 horas por dia via WhatsApp, telefone ou e-mail para atendê-lo com total presteza.
              </p>
              <a href="https://wa.me/201060873700" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#1B5E20] hover:text-[#2E7D32] inline-flex items-center gap-1">
                Falar pelo WhatsApp <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100 hover:border-[#1B5E20]/30 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white shrink-0 shadow-md">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#263238] mb-3">Nosso Estilo de Trabalho</h3>
              <p className="text-sm text-[#546E7A] leading-relaxed mb-4">
                Amor e carinho pelas suas necessidades e sonhos é a nossa marca registrada. Nossa equipe profissional aconselha em todos os detalhes com atendimento humanizado e hospitalidade genuína.
              </p>
              <Link href="/about" className="text-xs font-bold text-[#1B5E20] hover:text-[#2E7D32] inline-flex items-center gap-1">
                Conheça Nossa Filosofia <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pacotes em Destaque (Featured Tours) */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-[#1B5E20] text-xs font-bold uppercase tracking-wider block mb-2">
              Experiências Mais Procuradas
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#263238]">Pacotes de Viagem em Destaque</h2>
          </div>
          <Link href="/tours" className="text-sm font-bold text-[#1B5E20] hover:text-[#2E7D32] transition-colors flex items-center gap-1">
            Ver Todos os Pacotes &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TOURS.slice(0, 3).map((tour) => (
            <Link 
              href={`/tours/${tour.slug}`} 
              key={tour.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-premium shadow-premium-hover border border-gray-100 block group"
            >
              <div className="h-64 relative w-full overflow-hidden bg-gray-100">
                <img 
                  src={tour.primary_image} 
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-[#FBC02D] text-xs font-bold px-3 py-1 rounded-full text-[#263238] shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {tour.average_rating} ({tour.reviews_count})
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-lg">
                    {tour.city_name}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center text-xs font-bold text-[#1B5E20] uppercase mb-2.5">
                  <span>{tour.category}</span>
                  <span className="text-gray-500 font-normal">{tour.duration_days} Dias</span>
                </div>
                <h3 className="font-bold text-lg text-[#263238] group-hover:text-[#1B5E20] transition-colors mb-3 line-clamp-2 leading-snug">
                  {tour.name}
                </h3>
                <p className="text-xs text-[#546E7A] line-clamp-2 mb-5 leading-relaxed font-light">
                  {tour.description}
                </p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[11px] text-gray-400 block">A partir de</span>
                    <span className="font-bold text-xl text-[#1B5E20]">${tour.base_price} <span className="text-xs font-normal text-gray-500">/ pessoa</span></span>
                  </div>
                  <span className="bg-gray-50 group-hover:bg-[#1B5E20] group-hover:text-white transition-all text-[#1B5E20] text-xs font-semibold px-4 py-2 rounded-xl">
                    Ver Detalhes
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Destinos Populares (Popular Destinations) */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#1B5E20] text-xs font-bold uppercase tracking-wider block mb-2">Explore Lugares Fascinantes</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#263238] mb-3">Destinos Populares</h2>
          <p className="text-sm text-[#546E7A]">Dos templos faraônicos às praias cristalinas e florestas tropicais.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DESTINATIONS.slice(0, 4).map((dest) => (
            <Link 
              href={`/destinations/${dest.slug}`} 
              key={dest.id}
              className="relative h-96 rounded-3xl overflow-hidden group shadow-premium block"
            >
              <img 
                src={dest.cover_image} 
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] text-[#FBC02D] font-bold uppercase tracking-wider block mb-1">
                  {dest.country} &bull; {dest.ideal_duration}
                </span>
                <h3 className="font-bold text-xl text-white mb-2 leading-snug group-hover:text-[#FBC02D] transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-2 font-light mb-3">
                  {dest.tagline}
                </p>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/20">
                  <span className="text-gray-300">A partir de</span>
                  <span className="font-bold text-[#FBC02D] text-sm">${dest.starting_price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            href="/destinations" 
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-[#1B5E20] text-[#1B5E20] font-bold text-xs px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all"
          >
            Explorar Todos os Destinos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. AI Smart Concierge Section (Portuguese) */}
      <section className="max-w-7xl mx-auto px-6 mt-28 bg-gradient-to-br from-[#1B5E20]/10 via-[#1B5E20]/5 to-transparent rounded-3xl p-8 sm:p-14 border border-[#1B5E20]/15 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 text-[#1B5E20] font-bold text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#FBC02D]" />
            Concierge Inteligente Girasol AI
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#263238] mb-4">
            Monte seu Roteiro Personalizado em Segundos
          </h2>
          <p className="text-sm text-[#546E7A] leading-relaxed mb-8">
            Informe seu orçamento e estilo de viagem desejado (cruzeiro pelo Nilo, praias do Mar Vermelho ou expedição multi-país) para que nosso assistente inteligente apresente a recomendação ideal para você.
          </p>

          <form onSubmit={handleAIPlanning} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#263238] mb-1.5 block">Orçamento Máximo por Pessoa (USD)</label>
              <input 
                type="number" 
                value={aiBudget} 
                onChange={e => setAiBudget(e.target.value)} 
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#1B5E20]" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#263238] mb-1.5 block">Estilo de Viagem</label>
              <select 
                value={aiStyle} 
                onChange={e => setAiStyle(e.target.value)} 
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#1B5E20]"
              >
                <option value="egito-nilo">Egito Clássico & Cruzeiro no Nilo 5★</option>
                <option value="mar-vermelho">História & Praia All-Inclusive no Mar Vermelho</option>
                <option value="multi-destino">Multi-Destino (Egito + Jordânia / Petra)</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={aiLoading}
              className="col-span-1 sm:col-span-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {aiLoading ? "Consultando Especialista Virtual..." : "Gerar Recomendação Personalizada"}
            </button>
          </form>
        </div>

        {/* AI Output Result Box */}
        <div className="w-full lg:w-96 min-h-[340px] bg-white rounded-2xl p-6 shadow-premium border border-gray-100 flex flex-col justify-between">
          {aiRecommendation ? (
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B5E20] uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E20]" />
                  {aiRecommendation.title}
                </div>
                <p className="text-xs text-gray-500 mb-4">{aiRecommendation.style}</p>
                
                <div className="rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                  <img 
                    src={aiRecommendation.tour.primary_image} 
                    alt={aiRecommendation.tour.name} 
                    className="w-full h-32 object-cover" 
                  />
                  <div className="p-3">
                    <h5 className="font-bold text-xs text-[#263238] line-clamp-1">{aiRecommendation.tour.name}</h5>
                    <p className="text-[10px] text-gray-500">{aiRecommendation.days} dias &bull; A partir de ${aiRecommendation.price} / pessoa</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <Link 
                  href={`/tours/${aiRecommendation.tour.slug}`} 
                  className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-center text-xs font-bold py-3 rounded-xl block transition-colors shadow"
                >
                  Ver Roteiro e Reservar
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full my-auto py-8">
              <div className="w-16 h-16 rounded-2xl bg-[#FBC02D]/20 flex items-center justify-center mb-4 text-[#FBC02D]">
                <Sparkles className="w-8 h-8 animate-bounce" />
              </div>
              <h4 className="font-bold text-sm text-[#263238] mb-2">Aguardando Seus Critérios</h4>
              <p className="text-xs text-[#90A4AE] leading-relaxed max-w-xs">
                Selecione o orçamento e seu estilo preferido para receber a melhor sugestão da Girasol Tours.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 7. Depoimentos e Avaliações (Traveler Reviews - Trustpilot) */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#1B5E20] text-xs font-bold uppercase tracking-wider block mb-2">O Que Dizem Nossos Clientes</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#263238] mb-4">Avaliações Reais de Viajantes</h2>
          
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1 text-[#00b67a]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-current text-[#00b67a]" />
              ))}
            </div>
            <span className="font-bold text-xl text-gray-900">4.3 / 5.0</span>
            <span className="text-xs text-gray-500">no Trustpilot</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#FBC02D] mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h4 className="font-bold text-base text-[#263238] mb-2">"{rev.title}"</h4>
                <p className="text-xs text-[#546E7A] leading-relaxed mb-6 font-light">
                  {rev.comment}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-xs text-[#263238]">{rev.author}</p>
                <p className="text-[10px] text-gray-400">{rev.country} &bull; {rev.date}</p>
                <p className="text-[10px] text-[#1B5E20] font-semibold mt-1">{rev.tour_name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter Banner */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="bg-gradient-to-r from-[#263238] via-[#1E2B32] to-[#1B5E20] rounded-3xl p-10 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Receba Ofertas Exclusivas & Dicas de Viagem
            </h2>
            <p className="text-sm text-[#CFD8DC] mb-8 font-light">
              Assine nossa newsletter e seja o primeiro a saber sobre novas saídas de cruzeiros no Nilo, promoções sazonais e guias completos.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Obrigado por se inscrever na nossa newsletter VIP!"); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                required
                placeholder="Seu melhor e-mail..." 
                className="bg-white text-[#263238] placeholder:text-gray-400 px-5 py-3.5 rounded-xl text-sm flex-1 outline-none shadow-inner" 
              />
              <button 
                type="submit" 
                className="bg-[#FBC02D] hover:bg-yellow-400 text-[#263238] font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                Inscrever-se <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Floating Chat Concierge */}
      <AIChatBot />
    </div>
  );
}
