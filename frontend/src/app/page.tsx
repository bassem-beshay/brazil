"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Search, Calendar, Users, Shield, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIChatBot } from '@/components/AIChatBot';

interface TourPackage {
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

export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<TourPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Form states
  const [aiBudget, setAiBudget] = useState('2000');
  const [aiStyle, setAiStyle] = useState('nature');
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    // Fetch featured tours from catalog on mount
    api.get('/tours/?featured=true')
      .then(res => {
        setFeaturedTours(res.data.results || res.data || []);
      })
      .catch(() => {});
  }, []);

  const handleAIPlanning = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await api.post('/ai/recommend/', {
        interests: [aiStyle],
        max_budget: aiBudget
      });
      setAiRecommendation(res.data);
    } catch {
      setAiRecommendation(null);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="w-full relative bg-[#F8F9FA] pb-24">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center bg-[#263238] overflow-hidden">
        {/* Placeholder Ambient Image */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#263238] via-transparent to-black/20" />

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#FBC02D] font-bold text-xs uppercase tracking-widest mb-4 inline-block"
          >
            ★ Bespoke South American Escapes
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-8 font-sans"
          >
            Brazil in Absolute <br />
            <span className="text-[#FBC02D]">Luxury</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#ECEFF1] text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            Immerse yourself in curated expeditions. Discover hidden rainforest lodges, helicopter over Rio, and sail private catamarans across secret bays.
          </motion.p>

          {/* Floating Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-effect rounded-2xl max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-4 items-center shadow-xl border border-white/40"
          >
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 flex-1 border border-gray-100 w-full">
              <Search className="w-5 h-5 text-[#1B5E20]" />
              <input 
                type="text" 
                placeholder="Where to? (e.g. Rio, Amazon...)" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none text-[#263238]" 
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <Link 
                href={`/tours?search=${searchQuery}`}
                className="bg-[#1B5E20] hover:bg-[#2E7D32] transition-colors text-white font-semibold text-sm px-8 py-3 rounded-xl flex items-center justify-center gap-2 w-full"
              >
                Search Experiences
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Brand Trust Indicators */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 -mt-16 relative z-20">
        {[
          { icon: Shield, title: "Uncompromising Safety", desc: "Private security logistics, English-speaking specialist guides, and 24/7 concierge support." },
          { icon: Sparkles, title: "Elite Curated Stays", desc: "Only five-star resorts and private ecolodges vetted personally by our travel team." },
          { icon: Calendar, title: "Flexible Bookings", desc: "Change dates or cancel reservations with direct refunds managed automatically." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100 flex gap-5">
            <div className="w-12 h-12 bg-[#1B5E20]/10 rounded-xl flex items-center justify-center text-[#1B5E20] shrink-0">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-2 text-[#263238]">{item.title}</h3>
              <p className="text-xs text-[#546E7A] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Featured Journeys */}
      <section className="max-w-7xl mx-auto px-6 mt-28">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#1B5E20] text-xs font-semibold uppercase tracking-wider block mb-2">Exclusive Highlights</span>
            <h2 className="text-3xl font-bold tracking-tight text-[#263238]">Curated Tour Packages</h2>
          </div>
          <Link href="/tours" className="text-sm font-semibold text-[#1B5E20] hover:text-[#2E7D32] transition-colors">
            View All Escapes &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTours.length > 0 ? (
            featuredTours.slice(0, 3).map((tour) => (
              <Link 
                href={`/tours/${tour.slug}`} 
                key={tour.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-premium shadow-premium-hover border border-gray-100 block group"
              >
                <div className="h-60 relative w-full overflow-hidden bg-gray-100">
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
                  <h3 className="font-bold text-lg text-[#263238] group-hover:text-[#1B5E20] transition-colors mb-3 line-clamp-1">{tour.name}</h3>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500">Starting Price</span>
                    <span className="font-bold text-[#263238]">${tour.base_price} <span className="text-[10px] font-normal text-gray-500">pp</span></span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Fallback mock cards if server yields no items on fresh startup
            [
              { name: "Private Rio Helicopter & Beach Escape", price: "2,490", img: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=600", days: 5 },
              { name: "Luxury Amazon Jungle Lodge Expedition", price: "3,800", img: "https://images.unsplash.com/photo-1518638150341-f706e86654de?q=80&w=600", days: 7 },
              { name: "Iguazu Falls Private Tour & Yacht Sailing", price: "1,950", img: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=600", days: 4 }
            ].map((mock, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-premium border border-gray-100 block">
                <div className="h-60 relative w-full overflow-hidden bg-gray-100">
                  <img src={mock.img} alt={mock.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase font-bold text-[#1B5E20] block mb-2">Luxury &bull; {mock.days} Days</span>
                  <h3 className="font-bold text-lg text-[#263238] mb-3 line-clamp-1">{mock.name}</h3>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500">Starting Price</span>
                    <span className="font-bold text-[#263238]">${mock.price} <span className="text-[10px] font-normal text-gray-500">pp</span></span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. AI Interactive Planner View */}
      <section className="max-w-7xl mx-auto px-6 mt-28 bg-[#1B5E20]/5 rounded-3xl p-12 border border-[#1B5E20]/10 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#FBC02D]" />
            Smart AI Concierge
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#263238] mb-6">Build a Custom Trip Itinerary Instantly</h2>
          <p className="text-sm text-[#546E7A] leading-relaxed mb-8">
            Tell our AI Travel Assitant your budget and preferred travel style (beach escape, historical tour, rainforest trekking) and get a handpicked vacation package custom-built for your needs.
          </p>

          <form onSubmit={handleAIPlanning} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#263238] mb-1.5 block">Budget Threshold ($)</label>
              <input 
                type="number" 
                value={aiBudget} 
                onChange={e => setAiBudget(e.target.value)} 
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full outline-none focus:border-[#1B5E20]" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#263238] mb-1.5 block">Expedition Style</label>
              <select 
                value={aiStyle} 
                onChange={e => setAiStyle(e.target.value)} 
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full outline-none focus:border-[#1B5E20]"
              >
                <option value="nature">Amazon / Nature Exploration</option>
                <option value="luxury">Rio Beach & Helicopter Luxury</option>
                <option value="cultural">Salvador / Historical Cultural</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold text-sm py-3 rounded-xl col-span-1 md:col-span-2 mt-2 transition-colors cursor-pointer"
            >
              {aiLoading ? "Consulting AI Concierge..." : "Generate AI Recommendation"}
            </button>
          </form>
        </div>

        {/* AI Output Window */}
        <div className="w-full md:w-96 min-h-[300px] bg-white rounded-2xl p-6 shadow-premium border border-gray-100 flex flex-col justify-between">
          {aiRecommendation ? (
            <div className="h-full flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#1B5E20] uppercase tracking-wider mb-2">Your AI Recommended Trip</h4>
                <p className="text-[10px] text-[#90A4AE] mb-4">{aiRecommendation.itinerary_summary.travel_style}</p>
                
                <div className="space-y-4">
                  {aiRecommendation.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="flex gap-3 border-b border-gray-50 pb-3 last:border-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <img src={rec.primary_image || 'https://images.unsplash.com/photo-1518638150341-f706e86654de?q=80&w=100'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-[#263238] line-clamp-1">{rec.name}</h5>
                        <p className="text-[10px] text-gray-500">{rec.duration_days} days &bull; starting ${rec.base_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="font-semibold text-gray-600">Total Duration:</span>
                  <span className="font-bold text-[#1B5E20]">{aiRecommendation.itinerary_summary.total_duration_days} Days</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-4">
                  <span className="font-semibold text-gray-600">Estimate Price:</span>
                  <span className="font-bold text-[#1B5E20] text-sm">${aiRecommendation.itinerary_summary.total_estimated_price}</span>
                </div>
                <Link 
                  href="/tours" 
                  className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-center text-xs font-semibold py-2.5 rounded-xl block transition-colors"
                >
                  Book Recommended Tours
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full my-auto">
              <Sparkles className="w-12 h-12 text-[#FBC02D] mb-4 animate-bounce" />
              <h4 className="font-semibold text-sm text-[#263238] mb-2">No active matches loaded</h4>
              <p className="text-xs text-[#90A4AE] leading-relaxed">
                Configure your budget and travel styles and click generate to consult Girasol AI.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Floating Chat Concierge */}
      <AIChatBot />
    </div>
  );
}
