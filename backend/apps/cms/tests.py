import json
from types import SimpleNamespace

from django.test import SimpleTestCase, TestCase
from django.utils import timezone
from rest_framework import serializers
from rest_framework.test import APIClient

from apps.core.blog_review import (
    PAGES_5_9_DELETE_SLUGS,
    PAGES_5_9_IMAGE_DIRECTIVES,
    apply_blog_review_data,
)
from apps.core.management.commands.import_site_data import blog_gallery as import_blog_gallery
from apps.core.management.commands.import_site_data import clean_blog_content
from apps.core.management.commands.import_site_data import DEFAULT_SOURCE
from apps.core.management.commands.apply_blog_word_directives import DELETE_SLUGS, PHOTO_SLUGS

from .models import Author, Blog
from .serializers import BlogSerializer
from .site_content import blog_gallery, build_site_content, image_name


class BlogImageDataTests(SimpleTestCase):
    def test_blog_content_cleaner_preserves_markdown_paragraphs(self):
        self.assertEqual(
            clean_blog_content('## Heading\r\n\r\nFirst   paragraph.\r\n\r\n- One\r\n- Two'),
            '## Heading\n\nFirst paragraph.\n\n- One\n- Two',
        )

    def test_word_directive_manifest_is_complete_and_disjoint(self):
        self.assertEqual(len(DELETE_SLUGS), 24)
        self.assertEqual(len(PHOTO_SLUGS), 19)
        self.assertFalse(DELETE_SLUGS & PHOTO_SLUGS)

        if not DEFAULT_SOURCE.exists():
            return

        payload = json.loads(DEFAULT_SOURCE.read_text(encoding='utf-8'))
        source_slugs = {item['slug'] for item in payload['MOCK_BLOG_POSTS']}
        self.assertTrue(PHOTO_SLUGS <= source_slugs)
        self.assertFalse(DELETE_SLUGS & source_slugs)
        self.assertEqual(len(payload['MOCK_BLOG_POSTS']), 720)

    def test_pages_5_to_9_manifest_is_complete_and_applies_safely(self):
        self.assertEqual(len(PAGES_5_9_DELETE_SLUGS), 23)
        self.assertEqual(len(PAGES_5_9_IMAGE_DIRECTIVES), 18)
        self.assertFalse(PAGES_5_9_DELETE_SLUGS & PAGES_5_9_IMAGE_DIRECTIVES.keys())
        reviewed = apply_blog_review_data([
            {'slug': 'pacotes-promocionais-janeiro-2017'},
            {
                'slug': 'o-oraculo-de-delfos',
                'cover_image': '/old.jpg',
                'gallery': [],
                'content': '[vc_row]Texto[/vc_row]',
                'excerpt': '[vc_column_text]Resumo',
                'tags': [],
                'category': 'Cultura',
            },
        ])
        self.assertEqual(len(reviewed), 1)
        self.assertEqual(reviewed[0]['slug'], 'o-oraculo-de-delfos')
        self.assertEqual(reviewed[0]['cover_image'], '/blog-sources/o-oraculo-de-delfos/main.webp')
        self.assertEqual(len(reviewed[0]['gallery']), 8)
        self.assertEqual(reviewed[0]['content'], 'Texto')
        self.assertEqual(reviewed[0]['tags'], ['Cultura'])

    def test_image_name_keeps_public_asset_paths(self):
        self.assertEqual(image_name('/blog-sources/post/main.jpg'), '/blog-sources/post/main.jpg')
        self.assertEqual(image_name('girassol-media/post.jpg'), '/girassol-media/post.jpg')

    def test_image_name_uses_storage_url_for_uploaded_image(self):
        field = SimpleNamespace(name='blogs/upload.jpg', url='/media/blogs/upload.jpg')
        self.assertEqual(image_name(field), '/media/blogs/upload.jpg')

    def test_site_content_gallery_normalizes_legacy_and_attributed_entries(self):
        value = [
            '/legacy.jpg',
            {
                'url': 'blog-sources/post/second.jpg',
                'credit': 'Photographer',
                'source_url': 'https://example.com/source',
                'caption': 'View from the summit',
            },
            {'credit': 'Missing URL'},
        ]
        self.assertEqual(
            blog_gallery(value),
            [
                {'url': '/legacy.jpg', 'credit': '', 'source_url': ''},
                {
                    'url': '/blog-sources/post/second.jpg',
                    'credit': 'Photographer',
                    'source_url': 'https://example.com/source',
                    'caption': 'View from the summit',
                },
            ],
        )

    def test_import_gallery_normalizes_legacy_entries_and_preserves_attribution(self):
        self.assertEqual(
            import_blog_gallery([
                '/legacy.jpg',
                {
                    'url': '/second.jpg',
                    'credit': ' Photographer ',
                    'source_url': ' https://example.com/source ',
                },
            ]),
            [
                {'url': '/legacy.jpg', 'credit': '', 'source_url': ''},
                {
                    'url': '/second.jpg',
                    'credit': 'Photographer',
                    'source_url': 'https://example.com/source',
                },
            ],
        )

    def test_serializer_normalizes_gallery_and_rejects_invalid_source_url(self):
        serializer = BlogSerializer()
        self.assertEqual(
            serializer.validate_gallery(['/legacy.jpg']),
            [{'url': '/legacy.jpg', 'credit': '', 'source_url': ''}],
        )
        with self.assertRaises(serializers.ValidationError):
            serializer.validate_gallery([
                {'url': '/image.jpg', 'source_url': 'not a URL'},
            ])


class BlogPublicApiTests(TestCase):
    def setUp(self):
        author = Author.objects.create(name='Redação', avatar='/author.webp', bio='Equipe')
        self.post = Blog.objects.create(
            author=author,
            title='Artigo de teste',
            slug='artigo-de-teste',
            content='Conteúdo completo que não deve aparecer na listagem.',
            excerpt='Resumo público',
            category='Cultura',
            main_image='/cover.webp',
            gallery=[{'url': '/gallery.webp', 'credit': 'Fotógrafo', 'source_url': ''}],
            published_at=timezone.now(),
            published_label='25 de novembro de 2026',
            read_time='4 min',
            tags=['Cultura'],
            featured=True,
        )
        self.client = APIClient()

    def test_list_is_paginated_and_omits_heavy_article_fields(self):
        response = self.client.get('/api/cms/blogs/')
        self.assertEqual(response.status_code, 200)
        item = response.json()['results'][0]
        self.assertNotIn('content', item)
        self.assertNotIn('gallery', item)
        self.assertEqual(item['cover_image'], '/cover.webp')

    def test_detail_and_overview_return_public_blog_data(self):
        detail = self.client.get('/api/cms/blogs/artigo-de-teste/')
        self.assertEqual(detail.status_code, 200)
        self.assertEqual(detail.json()['content'], self.post.content)
        self.assertEqual(len(detail.json()['gallery']), 1)

        overview = self.client.get('/api/cms/blogs/overview/')
        self.assertEqual(overview.status_code, 200)
        self.assertEqual(overview.json()['featured']['slug'], self.post.slug)
        self.assertEqual(overview.json()['popular_tags'], ['Cultura'])

        filtered = self.client.get('/api/cms/blogs/?tag=Cultura')
        self.assertEqual(filtered.status_code, 200)
        self.assertEqual(filtered.json()['count'], 1)

    def test_site_content_keeps_blog_archive_out_of_layout_payload(self):
        content = build_site_content()
        self.assertEqual(content['MOCK_BLOG_POSTS'], [])
        self.assertEqual(content['SITE_META']['blog_count'], 1)
