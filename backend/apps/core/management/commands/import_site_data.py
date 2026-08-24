from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

from apps.cms.models import Author, Blog, FAQ, Page, Settings
from apps.destinations.models import City, Country, Destination
from apps.tours.models import Category, Tour, TourImage, TourPackage


ROOT_DIR = Path(__file__).resolve().parents[5]
DEFAULT_SOURCE = ROOT_DIR / 'frontend' / 'src' / 'lib' / 'siteData.generated.json'


PT_MONTHS = {
    'janeiro': 1,
    'fevereiro': 2,
    'março': 3,
    'marco': 3,
    'abril': 4,
    'maio': 5,
    'junho': 6,
    'julho': 7,
    'agosto': 8,
    'setembro': 9,
    'outubro': 10,
    'novembro': 11,
    'dezembro': 12,
}


def clean_text(value: str | None) -> str:
    if not value:
        return ''
    text = str(value)
    if any(token in text for token in ['?', '?', '??', '???', '???', '??']):
        try:
            text = text.encode('latin1').decode('utf-8')
        except Exception:
            pass
    return re.sub(r'\s+', ' ', text).strip()


def parse_pt_date(value: str | None) -> datetime | None:
    if not value:
        return None
    value = clean_text(value)
    m = re.search(r'(\d{1,2})\s+de\s+([A-Za-zÀ-ÿ]+)\s+de\s+(\d{4})', value, re.I)
    if not m:
        return None
    month = PT_MONTHS.get(m.group(2).lower())
    if not month:
        return None
    return datetime(int(m.group(3)), month, int(m.group(1)))


def parse_decimal(value: str | int | float | None) -> str:
    if value is None:
        return '0.00'
    if isinstance(value, (int, float)):
        return f'{float(value):.2f}'
    text = clean_text(str(value)).replace('US$', '').replace('USD', '').replace('$', '').replace('€', '')
    text = text.replace(' ', '')
    if ',' in text and '.' in text:
        text = text.replace('.', '').replace(',', '.')
    elif ',' in text:
        tail = text.rsplit(',', 1)[-1]
        text = text.replace(',', '') if len(tail) == 3 else text.replace(',', '.')
    elif '.' in text:
        tail = text.rsplit('.', 1)[-1]
        text = text.replace('.', '') if len(tail) == 3 else text
    try:
        return f'{float(text):.2f}'
    except ValueError:
        return '0.00'


def media_value(value: str | None) -> str:
    value = clean_text(value)
    return value


def faq_category(value: str | None) -> str:
    text = clean_text(value).lower()
    if any(key in text for key in ['booking', 'reserva', 'reserv', 'cancel']):
        return 'booking'
    if any(key in text for key in ['payment', 'pag', 'preço', 'preco', 'price']):
        return 'payment'
    if any(key in text for key in ['tour', 'roteiro', 'viagem', 'pacote']):
        return 'tours'
    return 'general'


class Command(BaseCommand):
    help = 'Import WordPress-derived site content into the Django database and store a snapshot in Settings.'

    def add_arguments(self, parser):
        parser.add_argument('--source', default=str(DEFAULT_SOURCE), help='Path to the generated site data JSON.')
        parser.add_argument('--clean', action='store_true', help='Delete existing imported content before seeding.')

    @transaction.atomic
    def handle(self, *args, **options):
        source = Path(options['source'])
        if not source.exists():
            raise CommandError(f'Source file not found: {source}')

        try:
            payload = json.loads(source.read_text(encoding='utf-8'))
        except Exception as exc:
            raise CommandError(f'Failed to read site data JSON: {exc}') from exc

        destinations_data = payload.get('MOCK_DESTINATIONS', [])
        tours_data = payload.get('MOCK_TOURS', [])
        blogs_data = payload.get('MOCK_BLOG_POSTS', [])
        faqs_data = payload.get('MOCK_FAQS', [])
        pages_data = payload.get('PAGES', [])
        meta = payload.get('SITE_META', {})

        if options['clean']:
            TourPackage.objects.all().delete()
            TourImage.objects.all().delete()
            Tour.objects.all().delete()
            Category.objects.all().delete()
            Destination.objects.all().delete()
            City.objects.all().delete()
            Country.objects.all().delete()
            Blog.objects.all().delete()
            Author.objects.all().delete()
            FAQ.objects.all().delete()
            Page.objects.all().delete()
            Settings.objects.filter(key__in=['site_content_snapshot', 'site_meta']).delete()

        country_map: dict[str, Country] = {}
        city_map: dict[tuple[str, str], City] = {}

        def get_country(name: str) -> Country:
            slug = slugify(name) or 'country'
            country = country_map.get(slug)
            if country:
                return country
            country, _ = Country.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': clean_text(name),
                    'description': f'Destination country: {clean_text(name)}',
                    'featured': clean_text(name).lower() in {'egito', 'brazil', 'brasil', 'jordania', 'jordan', 'dubai'},
                },
            )
            country_map[slug] = country
            return country

        def get_city(country_name: str, city_name: str, description: str = '', featured: bool = False) -> City:
            country = get_country(country_name)
            key = (country.slug, slugify(city_name) or 'city')
            city = city_map.get(key)
            if city:
                return city
            city, _ = City.objects.update_or_create(
                slug=key[1],
                defaults={
                    'country': country,
                    'name': clean_text(city_name),
                    'description': clean_text(description) or f'{clean_text(city_name)} in {country.name}',
                    'featured': featured,
                },
            )
            city_map[key] = city
            return city

        # Countries and cities from destinations first.
        for item in destinations_data:
            country_name = item.get('country') or 'Egito'
            city_name = item.get('name') or item.get('slug') or 'Destination'
            get_city(country_name, city_name, item.get('description', ''), item.get('featured', False))

        # Categories.
        category_map: dict[str, Category] = {}
        for item in tours_data:
            name = clean_text(item.get('category') or 'General')
            slug = slugify(name) or 'general'
            category, _ = Category.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': name,
                    'icon': 'fa-compass',
                    'description': f'Imported category: {name}',
                },
            )
            category_map[slug] = category

        # Tours and packages.
        for item in tours_data:
            country_name = item.get('country') or 'Egito'
            city_name = item.get('city_name') or item.get('country') or item.get('name') or 'Destination'
            city = get_city(country_name, city_name, item.get('description', ''), item.get('featured', False))
            category = category_map.get(slugify(clean_text(item.get('category') or 'General')) or 'general')
            tour, _ = Tour.objects.update_or_create(
                slug=item.get('slug') or slugify(item.get('name') or 'tour'),
                defaults={
                    'category': category,
                    'city': city,
                    'name': clean_text(item.get('name') or 'Tour'),
                    'description': clean_text(item.get('description') or ''),
                    'duration_days': int(item.get('duration_days') or 1),
                    'duration_hours': int(item.get('duration_hours') or 0),
                    'difficulty': 'easy' if clean_text(item.get('difficulty')).lower().startswith('fácil') else ('medium' if clean_text(item.get('difficulty')).lower().startswith('moderado') else 'hard'),
                    'max_group_size': 15,
                    'inclusions': item.get('inclusions') or [],
                    'exclusions': item.get('exclusions') or [],
                    'itinerary': item.get('itinerary') or [],
                    'base_price': parse_decimal(item.get('base_price')),
                    'featured': bool(item.get('featured', False)),
                    'is_active': True,
                    'seo_title': clean_text(item.get('name') or ''),
                    'seo_description': clean_text(item.get('description') or '')[:250],
                },
            )

            TourImage.objects.filter(tour=tour).delete()
            gallery = item.get('gallery') or [item.get('primary_image')]
            for idx, image_url in enumerate([url for url in gallery if url]):
                TourImage.objects.create(tour=tour, image=media_value(image_url), is_primary=(idx == 0))

            TourPackage.objects.filter(tour=tour).delete()
            for pkg in item.get('packages') or []:
                start = parse_pt_date(pkg.get('title'))
                if not start:
                    start = datetime.strptime((pkg.get('start_date') or '2026-01-01')[:10], '%Y-%m-%d')
                end_text = (pkg.get('end_date') or start.strftime('%Y-%m-%d'))[:10]
                end = datetime.strptime(end_text, '%Y-%m-%d')
                TourPackage.objects.create(
                    tour=tour,
                    title=clean_text(pkg.get('title') or start.strftime('%d/%m/%Y')),
                    start_date=start.date(),
                    end_date=end.date(),
                    price_per_person=parse_decimal(pkg.get('price_per_person')),
                    available_spots=int(pkg.get('available_spots') or 0),
                    status=clean_text(pkg.get('status') or 'active'),
                )

        # Destinations.
        Destination.objects.all().delete()
        for item in destinations_data:
            country_name = item.get('country') or 'Egito'
            city_name = item.get('name') or item.get('slug') or 'Destination'
            city = get_city(country_name, city_name, item.get('description', ''), item.get('featured', False))
            Destination.objects.create(
                city=city,
                name=clean_text(item.get('name') or city_name),
                slug=item.get('slug') or slugify(item.get('name') or city_name),
                description=clean_text(item.get('description') or ''),
                main_image=media_value(item.get('cover_image') or item.get('gallery', [''])[0] or ''),
                featured=bool(item.get('featured', False)),
            )

        # Blogs.
        Author.objects.all().delete()
        Blog.objects.all().delete()
        author_map: dict[str, Author] = {}
        for item in blogs_data:
            author_data = item.get('author') or {}
            author_name = clean_text(author_data.get('name') or 'Redação Girasol')
            author = author_map.get(author_name)
            if not author:
                author = Author.objects.create(
                    name=author_name,
                    avatar=media_value(author_data.get('avatar') or ''),
                    bio=clean_text(author_data.get('role') or ''),
                )
                author_map[author_name] = author
            Blog.objects.update_or_create(
                slug=item.get('slug') or slugify(item.get('title') or 'post'),
                defaults={
                    'author': author,
                    'title': clean_text(item.get('title') or 'Blog Post'),
                    'content': clean_text(item.get('content') or ''),
                    'main_image': media_value(item.get('cover_image') or ''),
                    'published_at': parse_pt_date(item.get('published_at')),
                    'tags': item.get('tags') or [],
                    'seo_title': clean_text(item.get('title') or '')[:150],
                    'seo_description': clean_text(item.get('excerpt') or '')[:250],
                },
            )

        # FAQs.
        FAQ.objects.all().delete()
        for idx, item in enumerate(faqs_data):
            FAQ.objects.create(
                question=clean_text(item.get('question') or ''),
                answer=clean_text(item.get('answer') or ''),
                category=faq_category(item.get('category')),
                is_active=True,
                order=idx,
            )

        # Pages.
        Page.objects.all().delete()
        for item in pages_data:
            Page.objects.create(
                title=clean_text(item.get('title') or ''),
                slug=item.get('slug') or slugify(item.get('title') or 'page'),
                content=clean_text(item.get('content') or ''),
                is_active=bool(item.get('is_active', True)),
            )

        Settings.objects.update_or_create(
            key='site_content_snapshot',
            defaults={'value': json.dumps(payload, ensure_ascii=False)},
        )
        Settings.objects.update_or_create(
            key='site_meta',
            defaults={'value': json.dumps(meta, ensure_ascii=False)},
        )

        self.stdout.write(self.style.SUCCESS(
            f'Imported {len(tours_data)} tours, {len(destinations_data)} destinations, {len(blogs_data)} blog posts, {len(faqs_data)} FAQs, {len(pages_data)} pages.'
        ))
