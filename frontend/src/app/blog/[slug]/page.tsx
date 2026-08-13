"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Clock, Calendar, User, ArrowLeft, Tag, Share2, 
  MessageCircle, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { MOCK_BLOG_POSTS, MOCK_TOURS } from '@/lib/mockData';

export default function SingleBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const post = MOCK_BLOG_POSTS.find(p => p.slug === resolvedParams.slug) || MOCK_BLOG_POSTS[0];
  const relatedTour = MOCK_TOURS[0];

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* 1. Article Header Banner */}
      <section className="relative h-[55vh] min-h-[400px] bg-[#1A252C] flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 opacity-45 bg-cover bg-center"
          style={{ backgroundImage: `url('${post.cover_image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12 w-full text-white">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1.5 text-xs text-[#FBC02D] hover:underline font-bold mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Blog
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#1B5E20] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              {post.category}
            </span>
            <span className="text-gray-300 text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.read_time}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 font-display leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover border border-white/40" />
            <div>
              <span className="text-xs font-bold text-white block">{post.author.name}</span>
              <span className="text-[10px] text-gray-300">{post.author.role} &bull; {post.published_at}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Article Body & Sidebar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Article (Col-2) */}
        <article className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-12 shadow-premium border border-gray-100">
          <div className="prose prose-sm sm:prose-base max-w-none text-[#263238] space-y-6 leading-relaxed">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={idx} className="text-2xl sm:text-3xl font-bold text-[#263238] pt-4">{paragraph.replace('# ', '')}</h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[#1B5E20] pt-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="space-y-2 list-disc pl-5 text-sm text-[#546E7A]">
                    {paragraph.split('\n').map((li, i) => (
                      <li key={i}>{li.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-sm sm:text-base text-[#546E7A] font-light leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="border-t border-gray-100 mt-10 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              {post.tags.map((t, i) => (
                <span key={i} className="text-xs bg-gray-50 text-[#546E7A] px-3 py-1 rounded-full border border-gray-100">
                  #{t}
                </span>
              ))}
            </div>

            <button 
              onClick={() => alert("Link do artigo copiado com sucesso!")} 
              className="text-xs font-bold text-[#1B5E20] hover:text-[#2E7D32] flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" /> Compartilhar Artigo
            </button>
          </div>
        </article>

        {/* Sidebar Related Tour & Consultation (Col-1) */}
        <div className="space-y-8">
          {/* Related Tour Package Card */}
          <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B5E20] block mb-2">
              ★ Pacote Recomendado para Este Roteiro
            </span>
            <div className="h-44 rounded-2xl overflow-hidden mb-4">
              <img src={relatedTour.primary_image} alt={relatedTour.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-base text-[#263238] mb-2">{relatedTour.name}</h4>
            <p className="text-xs text-[#546E7A] line-clamp-2 mb-4 font-light">{relatedTour.description}</p>
            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
              <div>
                <span className="text-[10px] text-gray-400 block">A partir de</span>
                <span className="font-bold text-base text-[#1B5E20]">${relatedTour.base_price} USD</span>
              </div>
              <Link 
                href={`/tours/${relatedTour.slug}`} 
                className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Ver Pacote
              </Link>
            </div>
          </div>

          {/* Quick Consultation CTA */}
          <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-3xl p-6 text-white text-center space-y-4">
            <Sparkles className="w-8 h-8 text-[#FBC02D] mx-auto" />
            <h4 className="font-bold text-lg">Gostou deste artigo?</h4>
            <p className="text-xs text-gray-100 font-light leading-relaxed">
              Solicite um roteiro sob medida com guias fluentes em português e embarque na viagem da sua vida.
            </p>
            <Link 
              href="/contact#orcamento" 
              className="bg-[#FBC02D] hover:bg-yellow-400 text-[#263238] font-bold text-xs py-3 rounded-xl block transition-all shadow"
            >
              Pedir Orçamento Grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
