import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SitePageView from '@/components/SitePageView';
import BenefitDetailView from '@/components/BenefitDetailView';
import { getBenefitPage } from '@/lib/benefitPages';
import { getPageBySlug, getPageMedia } from '@/lib/sitePages';
import { getSiteContent } from '@/lib/siteContent';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const benefitPage = getBenefitPage(slug);
  if (benefitPage) {
    return {
      title: `${benefitPage.title} | Girassol Brasil Viagens e Turismo`,
      description: benefitPage.cardText,
    };
  }
  const page = getPageBySlug(await getSiteContent(), slug);

  if (!page) {
    return {
      title: 'Página não encontrada | Girassol',
    };
  }

  return {
    title: `${page.title} | Girassol Viagens e Turismo`,
    description: page.content.slice(0, 160).replace(/\s+/g, ' '),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const benefitPage = getBenefitPage(slug);
  if (benefitPage) {
    return <BenefitDetailView page={benefitPage} />;
  }
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
