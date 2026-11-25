import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BlogPostView from '@/components/BlogPostView';
import { getBlogPost } from '@/lib/blogApi';
import { applyLocalTravelMedia } from '@/lib/contentMedia';
import type { BlogPost, TourPackage } from '@/lib/mockData';
import { publicSiteUrl } from '@/lib/seo';
import { getSiteContent } from '@/lib/siteContent';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const STOP_WORDS = new Set([
  'para', 'uma', 'com', 'dos', 'das', 'pela', 'pelo', 'mais', 'viagem',
  'mundo', 'sobre', 'entre', 'como', 'suas', 'seus', 'destino', 'destinos',
]);

function words(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));
}

function findRelatedTour(post: BlogPost, tours: TourPackage[]) {
  const articleWords = new Set(words([post.title, post.category, ...post.tags].join(' ')));
  let best: { tour: TourPackage; score: number } | undefined;

  for (const tour of tours) {
    const tourWords = new Set(words([
      tour.name,
      tour.city_name,
      tour.country,
      tour.category,
      tour.description,
    ].join(' ')));
    const score = [...articleWords].reduce(
      (total, word) => total + (tourWords.has(word) ? 1 : 0),
      0,
    );
    if (!best || score > best.score) best = { tour, score };
  }

  return best && best.score >= 2 ? best.tour : undefined;
}

function absoluteImage(url: string) {
  if (/^https?:\/\//.test(url)) return url;
  return `${publicSiteUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: 'Artigo não encontrado | Girassol Brasil Viagens' };
  }

  const description = (post.seo_description || post.excerpt).replace(/\s+/g, ' ').trim().slice(0, 160);
  const canonical = `${publicSiteUrl}/blog/${post.slug}`;
  const title = post.seo_title || `${post.title} | Blog Girassol Brasil Viagens`;

  return {
    metadataBase: new URL(publicSiteUrl),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: post.seo_title || post.title,
      description,
      type: 'article',
      url: canonical,
      publishedTime: post.published_at_iso || undefined,
      modifiedTime: post.updated_at,
      authors: [post.author.name],
      images: post.cover_image ? [{ url: post.cover_image, alt: post.cover_image_alt || post.title }] : undefined,
    },
  };
}

export default async function SingleBlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, content] = await Promise.all([getBlogPost(slug), getSiteContent()]);

  if (!post) notFound();

  const localContent = applyLocalTravelMedia(content);
  const relatedTour = findRelatedTour(post, localContent.MOCK_TOURS);
  const images = [
    post.cover_image,
    ...(post.gallery || []).map((image) => typeof image === 'string' ? image : image.url),
  ].filter(Boolean).map(absoluteImage);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: (post.seo_description || post.excerpt).replace(/\s+/g, ' ').trim(),
    image: [...new Set(images)],
    datePublished: post.published_at_iso || undefined,
    dateModified: post.updated_at || post.published_at_iso || undefined,
    author: { '@type': 'Organization', name: post.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'Girassol Brasil Viagens e Turismo',
      logo: { '@type': 'ImageObject', url: `${publicSiteUrl}/brand/girassol-brasil-transparent.png` },
    },
    mainEntityOfPage: `${publicSiteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BlogPostView post={post} relatedTour={relatedTour} />
    </>
  );
}
