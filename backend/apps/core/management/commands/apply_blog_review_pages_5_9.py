from __future__ import annotations

from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.cms.models import Blog, SiteProfile
from apps.core.blog_review import (
    CONTENT_REPAIRS,
    EMPTY_COVER_REPAIRS,
    PAGES_5_9_DELETE_SLUGS,
    PAGES_5_9_IMAGE_DIRECTIVES,
    TITLE_REPAIRS,
    strip_legacy_shortcodes,
)


REPOSITORY_DIR = Path(__file__).resolve().parents[5]


class Command(BaseCommand):
    help = 'Apply approved blog review directives for pages 5 through 9.'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true')

    def handle(self, *args, **options):
        expected_targets = set(PAGES_5_9_IMAGE_DIRECTIVES) | set(CONTENT_REPAIRS) | set(TITLE_REPAIRS)
        live_targets = {
            item.slug: item
            for item in Blog.objects.filter(slug__in=expected_targets)
        }
        missing = sorted(expected_targets - live_targets.keys())
        if missing:
            raise CommandError(f'Required blog targets are missing: {missing}')

        public_root = REPOSITORY_DIR / 'frontend' / 'public'
        if public_root.exists():
            for slug, directive in PAGES_5_9_IMAGE_DIRECTIVES.items():
                for image in directive['gallery']:
                    asset = public_root / image['url'].lstrip('/')
                    if not asset.exists():
                        raise CommandError(f'Approved image is missing: {asset}')

        delete_matches = set(
            Blog.objects.filter(slug__in=PAGES_5_9_DELETE_SLUGS).values_list('slug', flat=True)
        )
        changed_posts = []
        changed_fields: dict[int, set[str]] = {}

        def set_value(post: Blog, field: str, value) -> None:
            if getattr(post, field) == value:
                return
            setattr(post, field, value)
            changed_fields.setdefault(post.pk, set()).add(field)

        for post in Blog.objects.exclude(slug__in=PAGES_5_9_DELETE_SLUGS):
            directive = PAGES_5_9_IMAGE_DIRECTIVES.get(post.slug)
            if directive:
                gallery = directive['gallery']
                if not directive.get('keep_cover'):
                    set_value(post, 'main_image', gallery[0]['url'])
                set_value(post, 'gallery', gallery)
                set_value(post, 'main_image_credit', directive.get('credit', ''))
                set_value(post, 'main_image_source_url', '')

            if post.slug in TITLE_REPAIRS:
                title = TITLE_REPAIRS[post.slug]
                set_value(post, 'title', title)
                set_value(post, 'seo_title', title[:150])

            if post.slug in CONTENT_REPAIRS:
                set_value(post, 'content', CONTENT_REPAIRS[post.slug])

            if post.slug in EMPTY_COVER_REPAIRS and not str(post.main_image or '').strip():
                set_value(post, 'main_image', EMPTY_COVER_REPAIRS[post.slug])

            set_value(post, 'content', strip_legacy_shortcodes(post.content))
            set_value(post, 'excerpt', strip_legacy_shortcodes(post.excerpt))
            if not post.tags:
                set_value(post, 'tags', [post.category or 'Viagens'])

            if post.pk in changed_fields:
                changed_posts.append(post)

        self.stdout.write(
            f'delete_matches={len(delete_matches)} updates={len(changed_posts)} '
            f'current_total={Blog.objects.count()}'
        )
        if options['dry_run']:
            self.stdout.write(self.style.SUCCESS('Dry run complete; no database changes were made.'))
            return

        with transaction.atomic():
            deleted_count, _ = Blog.objects.filter(slug__in=PAGES_5_9_DELETE_SLUGS).delete()
            now = timezone.now()
            for post in changed_posts:
                fields = sorted(changed_fields[post.pk] | {'updated_at'})
                post.updated_at = now
                post.save(update_fields=fields)
            SiteProfile.objects.update(blog_count=Blog.objects.count())

        self.stdout.write(
            self.style.SUCCESS(
                f'Applied review pages 5-9: deleted={deleted_count}, '
                f'updated={len(changed_posts)}, remaining={Blog.objects.count()}'
            )
        )
