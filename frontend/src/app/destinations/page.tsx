"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Compass, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_DESTINATIONS, Destination } from '@/lib/mockData';

export default function DestinationsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDestinations = MOCK_DESTINATIONS.filter((dest) => {
    const matchesRegion = selectedRegion === 'all' || dest.region === selectedRegion;
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative h-80 bg-[#1A252C] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544885935-98dd03b09034?q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/40 to-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="text-[#FBC02D] font-bold text-xs uppercase tracking-widest block mb-3">
            Exploração Sem Limites
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Nossos Destinos
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Do patrimônio arqueológico imortal do Egito e do Oriente Médio às maravilhas tropicais e culturais da América do Sul.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-premium border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Region Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {[
              { id: 'all', label: 'Todos os Destinos' },
              { id: 'egito', label: 'Egito & Mar Vermelho' },
              { id: 'america-do-sul', label: 'Brasil & América do Sul' },
              { id: 'multi-destino', label: 'Multi-Países (Egito + Jordânia + Dubai)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRegion === tab.id
                    ? 'bg-[#1B5E20] text-white shadow-md'
                    : 'bg-gray-50 text-[#546E7A] hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full md:w-72">
            <Search className="w-4 h-4 text-[#1B5E20]" />
            <input
              type="text"
              placeholder="Buscar destino ou atração..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs w-full outline-none text-[#263238] placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-premium shadow-premium-hover border border-gray-100 block group h-full flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header */}
                    <div className="h-64 relative w-full overflow-hidden bg-gray-100">
                      <img
                        src={dest.cover_image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-[#1B5E20] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                        {dest.country}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-2.5 text-white text-xs">
                        <span className="font-bold text-[#FBC02D] block mb-0.5">Duração recomendada:</span>
                        <span>{dest.ideal_duration}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-[#263238] group-hover:text-[#1B5E20] transition-colors mb-2">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-[#546E7A] leading-relaxed mb-4 line-clamp-2 font-light">
                        {dest.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-1.5 mb-6">
                        <span className="text-[11px] font-bold text-[#1B5E20] uppercase tracking-wider block">
                          Principais Destaques:
                        </span>
                        {dest.highlights.slice(0, 3).map((h, i) => (
                          <div key={i} className="text-xs text-[#546E7A] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FBC02D]" />
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Card */}
                  <div className="px-6 pb-6 pt-3 border-t border-gray-50 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Roteiros a partir de</span>
                      <span className="font-bold text-lg text-[#1B5E20]">${dest.starting_price} <span className="text-[10px] font-normal text-gray-500">USD</span></span>
                    </div>
                    <span className="text-xs font-bold text-[#1B5E20] group-hover:text-[#2E7D32] flex items-center gap-1">
                      Ver Detalhes <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-premium">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-[#263238] mb-2">Nenhum destino encontrado</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
              Não encontramos destinos correspondentes à sua busca. Tente buscar por outros termos ou redefinir os filtros.
            </p>
            <button
              onClick={() => { setSelectedRegion('all'); setSearchQuery(''); }}
              className="bg-[#1B5E20] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
