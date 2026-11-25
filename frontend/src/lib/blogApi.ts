import 'server-only';

import { cache } from 'react';
import type { BlogPost } from '@/lib/mockData';

const apiBase = process.env.INTERNAL_API_BASE_URL || 'http://127.0.0.1:8000/api';

type BlogPage = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
};

type BlogOverview = {
  featured: BlogPost | null;
  popular_tags: string[];
  count: number;
};

export type BlogSitemapItem = {
  slug: string;
  published_at: string | null;
  updated_at: string;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Unable to load blog content from Django (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export function getBlogOverview() {
  return getJson<BlogOverview>('/cms/blogs/overview/');
}

export function getBlogPage({
  page,
  search,
  tag,
  excludeSlug,
}: {
  page: number;
  search?: string;
  tag?: string;
  excludeSlug?: string;
}) {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set('search', search);
  if (tag) query.set('tag', tag);
  if (excludeSlug) query.set('exclude_slug', excludeSlug);
  return getJson<BlogPage>(`/cms/blogs/?${query.toString()}`);
}

export const getBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const response = await fetch(`${apiBase}/cms/blogs/${encodeURIComponent(slug)}/`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Unable to load blog article from Django (${response.status}).`);
  }
  return response.json() as Promise<BlogPost>;
});

export function getBlogSitemap() {
  return getJson<BlogSitemapItem[]>('/cms/blogs/sitemap/');
}
