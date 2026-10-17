from __future__ import annotations

from decimal import Decimal

from apps.destinations.models import Destination
from apps.tours.models import Tour

from .models import Blog, FAQ, Office, Page, SiteProfile, TeamMember, Testimonial


def image_name(field) -> str:
    """Return the stored path without forcing local site assets through MEDIA_URL."""
    return str(getattr(field, 'name', field) or '')


def number(value: Decimal | int | float | None) -> float:
    return float(value or 0)


def build_site_content() -> dict:
    destinations = [
        {
            'id': item.source_id or str(item.pk),
            'name': item.name,
            'slug': item.slug,
            'country': item.city.country.name,
            'region': item.region,
            'tagline': item.tagline,
            'description': item.description,
            'cover_image': image_name(item.main_image),
            'gallery': item.gallery,
            'best_time_to_visit': item.best_time_to_visit,
            'ideal_duration': item.ideal_duration,
            'language': item.language,
            'currency': item.currency,
            'highlights': item.highlights,
            'starting_price': number(item.starting_price),
            'featured': item.featured,
        }
        for item in Destination.objects.select_related('city__country').order_by('display_order', 'name')
    ]

    tours = []
    tour_queryset = (
        Tour.objects.filter(is_active=True)
        .select_related('city__country', 'category')
        .prefetch_related('images', 'packages')
        .order_by('display_order', 'name')
    )
    difficulty_labels = {'easy': 'Fácil', 'medium': 'Moderado', 'hard': 'Aventura'}
    for item in tour_queryset:
        images = sorted(item.images.all(), key=lambda image: (not image.is_primary, image.pk))
        gallery = [image_name(image.image) for image in images if image_name(image.image)]
        packages = [
            {
                'id': str(package.pk),
                'title': package.title,
                'start_date': package.start_date.isoformat(),
                'end_date': package.end_date.isoformat(),
                'price_per_person': f'{package.price_per_person:.2f}',
                'available_spots': package.available_spots,
                'status': package.status,
            }
            for package in item.packages.all()
        ]
        tours.append({
            'id': item.source_id or str(item.pk),
            'name': item.name,
            'slug': item.slug,
            'city_name': item.city.name,
            'country': item.city.country.name,
            'category': item.category.name if item.category else '',
            'duration_days': item.duration_days,
            'difficulty': difficulty_labels.get(item.difficulty, item.difficulty),
            'base_price': f'{item.base_price:.2f}',
            'primary_image': gallery[0] if gallery else '',
            'gallery': gallery,
            'average_rating': number(item.average_rating),
            'reviews_count': item.reviews_count,
            'description': item.description,
            'inclusions': item.inclusions,
            'exclusions': item.exclusions,
            'itinerary': item.itinerary,
            'featured': item.featured,
            'is_multi_destination': item.is_multi_destination,
            'packages': packages,
        })

    blogs = [
        {
            'id': item.source_id or str(item.pk),
            'title': item.title,
            'slug': item.slug,
            'excerpt': item.excerpt,
            'content': item.content,
            'cover_image': image_name(item.main_image),
            'category': item.category,
            'author': {
                'name': item.author.name,
                'role': item.author.bio or '',
                'avatar': image_name(item.author.avatar),
            },
            'published_at': item.published_label or (item.published_at.date().isoformat() if item.published_at else ''),
            'read_time': item.read_time,
            'tags': item.tags,
            'featured': item.featured,
        }
        for item in Blog.objects.select_related('author').order_by('display_order', '-published_at', '-created_at')
    ]
    faqs = [
        {'id': item.source_id or str(item.pk), 'category': item.source_category or item.category,
         'question': item.question, 'answer': item.answer}
        for item in FAQ.objects.filter(is_active=True).order_by('order', 'question')
    ]
    reviews = [
        {'id': item.source_id or str(item.pk), 'author': item.author, 'country': item.country,
         'rating': item.rating, 'date': item.date_label, 'title': item.title,
         'comment': item.comment, 'tour_name': item.tour_name}
        for item in Testimonial.objects.filter(is_active=True).order_by('order', '-created_at')
    ]
    offices = [
        {'city': item.city, 'country': item.country, 'address': item.address, 'phone': item.phone,
         'email': item.email, 'whatsapp': item.whatsapp, 'hours': item.hours,
         'is_headquarters': item.is_headquarters}
        for item in Office.objects.filter(is_active=True).order_by('order', 'city')
    ]
    team = [
        {'name': item.name, 'role': item.role, 'bio': item.bio, 'image': image_name(item.image)}
        for item in TeamMember.objects.filter(is_active=True).order_by('order', 'name')
    ]
    pages = [
        {'id': item.source_id or str(item.pk), 'title': item.title, 'slug': item.slug,
         'content': item.content, 'is_active': item.is_active}
        for item in Page.objects.filter(is_active=True).order_by('title')
    ]

    profile = SiteProfile.objects.order_by('pk').first()
    site_meta = {
        'siteurl': profile.siteurl if profile else '',
        'blogname': profile.blogname if profile else '',
        'blogdescription': profile.blogdescription if profile else '',
        'user_count': profile.user_count if profile else 0,
        'post_count': profile.post_count if profile else 0,
        'tour_count': profile.tour_count if profile else len(tours),
        'blog_count': profile.blog_count if profile else len(blogs),
        'page_count': profile.page_count if profile else len(pages),
    }
    return {
        'MOCK_DESTINATIONS': destinations, 'MOCK_TOURS': tours, 'MOCK_BLOG_POSTS': blogs,
        'MOCK_FAQS': faqs, 'MOCK_REVIEWS': reviews, 'MOCK_OFFICES': offices,
        'MOCK_TEAM': team, 'SITE_META': site_meta, 'PAGES': pages,
    }
