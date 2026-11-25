import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Search } from 'lucide-react';

import { getBlogOverview, getBlogPage } from '@/lib/blogApi';
import { publicSiteUrl } from '@/lib/seo';

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: 'Blog de Viagens | Girassol Brasil Viagens',
  description: 'Inspiração, cultura, destinos e dicas para planejar viagens pelo Brasil e pelo mundo.',
  alternates: { canonical: `${publicSiteUrl}/blog` },
  openGraph: {
    title: 'Blog de Viagens | Girassol Brasil Viagens',
    description: 'Inspiração, cultura, destinos e dicas para planejar sua próxima viagem.',
    type: 'website',
    url: `${publicSiteUrl}/blog`,
  },
};

type BlogPageProps = {
  searchParams: Promise<{ page?: string; search?: string; tag?: string }>;
};

function blogHref({ page, search, tag }: { page?: number; search?: string; tag?: string }) {
  const query = new URLSearchParams();
  if (page && page > 1) query.set('page', String(page));
  if (search) query.set('search', search);
  if (tag) query.set('tag', tag);
  const suffix = query.toString();
  return suffix ? `/blog?${suffix}` : '/blog';
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page || '1', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const search = (params.search || '').trim();
  const tag = (params.tag || '').trim();

  const overview = await getBlogOverview();
  const featuredPost = overview.featured;
  const archive = await getBlogPage({
    page,
    search,
    tag,
    excludeSlug: featuredPost?.slug,
  });
  const totalPages = Math.max(1, Math.ceil(archive.count / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  if (!featuredPost) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-[#082F5B]">
        <Image
          src={featuredPost.cover_image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061D36] via-[#082F5B]/70 to-black/60" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#F59E0B]">Blog Girassol</span>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Inspiração para Viajar pelo Mundo</h1>
          <p className="mx-auto max-w-2xl text-xs font-light text-gray-200 sm:text-sm">Histórias, culturas, destinos e dicas para planejar sua próxima viagem.</p>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-10 max-w-7xl px-6">
        <article className="grid grid-cols-1 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-premium lg:grid-cols-2">
          <div className="relative h-72 overflow-hidden lg:h-auto">
            <Image
              src={featuredPost.cover_image}
              alt={featuredPost.cover_image_alt || featuredPost.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute left-4 top-4 rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-bold text-[#082F5B] shadow">Artigo em Destaque</div>
          </div>
          <div className="flex flex-col justify-between p-8 sm:p-12">
            <div>
              <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
                <span className="font-bold uppercase text-[#0B4EA2]">{featuredPost.category}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featuredPost.read_time}</span>
              </div>
              <h2 className="mb-4 text-2xl font-bold leading-snug text-[#263238] transition-colors hover:text-[#0B4EA2] sm:text-3xl"><Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
              <p className="mb-6 line-clamp-4 text-sm font-light leading-relaxed text-[#546E7A]">{featuredPost.excerpt}</p>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
              <div>
                <span className="block text-xs font-bold text-[#263238]">{featuredPost.author.name}</span>
                <span className="text-[10px] text-gray-400">{featuredPost.published_at}</span>
              </div>
              <Link href={`/blog/${featuredPost.slug}`} className="flex items-center gap-1.5 rounded-xl bg-[#0B4EA2] px-5 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#073B7A]">Ler Artigo <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </article>
      </div>

      <section className="mx-auto mt-14 max-w-7xl px-6">
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-premium">
          <div className="flex flex-wrap gap-2">
            <Link href={blogHref({ search })} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${!tag ? 'bg-[#0B4EA2] text-white shadow' : 'bg-gray-50 text-[#546E7A] hover:bg-gray-100'}`}>Todos os Artigos</Link>
            {overview.popular_tags.map((popularTag) => (
              <Link key={popularTag} href={blogHref({ search, tag: popularTag })} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${tag === popularTag ? 'bg-[#0B4EA2] text-white shadow' : 'bg-gray-50 text-[#546E7A] hover:bg-gray-100'}`}>{popularTag}</Link>
            ))}
          </div>
          <form action="/blog" method="get" className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-[#0B4EA2]" />
            <input type="search" name="search" defaultValue={search} placeholder="Buscar entre todos os artigos..." className="w-full bg-transparent text-xs text-[#263238] outline-none" />
            {tag && <input type="hidden" name="tag" value={tag} />}
            <button type="submit" className="rounded-lg bg-[#0B4EA2] px-4 py-2 text-xs font-bold text-white hover:bg-[#073B7A]">Buscar</button>
          </form>
        </div>

        <p className="mb-8 text-xs text-gray-500">{archive.count} artigos encontrados &bull; Página {currentPage} de {totalPages}</p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {archive.results.map((post) => (
            <article key={post.id} className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-premium shadow-premium-hover">
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <Image src={post.cover_image} alt={post.cover_image_alt || post.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute left-4 top-4 rounded-full bg-[#0B4EA2]/90 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">{post.tags[0] || post.category}</div>
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-gray-400"><Clock className="h-3 w-3" /> {post.read_time}<span>&bull;</span><span>{post.published_at}</span></div>
                  <h2 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-[#263238] transition-colors group-hover:text-[#0B4EA2]"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p className="mb-4 line-clamp-3 text-xs font-light leading-relaxed text-[#546E7A]">{post.excerpt}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 px-6 pb-6 pt-4">
                <span className="text-[11px] font-bold text-[#263238]">{post.author.name}</span>
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-xs font-bold text-[#0B4EA2] hover:text-[#F59E0B]">Ler Mais <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            </article>
          ))}
        </div>

        {archive.results.length === 0 && <div className="rounded-3xl bg-white p-12 text-center text-sm text-gray-500">Nenhum artigo encontrado para os filtros selecionados.</div>}

        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Paginação do blog">
            {currentPage > 1 ? (
              <Link href={blogHref({ page: currentPage - 1, search, tag })} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0B4EA2]"><ArrowLeft className="h-4 w-4" /> Anterior</Link>
            ) : <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0B4EA2] opacity-40"><ArrowLeft className="h-4 w-4" /> Anterior</span>}
            <span className="px-3 text-xs font-semibold text-[#546E7A]">{currentPage} / {totalPages}</span>
            {currentPage < totalPages ? (
              <Link href={blogHref({ page: currentPage + 1, search, tag })} className="inline-flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-4 py-2.5 text-xs font-bold text-white">Próxima <ArrowRight className="h-4 w-4" /></Link>
            ) : <span className="inline-flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-4 py-2.5 text-xs font-bold text-white opacity-40">Próxima <ArrowRight className="h-4 w-4" /></span>}
          </nav>
        )}
      </section>
    </div>
  );
}
