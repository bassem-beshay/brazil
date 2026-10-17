import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SitePageView from '@/components/SitePageView';
import { getPageBySlug, getPageMedia } from '@/lib/sitePages';
import { getSiteContent } from '@/lib/siteContent';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(await getSiteContent(), slug);

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
  const content = await getSiteContent();
  const page = getPageBySlug(content, slug);

  if (!page) {
    notFound();
  }

  const media = getPageMedia(content, slug);

  return (
    <SitePageView
      page={page}
      heroImage={media.heroImage}
      heroAlt={media.heroAlt}
      related={media.tiles}
    />
  );
}
