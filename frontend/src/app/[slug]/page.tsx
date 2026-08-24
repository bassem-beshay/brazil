import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SitePageView from '@/components/SitePageView';
import { getPageMedia, sitePageBySlug } from '@/lib/sitePages';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = sitePageBySlug[slug];

  if (!page) {
    return {
      title: 'Página não encontrada | Girasol',
    };
  }

  return {
    title: `${page.title} | Girasol Viagens e Turismo`,
    description: page.content.slice(0, 160).replace(/\s+/g, ' '),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = sitePageBySlug[slug];

  if (!page) {
    notFound();
  }

  const media = getPageMedia(slug);

  return (
    <SitePageView
      page={page}
      heroImage={media.heroImage}
      heroAlt={media.heroAlt}
      related={media.tiles}
    />
  );
}
