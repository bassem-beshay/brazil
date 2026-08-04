"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Heart, Bell, User as UserIcon, Loader2, Sparkles, FileText } from 'lucide-react';

interface Booking {
  id: string;
  booking_reference: string;
  status: string;
  grand_total: string;
  created_at: string;
  invoice?: {
    pdf_file_url: string;
  };
}

interface Wishlist {
  id: string;
  tour_detail: {
    name: string;
    slug: string;
    base_price: string;
  };
}

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [bookingsRes, wishlistRes, notificationsRes] = await Promise.all([
        api.get('/bookings/checkout/'),
        api.get('/tours/wishlist/'),
        api.get('/notifications/')
      ]);
      setBookings(bookingsRes.data.results || bookingsRes.data || []);
      setWishlist(wishlistRes.data.results || wishlistRes.data || []);
      setNotifications(notificationsRes.data.results || notificationsRes.data || []);
    } catch {
      // Handle fallback or silent error
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read/');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  if (authLoading || (user && loadingData)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-[#1B5E20] animate-spin" />
        <p className="text-sm text-gray-500">Loading your profile dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Welcome Banner */}
      <div className="bg-[#263238] rounded-3xl p-8 text-white mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-premium relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=800')] bg-cover" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#FBC02D] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Guest Portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {user.first_name || 'Traveler'}!
          </h1>
          <p className="text-xs text-gray-300 font-light mt-1">Manage reservations, explore wishlists, and track customized trips.</p>
        </div>

        <button 
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="bg-white/10 hover:bg-white/20 transition-all text-white font-semibold text-xs px-6 py-2.5 rounded-xl border border-white/20 cursor-pointer relative z-10"
        >
          Sign Out Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Bookings List (Col-2) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100">
            <h2 className="text-lg font-bold text-[#263238] mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1B5E20]" /> My Reservations
            </h2>

            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map(b => (
                  <div key={b.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="font-bold text-sm text-[#263238] uppercase">Ref: {b.booking_reference.slice(0, 8)}...</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          b.status === 'confirmed' ? 'bg-[#1B5E20]/10 text-[#1B5E20]' : 'bg-[#FBC02D]/10 text-[#FBC02D]'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">Reserved on: {new Date(b.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t border-gray-100 md:border-0 pt-3 md:pt-0">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Charged Total</span>
                        <span className="font-bold text-sm text-[#1B5E20]">${b.grand_total}</span>
                      </div>
                      {b.invoice?.pdf_file_url && (
                        <a 
                          href={b.invoice.pdf_file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-white border border-gray-200 hover:border-[#1B5E20] p-2 rounded-xl text-gray-500 hover:text-[#1B5E20] transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-xs text-gray-400">No trip reservations made yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info/Alerts (Col-1) */}
        <div className="space-y-8">
          {/* Notifications Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm text-[#263238] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1B5E20]" /> Notifications
              </h3>
              <button 
                onClick={handleMarkAllRead}
                className="text-[10px] text-[#1B5E20] font-semibold hover:text-[#2E7D32]"
              >
                Mark all read
              </button>
            </div>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} className={`p-3 rounded-xl text-xs border ${n.read ? 'bg-white border-gray-100' : 'bg-[#1B5E20]/5 border-[#1B5E20]/10'}`}>
                    <h4 className="font-bold text-[#263238] mb-1">{n.title}</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{n.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-[10px] text-gray-400">No notifications available.</p>
              )}
            </div>
          </div>

          {/* Wishlists Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-gray-100">
            <h3 className="font-bold text-sm text-[#263238] mb-6 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#1B5E20]" /> Wishlist Tours
            </h3>

            <div className="space-y-3">
              {wishlist.length > 0 ? (
                wishlist.map(w => (
                  <Link 
                    href={`/tours/${w.tour_detail.slug}`} 
                    key={w.id} 
                    className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors block"
                  >
                    <h4 className="font-bold text-xs text-[#263238] mb-1 line-clamp-1">{w.tour_detail.name}</h4>
                    <span className="text-[10px] text-gray-500 font-semibold">${w.tour_detail.base_price} pp</span>
                  </Link>
                ))
              ) : (
                <p className="text-center py-6 text-[10px] text-gray-400">No tours wishlisted yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
