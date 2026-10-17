"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Search } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
  const { MOCK_BLOG_POSTS } = useSiteContent();
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    MOCK_BLOG_POSTS.forEach((post) => post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([tag]) => tag);
  }, [MOCK_BLOG_POSTS]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('pt-BR');
    return MOCK_BLOG_POSTS.filter((post) => {
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      const matchesSearch = !query
        || post.title.toLocaleLowerCase('pt-BR').includes(query)
        || post.excerpt.toLocaleLowerCase('pt-BR').includes(query)
        || post.tags.some((tag) => tag.toLocaleLowerCase('pt-BR').includes(query));
      return matchesTag && matchesSearch;
    });
  }, [MOCK_BLOG_POSTS, searchQuery, selectedTag]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visiblePosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const featuredPost = MOCK_BLOG_POSTS[0];

  const chooseTag = (tag: string) => {
    setSelectedTag(tag);
    setPage(1);
  };

  if (!featuredPost) return null;

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      <section className="relative h-72 bg-[#082F5B] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-35 bg-cover bg-center" style={{ backgroundImage: `url('${featuredPost.cover_image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061D36] via-[#082F5B]/70 to-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="text-[#F59E0B] font-bold text-xs uppercase tracking-widest block mb-2">Blog Girassol</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Inspiração para Viajar pelo Mundo</h1>
          <p className="text-gray-200 text-xs sm:text-sm max-w-2xl mx-auto font-light">Todos os artigos publicados no blog original da Girassol Brasil Viagens e Turismo.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl overflow-hidden shadow-premium border border-gray-100 grid grid-cols-1 lg:grid-cols-2">
          <div className="h-72 lg:h-auto relative overflow-hidden">
            <img src={featuredPost.cover_image} alt={featuredPost.title} loading="eager" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-4 left-4 bg-[#F59E0B] text-[#082F5B] text-xs font-bold px-3 py-1 rounded-full shadow">Artigo em Destaque</div>
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="text-[#0B4EA2] font-bold uppercase">{featuredPost.category}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.read_time}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#263238] mb-4 hover:text-[#0B4EA2] transition-colors leading-snug"><Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
              <p className="text-sm text-[#546E7A] leading-relaxed mb-6 font-light line-clamp-4">{featuredPost.excerpt}</p>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4 gap-4">
              <div>
                <span className="text-xs font-bold text-[#263238] block">{featuredPost.author.name}</span>
                <span className="text-[10px] text-gray-400">{featuredPost.published_at}</span>
              </div>
              <Link href={`/blog/${featuredPost.slug}`} className="bg-[#0B4EA2] hover:bg-[#073B7A] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5">Ler Artigo <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 mt-14">
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-premium border border-gray-100 mb-5">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => chooseTag('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTag === 'all' ? 'bg-[#0B4EA2] text-white shadow' : 'bg-gray-50 text-[#546E7A] hover:bg-gray-100'}`}>Todos os Artigos</button>
            {popularTags.map((tag) => (
              <button key={tag} onClick={() => chooseTag(tag)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTag === tag ? 'bg-[#0B4EA2] text-white shadow' : 'bg-gray-50 text-[#546E7A] hover:bg-gray-100'}`}>{tag}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full">
            <Search className="w-4 h-4 text-[#0B4EA2]" />
            <input type="search" placeholder="Buscar entre todos os artigos..." value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setPage(1); }} className="bg-transparent text-xs w-full outline-none text-[#263238]" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-8">{filteredPosts.length} artigos encontrados &bull; Página {currentPage} de {totalPages}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePosts.map((post) => (
            <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-premium shadow-premium-hover border border-gray-100 flex flex-col justify-between group">
              <div>
                <div className="h-56 relative w-full overflow-hidden bg-gray-100">
                  <img src={post.cover_image} alt={post.title} loading="eager" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-[#0B4EA2]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">{post.tags[0] || post.category}</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2"><Clock className="w-3 h-3" /> {post.read_time}<span>&bull;</span><span>{post.published_at}</span></div>
                  <h2 className="font-bold text-lg text-[#263238] group-hover:text-[#0B4EA2] transition-colors mb-3 line-clamp-2 leading-snug"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p className="text-xs text-[#546E7A] leading-relaxed line-clamp-3 font-light mb-4">{post.excerpt}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[11px] font-bold text-[#263238]">{post.author.name}</span>
                <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-[#0B4EA2] hover:text-[#F59E0B] flex items-center gap-1">Ler Mais <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </article>
          ))}
        </div>

        {visiblePosts.length === 0 && <div className="bg-white rounded-3xl p-12 text-center text-sm text-gray-500">Nenhum artigo encontrado para os filtros selecionados.</div>}

        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Paginação do blog">
            <button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#0B4EA2] disabled:opacity-40"><ArrowLeft className="w-4 h-4" /> Anterior</button>
            <span className="text-xs font-semibold text-[#546E7A] px-3">{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B4EA2] text-white text-xs font-bold disabled:opacity-40">Próxima <ArrowRight className="w-4 h-4" /></button>
          </nav>
        )}
      </section>
    </div>
  );
}
