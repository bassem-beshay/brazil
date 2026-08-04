"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Calendar, Compass, ShieldCheck, HelpCircle, Heart, Star, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface Package {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  price_per_person: string;
  available_spots: number;
  status: string;
}

interface Tour {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration_days: number;
  difficulty: string;
  max_group_size: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  base_price: string;
  packages: Package[];
  average_rating: number;
  reviews: any[];
}

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/tours/${resolvedParams.slug}/`)
      .then(res => {
        setTour(res.data);
      })
      .catch(() => {
        setTour(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [resolvedParams.slug]);

  const handleWishlist = async () => {
    if (!tour) return;
    try {
      await api.post(`/tours/${tour.slug}/wishlist-toggle/`);
      setWishlisted(!wishlisted);
    } catch {
      alert("Please login to save items to your wishlist.");
    }
  };

  const selectPackage = (pkg: Package) => {
    if (!tour) return;
    
    // Save selected checkout package details in localStorage
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 animate-pulse space-y-8">
        <div className="h-96 bg-gray-200 rounded-3xl w-full" />
        <div className="h-10 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-full" />
        <div className="h-6 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Expedition Not Found</h2>
        <p className="text-gray-500 mb-8">The luxury package you requested does not exist or has been removed.</p>
        <button onClick={() => router.push('/tours')} className="bg-[#1B5E20] text-white px-6 py-2.5 rounded-xl">
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 1. Header Luxury Cover */}
      <div className="relative h-96 w-full rounded-3xl overflow-hidden bg-[#263238] mb-12 shadow-premium">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <span className="text-[#FBC02D] font-bold text-xs uppercase tracking-widest block mb-2">{tour.difficulty} Level</span>
            <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-2">{tour.name}</h1>
            <p className="text-gray-200 text-sm font-light">{tour.duration_days} Days &bull; Group size: {tour.max_group_size} travelers max</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleWishlist}
              className={`p-3.5 rounded-full glass-effect shadow-md flex items-center justify-center cursor-pointer ${wishlisted ? 'text-[#EC407A]' : 'text-white'}`}
            >
              <Heart className="w-5.5 h-5.5" fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Details (Col-2) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100">
            <h2 className="text-xl font-bold text-[#263238] mb-4">Expedition Overview</h2>
            <p className="text-sm text-[#546E7A] leading-relaxed font-light">{tour.description}</p>
          </section>

          {/* Itinerary Timeline */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <section className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100">
              <h2 className="text-xl font-bold text-[#263238] mb-8">Itinerary</h2>
              <div className="relative border-l-2 border-[#1B5E20]/20 ml-4 pl-8 space-y-8">
                {tour.itinerary.map((day: ItineraryDay, idx: number) => (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <div className="absolute -left-12 top-0.5 w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-bold text-xs">
                      {day.day}
                    </div>
                    <h3 className="font-bold text-base text-[#263238] mb-2">{day.title}</h3>
                    <p className="text-xs text-[#546E7A] leading-relaxed font-light">{day.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inclusions / Exclusions */}
          <section className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-sm text-[#263238] mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-[#1B5E20]" /> What's Included
              </h3>
              <ul className="space-y-3">
                {tour.inclusions && tour.inclusions.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#546E7A] flex gap-2 items-center">
                    <Check className="w-4 h-4 text-[#1B5E20] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#263238] mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-[#EC407A]" /> What's Excluded
              </h3>
              <ul className="space-y-3">
                {tour.exclusions && tour.exclusions.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#546E7A] flex gap-2 items-center">
                    <X className="w-4 h-4 text-[#EC407A] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar Booking & Dates Selector (Col-1) */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100 sticky top-24">
            <span className="text-xs text-gray-500 block mb-1">Starting Price</span>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-[#263238]">${tour.base_price}</span>
              <span className="text-xs text-gray-500">pp / USD</span>
            </div>

            <h3 className="font-bold text-sm text-[#263238] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1B5E20]" /> Departure Dates
            </h3>

            {/* Packages departures options */}
            <div className="space-y-3">
              {tour.packages && tour.packages.length > 0 ? (
                tour.packages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-[#263238]">{pkg.title}</span>
                      <span className="text-xs font-bold text-[#1B5E20]">${pkg.price_per_person}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-3">{pkg.start_date} to {pkg.end_date}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">{pkg.available_spots} spots remaining</span>
                      <button 
                        onClick={() => selectPackage(pkg)}
                        className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Book Date
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-xs text-gray-400">No scheduled departures found. Contact concierge to customize.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
