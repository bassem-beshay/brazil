'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Share2,
  Sparkles,
  Tag,
} from 'lucide-react';
import type { BlogGalleryImage, BlogPost, TourPackage } from '@/lib/mockData';

type BlogPostViewProps = {
  post: BlogPost;
  relatedTour?: TourPackage;
};

function normalizeGalleryItem(item: string | BlogGalleryImage, postTitle: string, index: number): BlogGalleryImage {
  if (typeof item === 'string') {
    return {
      url: item,
      alt: `${postTitle} — foto ${index + 1}`,
    };
  }

  return {
    ...item,
    alt: item.alt || item.caption || `${postTitle} — foto ${index + 1}`,
  };
}

function Credit({ credit, sourceUrl, inverse = false }: { credit?: string; sourceUrl?: string; inverse?: boolean }) {
  if (!credit && !sourceUrl) return null;

  const label = credit ? `Foto: ${credit}` : 'Fonte da foto';

  if (!sourceUrl) {
    return <span>{label}</span>;
  }

  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 underline decoration-current/50 underline-offset-2 ${inverse ? 'hover:text-white' : 'hover:text-[#0B4EA2]'}`}
    >
      {label}
      <ExternalLink aria-hidden="true" className="h-3 w-3" />
      <span className="sr-only"> (abre em uma nova aba)</span>
    </a>
  );
}

export default function BlogPostView({ post, relatedTour }: BlogPostViewProps) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'shared' | 'copied' | 'error'>('idle');
  const gallery = useMemo(
    () => (post.gallery || []).map((item, index) => normalizeGalleryItem(item, post.title, index)).filter((item) => item.url),
    [post.gallery, post.title],
  );
  const contentBlocks = useMemo(() => {
    const blocks = post.content.split(/\n\s*\n/).filter(Boolean);
    const first = blocks[0]?.replace(/^#{1,2}\s+/, '').trim().toLocaleLowerCase('pt-BR');
    if (first === post.title.trim().toLocaleLowerCase('pt-BR')) return blocks.slice(1);
    return blocks;
  }, [post.content, post.title]);

  const shareArticle = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt, url });
        setShareStatus('shared');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('textarea');
        input.value = url;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(input);
        if (!copied) throw new Error('Copy command failed');
      }

      setShareStatus('copied');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareStatus('error');
    }
  };

  const shareLabel = shareStatus === 'shared'
    ? 'Artigo compartilhado'
    : shareStatus === 'copied'
      ? 'Link copiado'
      : shareStatus === 'error'
        ? 'Não foi possível compartilhar'
        : 'Compartilhar artigo';

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <section className="relative flex h-[48vh] min-h-[340px] items-end overflow-hidden bg-[#1A252C]">
        <Image
          src={post.cover_image}
          alt={post.cover_image_alt || post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-10 text-white">
          <Link href="/blog" className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] hover:underline">
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> Voltar para o blog
          </Link>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#0B4EA2] px-3 py-0.5 text-[11px] font-bold text-white">{post.category}</span>
            <span className="flex items-center gap-1 text-xs text-gray-300"><Clock aria-hidden="true" className="h-3.5 w-3.5" /> {post.read_time}</span>
          </div>

          <h1 className="mb-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src={post.author.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full border border-white/40 object-cover" />
              <div>
                <span className="block text-xs font-bold text-white">{post.author.name}</span>
                <span className="flex items-center gap-1 text-[10px] text-gray-300">
                  <Calendar aria-hidden="true" className="h-3 w-3" /> {post.published_at}
                </span>
              </div>
            </div>
            <p className="max-w-xs text-right text-[11px] text-gray-200">
              <Credit
                credit={post.image_credit || post.cover_image_credit}
                sourceUrl={post.image_source_url || post.cover_image_source_url}
                inverse
              />
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-gray-100 bg-white p-8 shadow-premium sm:p-12 lg:col-span-2">
          <div className="prose prose-sm max-w-none space-y-6 leading-relaxed text-[#263238] sm:prose-base">
            {contentBlocks.map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h2 key={index} className="pt-4 text-2xl font-bold text-[#263238] sm:text-3xl">{paragraph.replace(/^# /, '')}</h2>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="pt-4 text-xl font-bold text-[#0B4EA2] sm:text-2xl">{paragraph.replace(/^## /, '')}</h2>;
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc space-y-2 pl-5 text-sm text-[#546E7A]">
                    {paragraph.split('\n').map((item, itemIndex) => <li key={itemIndex}>{item.replace(/^- /, '')}</li>)}
                  </ul>
                );
              }
              return <p key={index} className="text-sm font-light leading-relaxed text-[#546E7A] sm:text-base">{paragraph}</p>;
            })}
          </div>

          {gallery.length > 0 && (
            <section className="mt-12 border-t border-gray-100 pt-10" aria-labelledby="article-gallery-title">
              <h2 id="article-gallery-title" className="mb-6 text-2xl font-bold text-[#263238]">Galeria de fotos</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {gallery.map((image, index) => (
                  <figure key={`${image.url}-${index}`} className={gallery.length % 2 === 1 && index === 0 ? 'sm:col-span-2' : undefined}>
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                      <Image src={image.url} alt={image.alt || ''} width={1200} height={900} sizes="(min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]" />
                    </div>
                    {(image.caption || image.credit || image.source_url) && (
                      <figcaption className="mt-2 flex flex-wrap items-start justify-between gap-2 text-xs leading-relaxed text-[#546E7A]">
                        <span>{image.caption}</span>
                        <Credit credit={image.credit} sourceUrl={image.source_url} />
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Tag aria-hidden="true" className="h-4 w-4 text-gray-400" />
              {post.tags.map((tag) => <span key={tag} className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs text-[#546E7A]">#{tag}</span>)}
            </div>

            <div className="text-right">
              <button type="button" onClick={shareArticle} className="flex items-center gap-1.5 text-xs font-bold text-[#0B4EA2] hover:text-[#073B7A]">
                {shareStatus === 'shared' || shareStatus === 'copied'
                  ? <Check aria-hidden="true" className="h-4 w-4" />
                  : <Share2 aria-hidden="true" className="h-4 w-4" />}
                {shareLabel}
              </button>
              <p className="sr-only" aria-live="polite">{shareStatus === 'idle' ? '' : shareLabel}</p>
            </div>
          </div>
        </article>

        <aside className="space-y-8" aria-label="Conteúdo relacionado">
          {relatedTour && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-premium">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#0B4EA2]">Pacote recomendado para este roteiro</span>
              <div className="mb-4 h-44 overflow-hidden rounded-2xl">
                <Image
                  src={relatedTour.primary_image}
                  alt={relatedTour.name}
                  width={800}
                  height={440}
                  onError={(event) => { event.currentTarget.src = '/site-assets/02c648d21222bbd8.jpg'; }}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mb-2 text-base font-bold text-[#263238]">{relatedTour.name}</h2>
              <p className="mb-4 line-clamp-2 text-xs font-light text-[#546E7A]">{relatedTour.description}</p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div><span className="block text-[10px] text-gray-400">A partir de</span><span className="text-base font-bold text-[#0B4EA2]">${relatedTour.base_price} USD</span></div>
                <Link href={`/tours/${relatedTour.slug}`} className="rounded-xl bg-[#0B4EA2] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#073B7A]">Ver pacote</Link>
              </div>
            </div>
          )}

          <div className="space-y-4 rounded-3xl bg-gradient-to-br from-[#0B4EA2] to-[#073B7A] p-6 text-center text-white">
            <Sparkles aria-hidden="true" className="mx-auto h-8 w-8 text-[#F59E0B]" />
            <h2 className="text-lg font-bold">Gostou deste artigo?</h2>
            <p className="text-xs font-light leading-relaxed text-gray-100">Solicite um roteiro sob medida com guias fluentes em português e embarque na viagem da sua vida.</p>
            <Link href="/contact#orcamento" className="block rounded-xl bg-[#F59E0B] py-3 text-xs font-bold text-[#263238] shadow transition-colors hover:bg-yellow-400">Pedir orçamento grátis</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
