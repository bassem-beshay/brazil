import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostView from '@/components/BlogPostView';
import { applyLocalTravelMedia } from '@/lib/contentMedia';
import { getSiteContent } from '@/lib/siteContent';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPageContent(slug: string) {
  const content = applyLocalTravelMedia(await getSiteContent());
  const post = content.MOCK_BLOG_POSTS.find((item) => item.slug === slug);

  return {
    post,
    relatedTour: content.MOCK_TOURS[0],
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPageContent(slug);

  if (!post) {
    return {
      title: 'Artigo não encontrado | Girassol Brasil Viagens',
    };
  }

  const description = post.excerpt.replace(/\s+/g, ' ').trim().slice(0, 160);

  return {
    title: `${post.title} | Blog Girassol Brasil Viagens`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      images: post.cover_image ? [{ url: post.cover_image, alt: post.cover_image_alt || post.title }] : undefined,
    },
  };
}

export default async function SingleBlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { post, relatedTour } = await getPageContent(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostView post={post} relatedTour={relatedTour} />;
}
