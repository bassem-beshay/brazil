const LEGACY_AIRPLANE_IMAGE = '/site-assets/129c99e2660a92ad.png';

const media = {
  cairo: '/site-assets/cc25b2eb94a7e175.png',
  nile: '/site-assets/2eee2d63670661aa.jpg',
  sharm: '/site-assets/340eaaf95101bd52.png',
  hurghada: '/site-assets/fb1a3cc0cf94e9f2.png',
  alexandria: '/site-assets/67c24c730d8b8a5a.png',
  siwa: '/site-assets/3b9cb8128b4300d5.png',
  jordan: '/site-assets/be66a3791d60c940.png',
  dubai: '/site-assets/beb26a1d728797db.png',
  temple: '/site-assets/2be8e30a696cf708.png',
  sphinx: '/site-assets/bfd87f9300b1c53f.png',
  museum: '/site-assets/761e921bfc20f100.png',
  market: '/site-assets/7d6b87f2d9b6c89f.png',
  cruise: '/site-assets/48c80c7ecf3a1f7c.png',
} as const;

const egyptImages = [media.cairo, media.sphinx, media.temple, media.museum, media.market];
const nileImages = [media.nile, media.cruise, media.temple, media.sphinx];

function hash(value: string) {
  return Array.from(value).reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 7);
}

function pick(images: readonly string[], seed: string) {
  return images[hash(seed) % images.length];
}

function destinationImage(text: string) {
  const value = text.toLocaleLowerCase('pt-BR');

  if (/(dubai|emirados)/.test(value)) return media.dubai;
  if (/(jord|petra|wadi rum|terra santa)/.test(value)) return media.jordan;
  if (/(alexandria)/.test(value)) return media.alexandria;
  if (/(siwa|oasis|oásis|deserto ocidental)/.test(value)) return media.siwa;
  if (/(hurghada|giftun)/.test(value)) return media.hurghada;
  if (/(sharm|sinai|soho|ras mohammed|tiran|mar vermelho|mergulho)/.test(value)) return media.sharm;
  if (/(luxor|aswan|assuan|assuã|nilo|cruzeiro|karnak|edfu|kom ombo|filae|philae)/.test(value)) {
    return pick(nileImages, value);
  }

  return pick(egyptImages, value);
}

function galleryFor(primary: string, seed: string) {
  const alternatives = [
    media.cairo, media.nile, media.sharm, media.hurghada, media.alexandria,
    media.siwa, media.jordan, media.dubai, media.temple, media.sphinx, media.museum,
  ].filter((image) => image !== primary);

  return [primary, pick(alternatives, `${seed}-gallery`)];
}

function usableImage(image: unknown) {
  return typeof image === 'string' && image.startsWith('/site-assets/') && image !== LEGACY_AIRPLANE_IMAGE;
}

/**
 * The source dump reused one EgyptAir thumbnail on most records. This display
 * adapter keeps the imported text and records untouched while replacing only
 * that generic thumbnail with relevant, downloaded local photographs.
 */
export function applyLocalTravelMedia<T extends Record<string, any>>(content: T): T {
  const destinations = (content.MOCK_DESTINATIONS || []).map((destination: any) => {
    const seed = `${destination.slug} ${destination.name} ${destination.country}`;
    const primary = usableImage(destination.cover_image) ? destination.cover_image : destinationImage(seed);
    const existingGallery = (destination.gallery || []).filter(usableImage);

    return {
      ...destination,
      cover_image: primary,
      gallery: existingGallery.length ? existingGallery : galleryFor(primary, seed),
    };
  });

  const tours = (content.MOCK_TOURS || []).map((tour: any) => {
    const seed = `${tour.slug} ${tour.name} ${tour.city_name} ${tour.country} ${tour.category}`;
    const primary = usableImage(tour.primary_image) ? tour.primary_image : destinationImage(seed);
    const existingGallery = (tour.gallery || []).filter(usableImage);

    return {
      ...tour,
      primary_image: primary,
      gallery: existingGallery.length ? existingGallery : galleryFor(primary, seed),
    };
  });

  const posts = (content.MOCK_BLOG_POSTS || []).map((post: any) => {
    const seed = `${post.slug} ${post.title} ${post.category} ${(post.tags || []).join(' ')}`;
    return {
      ...post,
      cover_image: usableImage(post.cover_image) ? post.cover_image : destinationImage(seed),
    };
  });

  return {
    ...content,
    MOCK_DESTINATIONS: destinations,
    MOCK_TOURS: tours,
    MOCK_BLOG_POSTS: posts,
  };
}
