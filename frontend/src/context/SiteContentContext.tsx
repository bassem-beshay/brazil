'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { applyLocalTravelMedia } from '@/lib/contentMedia';
import type { BlogPost, Destination, FAQItem, OfficeLocation, ReviewItem, TourPackage } from '@/lib/mockData';

export interface SiteContentBundle {
  MOCK_DESTINATIONS: Destination[];
  MOCK_TOURS: TourPackage[];
  MOCK_BLOG_POSTS: BlogPost[];
  MOCK_FAQS: FAQItem[];
  MOCK_REVIEWS: ReviewItem[];
  MOCK_OFFICES: OfficeLocation[];
  MOCK_TEAM: Array<{
    name: string;
    role: string;
    bio: string;
    image: string;
  }>;
  SITE_META: {
    siteurl: string;
    blogname: string;
    blogdescription: string;
    user_count: number;
    post_count: number;
    tour_count: number;
    blog_count: number;
    page_count: number;
  };
  PAGES: Array<{
    id: string;
    title: string;
    slug: string;
    content: string;
    is_active: boolean;
  }>;
}

const SiteContentContext = createContext<SiteContentBundle | null>(null);

export function SiteContentProvider({
  initialContent,
  children,
}: {
  initialContent: SiteContentBundle;
  children: React.ReactNode;
}) {
  const value = useMemo(() => applyLocalTravelMedia(initialContent), [initialContent]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return context;
}
