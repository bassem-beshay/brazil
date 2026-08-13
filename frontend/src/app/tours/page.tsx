"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Search, SlidersHorizontal, Eye, Star, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_TOURS, TourPackage } from '@/lib/mockData';

function TourCatalogContent() {
  const [tours, setTours] = useState<TourPackage[]>(MOCK_TOURS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceMax, setPriceMax] = useState('6000');

  const filterTours = () => {
    let result = MOCK_TOURS;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.city_name.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    if (category) {
      result = result.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (priceMax) {
      result = result.filter(t => {
        const num = parseFloat(t.base_price.replace('.', '').replace(',', '.'));
        return num <= parseFloat(priceMax);
      });
    }
    setTours(result);
  };

  useEffect(() => {
    filterTours();
  }, [category, priceMax, search]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="relative h-72 bg-[#1A252C] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-35 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/40 to-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="text-[#FBC02D] font-bold text-xs uppercase tracking-widest block mb-2">
            Catálogo de Roteiros Exclusivos
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 font-display">
            Pacotes de Viagem & Cruzeiros no Nilo
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Experiências completas com guias credenciados em português, traslados privativos e hospedagens de alto padrão.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-10">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 bg-white rounded-3xl p-6 shadow-premium border border-gray-100 h-fit space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <SlidersHorizontal className="w-5 h-5 text-[#1B5E20]" />
            <h3 className="font-bold text-sm text-[#263238]">Filtrar Experiências</h3>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="text-xs font-bold text-[#263238] mb-2 block">Palavras-chave</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <input 
                type="text" 
                placeholder="Ex: Nilo, Pirâmides, Rio..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-xs bg-transparent outline-none text-[#263238]" 
              />
              <Search className="w-4 h-4 text-[#1B5E20]" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-bold text-[#263238] mb-2 block">Categoria de Viagem</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20] text-[#263238]"
            >
              <option value="">Todas as Categorias</option>
              <option value="Clássico & Histórico">Clássico & Histórico (Nilo)</option>
              <option value="História & Praia">História & Praia (Mar Vermelho)</option>
              <option value="Grand Multi-Destino">Multi-Destino (Egito + Jordânia)</option>
              <option value="Natureza & Luxo Tropical">Brasil & América do Sul</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#263238] mb-2">
              <span>Orçamento Máximo</span>
              <span className="text-[#1B5E20]">${priceMax} USD</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="6000" 
              step="200"
              value={priceMax} 
              onChange={e => setPriceMax(e.target.value)}
              className="w-full accent-[#1B5E20] bg-gray-100" 
            />
          </div>

          {/* Reset Filters */}
          <button 
            onClick={() => { setSearch(''); setCategory(''); setPriceMax('6000'); }}
            className="w-full text-xs text-gray-500 hover:text-[#1B5E20] font-semibold py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </button>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {tours.map((tour, idx) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link 
                    href={`/tours/${tour.slug}`} 
                    className="bg-white rounded-3xl overflow-hidden shadow-premium shadow-premium-hover border border-gray-100 block group h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-60 relative w-full overflow-hidden bg-gray-100">
                        <img 
                          src={tour.primary_image} 
                          alt={tour.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 left-4 bg-[#FBC02D] text-xs font-bold px-3 py-1 rounded-full text-[#263238] shadow flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" /> {tour.average_rating} ({tour.reviews_count})
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-2 text-white text-[11px] font-semibold">
                          {tour.city_name}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#1B5E20] mb-2">
                          <span>{tour.category}</span>
                          <span className="text-gray-400 font-normal">{tour.duration_days} Dias</span>
                        </div>
                        <h3 className="font-bold text-lg text-[#263238] group-hover:text-[#1B5E20] transition-colors mb-3 leading-snug">
                          {tour.name}
                        </h3>
                        <p className="text-xs text-[#546E7A] line-clamp-2 font-light leading-relaxed mb-4">
                          {tour.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-gray-50 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-400 block">A partir de</span>
                        <span className="font-bold text-xl text-[#1B5E20]">${tour.base_price} <span className="text-xs font-normal text-gray-500">USD</span></span>
                      </div>
                      <span className="bg-gray-50 group-hover:bg-[#1B5E20] group-hover:text-white transition-all text-[#1B5E20] text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1">
                        Ver Roteiro <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 shadow-premium text-center border border-gray-100">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-[#263238] text-lg mb-2">Nenhum pacote encontrado</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                Nenhum roteiro correspondeu aos filtros selecionados. Tente ajustar o valor ou buscar outros termos.
              </p>
              <button 
                onClick={() => { setSearch(''); setCategory(''); setPriceMax('6000'); }}
                className="bg-[#1B5E20] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TourCatalogPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-500">Carregando catálogo de viagens...</div>}>
      <TourCatalogContent />
    </Suspense>
  );
}
