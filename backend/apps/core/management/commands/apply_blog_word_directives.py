from __future__ import annotations

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.cms.models import Blog

from .import_site_data import (
    DEFAULT_SOURCE,
    blog_gallery,
    clean_blog_content,
    clean_text,
    media_value,
)


DELETE_SLUGS = {
    'grande-presente-do-rio-nilo-egito',
    'gigante-monolito-de-uluru-australia',
    'onda-country-music-nashville',
    'desvendando-belezas-croacia-europa',
    'sucesso-oriental-kebab-na-europa',
    'aventura-andina-mendoza-argentina',
    'viagem-espiritual-borobudur-indonesia',
    'primavera-romantica-paris',
    'incriveis-cataratas-iguacu',
    'encantos-ilhas-maldivas',
    'precioso-taj-mahal',
    'charme-cultural-barcelona',
    'extraordinaria-exotica-abu-dhabi',
    'perolas-sob-sol-bahamas-no-caribe',
    'magnifica-fatehpur-sikri-india',
    'grande-barreira-de-coral-australia',
    'esportes-aventura-qweenstown-nova-zelandia',
    'lendaria-famosa-cidade-troia',
    'lindas-petalas-cultura-vietna',
    'esquiando-matterhorn-mountain-suica',
    'desvendando-imensidao-machu-picchu',
    'inesquecivel-reveillon-sidney-australia',
    'coloridos-encantos-da-ilha-da-madeira',
    'majestosas-belezas-da-irlanda',
}

PHOTO_SLUGS = {
    'egmont-national-park-nova-zelandia',
    'uma-visita-singular-kathmandu-no-nepal',
    'cidade-encantadora-de-cork-na-irlanda',
    'mitologia-para-a-modernidade-da-grecia',
    'moderna-apaixonante-sao-petersburgo',
    'sofisticada-cultural-londres-inglaterra',
    'belissima-floresta-negra-alemanha',
    'exotica-ilha-norte-nova-zelandia',
    'majestoso-cristo-redentor-no-brasil',
    'impressionante-paradisiaca-california',
    'romantismo-tropical-bali',
    'incrivel-grand-canyon-estados-unidos',
    'grandiosa-cosmopolita-pequim-na-china',
    'atmosfera-espiritual-luang-prabang-laos',
    'graca-beleza-bancoc-na-tailandia',
    'incrivel-arquitetura-igrejas-lalibela',
    'festivais-internacionais-musica-lucerna',
    'tradicoes-cultura-historica-istambul',
    'antiguidade-para-modernidade-em-toquio',
}


class Command(BaseCommand):
    help = 'Apply the exact blog photo and deletion directives from the approved Word file.'

    def add_arguments(self, parser):
        parser.add_argument('--source', default=str(DEFAULT_SOURCE))
        parser.add_argument('--dry-run', action='store_true')
        parser.add_argument(
            '--repair-content',
            action='store_true',
            help='Restore Markdown paragraph breaks from the approved source JSON.',
        )

    def handle(self, *args, **options):
        source = Path(options['source'])
        if not source.exists():
            raise CommandError(f'Source file not found: {source}')

        try:
            payload = json.loads(source.read_text(encoding='utf-8'))
        except Exception as exc:
            raise CommandError(f'Failed to read source JSON: {exc}') from exc

        source_posts = {
            item.get('slug'): item
            for item in payload.get('MOCK_BLOG_POSTS', [])
            if item.get('slug')
        }
        missing_source = sorted(PHOTO_SLUGS - source_posts.keys())
        if missing_source:
            raise CommandError(f'Photo directives missing from source JSON: {missing_source}')

        delete_matches = set(
            Blog.objects.filter(slug__in=DELETE_SLUGS).values_list('slug', flat=True)
        )
        update_matches = {
            item.slug: item for item in Blog.objects.filter(slug__in=PHOTO_SLUGS)
        }
        missing_live = sorted(PHOTO_SLUGS - update_matches.keys())
        if missing_live:
            raise CommandError(f'Photo target posts missing from database: {missing_live}')

        content_updates = []
        if options['repair_content']:
            live_posts = {
                item.slug: item
                for item in Blog.objects.filter(slug__in=source_posts.keys())
            }
            for slug, source_item in source_posts.items():
                post = live_posts.get(slug)
                if not post:
                    continue
                content = clean_blog_content(source_item.get('content') or '')
                if post.content != content:
                    post.content = content
                    content_updates.append(post)

        self.stdout.write(
            f'delete_matches={len(delete_matches)} update_matches={len(update_matches)} '
            f'content_repairs={len(content_updates)} current_total={Blog.objects.count()}'
        )
        if options['dry_run']:
            self.stdout.write(self.style.SUCCESS('Dry run complete; no database changes were made.'))
            return

        with transaction.atomic():
            deleted_count, _ = Blog.objects.filter(slug__in=DELETE_SLUGS).delete()
            for slug, post in update_matches.items():
                source_item = source_posts[slug]
                post.main_image = media_value(source_item.get('cover_image') or '')
                post.main_image_credit = clean_text(source_item.get('image_credit') or '')
                post.main_image_source_url = clean_text(source_item.get('image_source_url') or '')
                post.gallery = blog_gallery(source_item.get('gallery') or [])
                post.save(update_fields=[
                    'main_image',
                    'main_image_credit',
                    'main_image_source_url',
                    'gallery',
                    'updated_at',
                ])
            if content_updates:
                updated_at = timezone.now()
                for post in content_updates:
                    post.updated_at = updated_at
                Blog.objects.bulk_update(content_updates, ['content', 'updated_at'])

        self.stdout.write(
            self.style.SUCCESS(
                f'Applied directives: deleted={deleted_count}, updated={len(update_matches)}, '
                f'content_repaired={len(content_updates)}, remaining={Blog.objects.count()}'
            )
        )
