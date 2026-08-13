"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Heart, Bell, User as UserIcon, Loader2, Sparkles, FileText, Compass } from 'lucide-react';
import { MOCK_TOURS } from '@/lib/mockData';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([
    {
      id: 'b-1',
      booking_reference: 'GIR-849201',
      status: 'confirmada',
      grand_total: '2.900',
      created_at: new Date().toISOString(),
      tour_name: 'Egito Clássico: Cairo & Cruzeiro no Nilo 5 Estrelas'
    }
  ]);
  const [wishlist, setWishlist] = useState<any[]>([
    {
      id: 'w-1',
      tour_detail: {
        name: MOCK_TOURS[1].name,
        slug: MOCK_TOURS[1].slug,
        base_price: MOCK_TOURS[1].base_price
      }
    }
  ]);
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'n-1',
      title: 'Bem-vindo à Girasol Viagens!',
      message: 'Seu cadastro foi realizado com sucesso. Explore nossos cruzeiros no Nilo e solicite orçamentos exclusivos.',
      read: false
    }
  ]);
  const [loadingData, setLoadingData] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Welcome Banner */}
      <div className="bg-[#1A252C] rounded-3xl p-8 sm:p-10 text-white mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-premium relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=800')] bg-cover" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#FBC02D] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Portal do Viajante
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {user?.first_name || 'Viajante'}!
          </h1>
          <p className="text-xs text-gray-300 font-light mt-1">Gerencie suas reservas, itinerários salvos e orçamentos personalizados.</p>
        </div>

        <button 
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="bg-white/10 hover:bg-white/20 transition-all text-white font-semibold text-xs px-6 py-2.5 rounded-xl border border-white/20 cursor-pointer relative z-10"
        >
          Sair da Conta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Bookings List (Col-2) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100">
            <h2 className="text-lg font-bold text-[#263238] mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1B5E20]" /> Minhas Reservas & Viagens
            </h2>

            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map(b => (
                  <div key={b.id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="font-bold text-sm text-[#263238] uppercase">Ref: {b.booking_reference}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-[#1B5E20]/10 text-[#1B5E20]">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#263238] font-medium">{b.tour_name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Reservado em: {new Date(b.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t border-gray-100 md:border-0 pt-3 md:pt-0">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Total</span>
                        <span className="font-bold text-base text-[#1B5E20]">${b.grand_total} USD</span>
                      </div>
                      <Link 
                        href="/contact" 
                        className="bg-white border border-gray-200 hover:border-[#1B5E20] text-xs font-semibold px-4 py-2 rounded-xl text-[#263238] hover:text-[#1B5E20] transition-colors"
                      >
                        Suporte VIP
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-xs text-gray-400">Nenhuma reserva realizada no momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info/Alerts (Col-1) */}
        <div className="space-y-8">
          {/* Notifications Panel */}
          <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm text-[#263238] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1B5E20]" /> Avisos & Notificações
              </h3>
            </div>

            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="p-3.5 rounded-2xl text-xs bg-[#1B5E20]/5 border border-[#1B5E20]/10">
                  <h4 className="font-bold text-[#263238] mb-1">{n.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-light">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Wishlists Panel */}
          <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-100">
            <h3 className="font-bold text-sm text-[#263238] mb-6 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#1B5E20]" /> Roteiros Salvos
            </h3>

            <div className="space-y-3">
              {wishlist.map(w => (
                <Link 
                  href={`/tours/${w.tour_detail.slug}`} 
                  key={w.id} 
                  className="border border-gray-100 rounded-2xl p-3.5 bg-gray-50/50 hover:bg-gray-50 transition-colors block"
                >
                  <h4 className="font-bold text-xs text-[#263238] mb-1 line-clamp-1">{w.tour_detail.name}</h4>
                  <span className="text-[11px] text-[#1B5E20] font-bold">${w.tour_detail.base_price} USD</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
