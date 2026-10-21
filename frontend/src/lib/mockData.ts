export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: 'egito' | 'america-do-sul' | 'multi-destino';
  tagline: string;
  description: string;
  cover_image: string;
  gallery: string[];
  best_time_to_visit: string;
  ideal_duration: string;
  language: string;
  currency: string;
  highlights: string[];
  starting_price: number;
  featured?: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string | null;
}

export interface TourPackage {
  id: string;
  name: string;
  slug: string;
  city_name: string;
  country: string;
  category: string;
  duration_days: number;
  difficulty: 'Fácil' | 'Moderado' | 'Aventura';
  base_price: string;
  primary_image: string;
  gallery?: string[];
  average_rating: number;
  reviews_count: number;
  description: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  featured?: boolean;
  is_multi_destination?: boolean;
  packages?: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    price_per_person: string;
    available_spots: number;
    status: string;
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_image_alt?: string;
  image_credit?: string;
  image_source_url?: string;
  cover_image_credit?: string;
  cover_image_source_url?: string;
  gallery?: Array<string | BlogGalleryImage>;
  category: string;
  author: { name: string; role: string; avatar: string };
  published_at: string;
  read_time: string;
  tags: string[];
  featured?: boolean;
}

export interface BlogGalleryImage {
  url: string;
  alt?: string;
  caption?: string;
  credit?: string;
  source_url?: string;
}

export interface FAQItem {
  id: string;
  category: 'reservas' | 'vistos' | 'cruzeiro' | 'seguranca' | 'geral' | 'booking' | 'payment' | 'tours';
  question: string;
  answer: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  country: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  tour_name: string;
}

export interface OfficeLocation {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: string;
  is_headquarters?: boolean;
}
