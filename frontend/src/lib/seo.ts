export const publicSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.girassolviagens.com'
).replace(/\/$/, '');
