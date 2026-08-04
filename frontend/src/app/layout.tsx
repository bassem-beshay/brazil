import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Compass, ShoppingBag, Heart, User as UserIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Girasol | Luxury South American Travel & Tours',
  description: 'Experience Brazil and South America in absolute luxury. Bespoke rainforest expeditions, beach retreats, and custom travel packages.',
  openGraph: {
    title: 'Girasol | Luxury Tours & Experiences',
    description: 'Bespoke South American travel itineraries curated by local experts.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        <AuthProvider>
          {/* Header Sticky Navigation */}
          <header className="fixed top-0 left-0 right-0 z-50 glass-effect shadow-premium">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <Compass className="w-8 h-8 text-[#1B5E20] group-hover:rotate-45 transition-transform duration-300" />
                <span className="font-semibold text-2xl tracking-tight text-[#263238]">
                  GIRASOL<span className="text-[#1B5E20]">.</span>
                </span>
              </Link>

              {/* Navigation Links with Mega Menu Hook */}
              <nav className="hidden md:flex gap-8 text-sm font-medium text-[#263238]">
                <Link href="/tours" className="hover:text-[#1B5E20] transition-colors py-2">
                  Destinations
                </Link>
                <Link href="/tours" className="hover:text-[#1B5E20] transition-colors py-2">
                  Luxury Packages
                </Link>
                <Link href="/tours?featured=true" className="hover:text-[#1B5E20] transition-colors py-2">
                  Curated Journeys
                </Link>
                <Link href="/about" className="hover:text-[#1B5E20] transition-colors py-2">
                  Our Story
                </Link>
              </nav>

              {/* Quick Actions / User Settings */}
              <div className="flex items-center gap-5">
                <Link href="/dashboard" className="text-[#546E7A] hover:text-[#1B5E20] transition-colors relative">
                  <Heart className="w-5.5 h-5.5" />
                </Link>
                <Link href="/booking/checkout" className="text-[#546E7A] hover:text-[#1B5E20] transition-colors">
                  <ShoppingBag className="w-5.5 h-5.5" />
                </Link>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 hover:border-[#1B5E20] transition-all bg-white"
                >
                  <UserIcon className="w-4 h-4 text-[#1B5E20]" />
                  <span className="text-xs font-semibold text-[#263238]">Profile</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content Layout */}
          <main className="pt-20 min-h-screen">
            {children}
          </main>

          {/* Elegant Luxury Footer */}
          <footer className="bg-[#263238] text-white pt-20 pb-10 mt-20 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <h3 className="font-bold text-lg mb-6 tracking-wide text-white">GIRASOL.</h3>
                <p className="text-sm text-[#CFD8DC] leading-relaxed mb-6">
                  Crafting elite, bespoke South American journeys that blend adventure, cultural richness, and modern luxury.
                </p>
                <div className="flex gap-4">
                  <span className="text-xs px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800 text-[#FBC02D] font-semibold">
                    ★ Premium Operator
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-6 text-white uppercase tracking-wider">Destinations</h4>
                <ul className="space-y-3.5 text-sm text-[#CFD8DC]">
                  <li><Link href="/tours" className="hover:text-[#FBC02D] transition-colors">Rio de Janeiro</Link></li>
                  <li><Link href="/tours" className="hover:text-[#FBC02D] transition-colors">Amazon Rainforest</Link></li>
                  <li><Link href="/tours" className="hover:text-[#FBC02D] transition-colors">Iguazu Falls</Link></li>
                  <li><Link href="/tours" className="hover:text-[#FBC02D] transition-colors">Salvador de Bahia</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-6 text-white uppercase tracking-wider">Resources</h4>
                <ul className="space-y-3.5 text-sm text-[#CFD8DC]">
                  <li><Link href="/faq" className="hover:text-[#FBC02D] transition-colors">Travel Guides</Link></li>
                  <li><Link href="/faq" className="hover:text-[#FBC02D] transition-colors">FAQ & Visas</Link></li>
                  <li><Link href="/faq" className="hover:text-[#FBC02D] transition-colors">Booking Policy</Link></li>
                  <li><Link href="/contact" className="hover:text-[#FBC02D] transition-colors">Contact Concierge</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-6 text-white uppercase tracking-wider">Concierge Newsletter</h4>
                <p className="text-xs text-[#CFD8DC] mb-4">
                  Receive curated travel itineraries, secret escape locations, and seasonal specials.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email..." 
                    className="bg-gray-800 border border-gray-700 text-xs px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#FBC02D] w-full text-white" 
                  />
                  <button className="bg-[#1B5E20] hover:bg-[#2E7D32] transition-colors text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
                    Join
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#90A4AE]">
              <p>&copy; {new Date().getFullYear()} Girasol Luxury Tours Ltd. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
