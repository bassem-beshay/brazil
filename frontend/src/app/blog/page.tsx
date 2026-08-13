"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Calendar, User, ArrowRight, Tag, Search } from 'lucide-react';
import { MOCK_BLOG_POSTS, BlogPost } from '@/lib/mockData';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Todos os Artigos' },
    { id: 'Cruzeiros & Roteiros', label: 'Cruzeiros & Roteiros' },
    { id: 'História & Cultura', label: 'História & Cultura' },
    { id: 'América do Sul & Luxo', label: 'América do Sul & Luxo' }
  ];

  const filteredPosts = MOCK_BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = MOCK_BLOG_POSTS[0];

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* 1. Hero Header */}
      <section className="relative h-72 bg-[#1A252C] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-35 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544885935-98dd03b09034?q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/40 to-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="text-[#FBC02D] font-bold text-xs uppercase tracking-widest block mb-2">
            Blog & Guia do Viajante
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Dicas, Guias & Histórias de Viagem
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Informações culturais, segredos dos templos, planejamento de cruzeiros e curiosidades do Egito e América do Sul.
          </p>
        </div>
      </section>

      {/* 2. Featured Article Banner */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl overflow-hidden shadow-premium border border-gray-100 grid grid-cols-1 lg:grid-cols-2">
          <div className="h-72 lg:h-auto relative overflow-hidden">
            <img 
              src={featuredPost.cover_image} 
              alt={featuredPost.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-4 left-4 bg-[#1B5E20] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Artigo em Destaque
            </div>
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="text-[#1B5E20] font-bold uppercase">{featuredPost.category}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.read_time}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#263238] mb-4 hover:text-[#1B5E20] transition-colors leading-snug">
                <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>
              <p className="text-sm text-[#546E7A] leading-relaxed mb-6 font-light">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <span className="text-xs font-bold text-[#263238] block">{featuredPost.author.name}</span>
                  <span className="text-[10px] text-gray-400">{featuredPost.published_at}</span>
                </div>
              </div>
              <Link 
                href={`/blog/${featuredPost.slug}`}
                className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
              >
                Ler Artigo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-6 mt-14">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-premium border border-gray-100 mb-10">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1B5E20] text-white shadow'
                    : 'bg-gray-50 text-[#546E7A] hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-full sm:w-64">
            <Search className="w-4 h-4 text-[#1B5E20]" />
            <input 
              type="text"
              placeholder="Buscar no blog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs w-full outline-none text-[#263238]"
            />
          </div>
        </div>

        {/* 4. Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden shadow-premium shadow-premium-hover border border-gray-100 flex flex-col justify-between group"
            >
              <div>
                <div className="h-56 relative w-full overflow-hidden bg-gray-100">
                  <img 
                    src={post.cover_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                    <Clock className="w-3 h-3" /> {post.read_time}
                    <span>&bull;</span>
                    <span>{post.published_at}</span>
                  </div>

                  <h3 className="font-bold text-lg text-[#263238] group-hover:text-[#1B5E20] transition-colors mb-3 line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-[#546E7A] leading-relaxed line-clamp-3 font-light mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-[11px] font-bold text-[#263238]">{post.author.name}</span>
                </div>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="text-xs font-bold text-[#1B5E20] hover:text-[#2E7D32] flex items-center gap-1"
                >
                  Ler Mais <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
