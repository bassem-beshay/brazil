"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  Calendar, Compass, ShieldCheck, Heart, Star, 
  Check, X, ArrowLeft, MessageCircle, Sparkles, MapPin, Users 
} from 'lucide-react';
import { MOCK_TOURS, TourPackage } from '@/lib/mockData';

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  // Find from mock or initial state
  const initialTour = MOCK_TOURS.find(t => t.slug === resolvedParams.slug) || MOCK_TOURS[0];
  const [tour, setTour] = useState<TourPackage>(initialTour);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    // Try fetching live tour if available in backend
    api.get(`/tours/${resolvedParams.slug}/`)
      .then(res => {
        if (res.data) {
          setTour(res.data);
        }
      })
      .catch(() => {
        // Fallback gracefully to mock data
        const match = MOCK_TOURS.find(t => t.slug === resolvedParams.slug) || MOCK_TOURS[0];
        setTour(match);
      });
  }, [resolvedParams.slug]);

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
  };

  const selectPackage = (pkg: any) => {
    localStorage.setItem('checkout_package', JSON.stringify({
      tour_id: tour.id,
      tour_name: tour.name,
      package_id: pkg.id,
      package_title: pkg.title,
      start_date: pkg.start_date,
      end_date: pkg.end_date,
      price: pkg.price_per_person
    }));

    router.push('/booking/checkout');
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* 1. Luxury Cover Header */}
      <section className="relative h-[65vh] min-h-[450px] bg-[#1A252C] flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 opacity-55 bg-cover bg-center"
          style={{ backgroundImage: `url('${tour.primary_image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full text-white">
          <Link 
            href="/tours" 
            className="inline-flex items-center gap-1.5 text-xs text-[#FBC02D] hover:underline font-bold mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Catálogo de Pacotes
          </Link>

          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#1B5E20] text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase">
                  {tour.category}
                </span>
                <span className="text-[#FBC02D] text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {tour.average_rating} ({tour.reviews_count} avaliações)
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-2 font-display">
                {tour.name}
              </h1>
              <p className="text-gray-200 text-xs sm:text-sm font-light">
                {tour.city_name} &bull; Duração: <strong>{tour.duration_days} Dias</strong> &bull; Nível: <strong>{tour.difficulty}</strong>
              </p>
            </div>

            <button 
              onClick={handleWishlist}
              className={`p-3.5 rounded-full glass-effect shadow-md flex items-center justify-center cursor-pointer transition-all ${
                wishlisted ? 'text-[#EC407A]' : 'text-white hover:text-[#FBC02D]'
              }`}
              title="Salvar nos Favoritos"
            >
              <Heart className="w-6 h-6" fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Itinerary & Booking Details */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Itinerary Column (Col-2) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100">
            <h2 className="text-2xl font-bold text-[#263238] mb-4">Visão Geral do Pacote</h2>
            <p className="text-sm text-[#546E7A] leading-relaxed font-light">{tour.description}</p>
          </section>

          {/* Day by Day Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100">
              <h2 className="text-2xl font-bold text-[#263238] mb-8 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#1B5E20]" />
                Roteiro Detalhado Dia a Dia
              </h2>

              <div className="relative border-l-2 border-[#1B5E20]/20 ml-4 pl-8 space-y-10">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="relative">
                    {/* Circle badge */}
                    <div className="absolute -left-12 top-0.5 w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-bold text-xs shadow">
                      {day.day}
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-[#263238] mb-2">
                      Dia {day.day}: {day.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#546E7A] leading-relaxed font-light mb-3">
                      {day.description}
                    </p>
                    {day.meals && (
                      <span className="text-[11px] font-semibold text-[#1B5E20] bg-[#1B5E20]/10 px-3 py-1 rounded-lg inline-block">
                        🍽️ Refeições: {day.meals}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inclusions & Exclusions */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-base text-[#263238] mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-[#1B5E20]" /> O Que Está Incluso
              </h3>
              <ul className="space-y-3">
                {tour.inclusions.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#546E7A] flex gap-2.5 items-start">
                    <Check className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#263238] mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" /> O Que Não Está Incluso
              </h3>
              <ul className="space-y-3">
                {tour.exclusions.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#546E7A] flex gap-2.5 items-start">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Right Sidebar Booking Card (Col-1) */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 sticky top-24 space-y-6">
            <div>
              <span className="text-xs text-gray-400 block mb-1">Preço Inicial por Pessoa</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#1B5E20]">${tour.base_price}</span>
                <span className="text-xs text-gray-500 font-semibold">USD</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Valores baseados em acomodação dupla 5★</p>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-bold text-sm text-[#263238] mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1B5E20]" /> Próximas Saídas Garantidas
              </h4>

              <div className="space-y-3">
                {tour.packages && tour.packages.length > 0 ? (
                  tour.packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/70 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#263238]">{pkg.title}</span>
                        <span className="text-xs font-bold text-[#1B5E20]">${pkg.price_per_person} USD</span>
                      </div>
                      <p className="text-[11px] text-gray-500">{pkg.start_date} até {pkg.end_date}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-amber-600 font-semibold">{pkg.available_spots} vagas restantes</span>
                        <button 
                          onClick={() => selectPackage(pkg)}
                          className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer shadow"
                        >
                          Reservar Data
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 p-4 bg-gray-50 rounded-xl">
                    Saídas sob demanda durante todo o ano.
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-3">
              <Link 
                href="/contact#orcamento" 
                className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-xs font-bold py-3.5 rounded-xl block text-center shadow transition-all"
              >
                Personalizar Meu Roteiro
              </Link>
              <a 
                href="https://wa.me/201060873700" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Dúvidas no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
