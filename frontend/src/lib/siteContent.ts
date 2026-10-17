import 'server-only';

import { cache } from 'react';
import type { SiteContentBundle } from '@/context/SiteContentContext';

const apiBase = process.env.INTERNAL_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const getSiteContent = cache(async (): Promise<SiteContentBundle> => {
  const response = await fetch(`${apiBase}/cms/site-content/`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Unable to load site content from Django (${response.status}).`);
  }

  return response.json() as Promise<SiteContentBundle>;
});
