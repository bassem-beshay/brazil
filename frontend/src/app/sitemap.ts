import type { MetadataRoute } from 'next';

import { getBlogSitemap } from '@/lib/blogApi';
import { publicSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogSitemap();
  const staticPages = ['', '/destinations', '/tours', '/about', '/faq', '/blog', '/contact'];

  return [
    ...staticPages.map((path) => ({
      url: `${publicSiteUrl}${path}`,
      changeFrequency: path === '/blog' ? 'daily' as const : 'weekly' as const,
      priority: path === '' ? 1 : path === '/blog' ? 0.9 : 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${publicSiteUrl}/blog/${post.slug}`,
      lastModified: post.updated_at || post.published_at || undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
