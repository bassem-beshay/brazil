"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Search, SlidersHorizontal, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tour {
  id: string;
  name: string;
  slug: string;
  city_name: string;
  duration_days: number;
  difficulty: string;
  base_price: string;
  primary_image?: string;
  average_rating: number;
}

function TourCatalogContent() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [priceMax, setPriceMax] = useState('5000');

  const fetchTours = async () => {
    setLoading(true);
    try {
      let url = `/tours/?search=${search}&base_price__lte=${priceMax}`;
      if (difficulty) {
        url += `&difficulty=${difficulty}`;
      }
      const res = await api.get(url);
      setTours(res.data.results || res.data || []);
    } catch {
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [difficulty, priceMax]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Title */}
      <div className="mb-12">
        <span className="text-[#1B5E20] text-xs font-semibold uppercase tracking-wider block mb-2">Expeditions catalog</span>
        <h1 className="text-4xl font-bold tracking-tight text-[#263238]">Discover South American Escapes</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl p-6 shadow-premium border border-gray-100 h-fit space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-[#1B5E20]" />
            <h3 className="font-bold text-sm text-[#263238]">Refine Search</h3>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="text-xs font-semibold text-[#263238] mb-2 block">Keywords</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchTours()}
                className="w-full text-xs bg-transparent outline-none" 
              />
              <button onClick={fetchTours} className="text-[#1B5E20]">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Difficulty Dropdown */}
          <div>
            <label className="text-xs font-semibold text-[#263238] mb-2 block">Adventure level</label>
            <select 
              value={difficulty} 
              onChange={e => setDifficulty(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
            >
              <option value="">All Difficulty Levels</option>
              <option value="easy">Easy (Comfort Journeys)</option>
              <option value="medium">Medium (Moderate Expeditions)</option>
              <option value="hard">Hard (Extreme Adventures)</option>
            </select>
          </div>

          {/* Price Threshold */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#263238] mb-2">
              <span>Max Budget</span>
              <span className="text-[#1B5E20]">${priceMax}</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="250"
              value={priceMax} 
              onChange={e => setPriceMax(e.target.value)}
              className="w-full accent-[#1B5E20] bg-gray-100" 
            />
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          {loading ? (
            // Skeleton Placeholders
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-premium border border-gray-100 h-[380px] animate-pulse p-4 flex flex-col justify-between">
                  <div className="h-48 bg-gray-200 rounded-xl w-full" />
                  <div className="space-y-3 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded-xl mt-6 w-full" />
                </div>
              ))}
            </div>
          ) : tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tours.map((tour, idx) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link 
                    href={`/tours/${tour.slug}`} 
                    className="bg-white rounded-2xl overflow-hidden shadow-premium shadow-premium-hover border border-gray-100 block group"
                  >
                    <div className="h-52 relative w-full overflow-hidden bg-gray-100">
                      <img 
                        src={tour.primary_image || 'https://images.unsplash.com/photo-1518638150341-f706e86654de?q=80&w=600'} 
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 left-4 bg-[#FBC02D] text-xs font-bold px-3 py-1 rounded-full text-black">
                        ★ {tour.average_rating}
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] uppercase font-bold text-[#1B5E20] block mb-2">{tour.difficulty} &bull; {tour.duration_days} Days</span>
                      <h3 className="font-bold text-base text-[#263238] group-hover:text-[#1B5E20] transition-colors mb-3 line-clamp-2 h-12 leading-relaxed">{tour.name}</h3>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                        <span className="text-xs text-gray-500">Starting Price</span>
                        <span className="font-bold text-[#263238]">${tour.base_price} <span className="text-[10px] font-normal text-gray-500">pp</span></span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-premium text-center border border-gray-100">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-[#263238] text-lg mb-2">No expeditions found</h3>
              <p className="text-xs text-[#90A4AE] leading-relaxed max-w-sm mx-auto">
                No active packages matched your current filtering criteria. Try resetting keywords or difficulty limits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TourCatalogPage() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <TourCatalogContent />
    </Suspense>
  );
}
