"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Calendar, Clock, Globe2, Coins, CheckCircle, 
  ArrowRight, Sparkles, MessageCircle, Star, Compass 
} from 'lucide-react';
import { MOCK_DESTINATIONS, MOCK_TOURS } from '@/lib/mockData';

export default function SingleDestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const destination = MOCK_DESTINATIONS.find(d => d.slug === resolvedParams.slug) || MOCK_DESTINATIONS[0];

  // Find related tours matching this destination
  const relatedTours = MOCK_TOURS.filter(t => 
    t.city_name.toLowerCase().includes(destination.name.toLowerCase()) ||
    t.country.toLowerCase().includes(destination.country.toLowerCase()) ||
    (destination.region === 'multi-destino' && t.is_multi_destination)
  );

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* 1. Hero Section */}
      <section className="relative h-[65vh] min-h-[450px] bg-[#1A252C] flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 opacity-55 bg-cover bg-center"
          style={{ backgroundImage: `url('${destination.cover_image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#1B5E20] text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
              {destination.country}
            </span>
            <span className="text-[#FBC02D] text-xs font-semibold">
              ★ Destino Certificado Girasol
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3 font-display">
            {destination.name}
          </h1>
          <p className="text-lg text-gray-200 font-light max-w-3xl">
            {destination.tagline}
          </p>
        </div>
      </section>

      {/* 2. Key Facts Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-6 shadow-premium border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1B5E20]/10 text-[#1B5E20] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-bold uppercase block">Melhor Época</span>
              <span className="text-xs font-bold text-[#263238]">{destination.best_time_to_visit}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1B5E20]/10 text-[#1B5E20] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-bold uppercase block">Duração Ideal</span>
              <span className="text-xs font-bold text-[#263238]">{destination.ideal_duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1B5E20]/10 text-[#1B5E20] flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-bold uppercase block">Idioma</span>
              <span className="text-xs font-bold text-[#263238]">{destination.language}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1B5E20]/10 text-[#1B5E20] flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-bold uppercase block">Moeda Local</span>
              <span className="text-xs font-bold text-[#263238]">{destination.currency}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content & Itinerary Showcase */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col (Col-2) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100">
            <h2 className="text-2xl font-bold text-[#263238] mb-4">Sobre o Destino</h2>
            <p className="text-sm text-[#546E7A] leading-relaxed font-light mb-8">
              {destination.description}
            </p>

            <h3 className="text-lg font-bold text-[#263238] mb-4">Atrações e Experiências Inclusas:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destination.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <CheckCircle className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#263238] font-medium leading-tight">{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Photo Gallery */}
          {destination.gallery && destination.gallery.length > 0 && (
            <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100">
              <h2 className="text-2xl font-bold text-[#263238] mb-6">Galeria de Imagens</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.gallery.map((img, i) => (
                  <div key={i} className="h-52 rounded-2xl overflow-hidden shadow">
                    <img src={img} alt={`${destination.name} - ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Matching Tour Packages */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#263238]">Pacotes Disponíveis para {destination.name}</h2>
              <Link href="/tours" className="text-xs font-bold text-[#1B5E20] hover:underline">Ver Todos</Link>
            </div>

            {relatedTours.length > 0 ? (
              <div className="space-y-6">
                {relatedTours.map((t) => (
                  <div key={t.id} className="bg-white rounded-3xl p-6 shadow-premium border border-gray-100 flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-full sm:w-48 h-40 rounded-2xl overflow-hidden shrink-0">
                      <img src={t.primary_image} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase text-[#1B5E20]">{t.category}</span>
                        <span className="text-gray-400">&bull;</span>
                        <span className="text-[10px] text-gray-500 font-medium">{t.duration_days} Dias</span>
                      </div>
                      <h3 className="font-bold text-lg text-[#263238] mb-2">{t.name}</h3>
                      <p className="text-xs text-[#546E7A] line-clamp-2 mb-4 font-light">{t.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Preço base</span>
                          <span className="font-bold text-lg text-[#1B5E20]">${t.base_price} USD</span>
                        </div>
                        <Link 
                          href={`/tours/${t.slug}`} 
                          className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow"
                        >
                          Ver Roteiro Completo
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-4">Novas saídas programadas estão sendo publicadas para este destino.</p>
                <Link href="/contact" className="bg-[#1B5E20] text-white text-xs font-bold px-6 py-2.5 rounded-xl inline-block">
                  Solicitar Roteiro Sob Medida
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Consultation Box (Col-1) */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider block mb-1">
                Consultoria Especializada
              </span>
              <h3 className="text-xl font-bold text-[#263238]">Quer Conhecer {destination.name}?</h3>
              <p className="text-xs text-[#546E7A] mt-2 leading-relaxed">
                Nossos consultores no Cairo e no Brasil montam seu roteiro privativo ou em grupo com as melhores tarifas e suporte VIP 24h.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs text-[#263238]">
              <div className="flex justify-between">
                <span className="text-gray-500">Pacotes a partir de:</span>
                <span className="font-bold text-[#1B5E20]">${destination.starting_price} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guias privativos:</span>
                <span className="font-bold">Em Português</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo de viagem:</span>
                <span className="font-bold">Customizável (DMC)</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                href="/contact#orcamento"
                className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-xs py-3.5 rounded-xl block text-center shadow transition-all"
              >
                Solicitar Orçamento Grátis
              </Link>
              <a 
                href="https://wa.me/201060873700" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Conversar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
