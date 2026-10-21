import json
from types import SimpleNamespace

from django.test import SimpleTestCase
from rest_framework import serializers

from apps.core.management.commands.import_site_data import blog_gallery as import_blog_gallery
from apps.core.management.commands.import_site_data import clean_blog_content
from apps.core.management.commands.import_site_data import DEFAULT_SOURCE
from apps.core.management.commands.apply_blog_word_directives import DELETE_SLUGS, PHOTO_SLUGS

from .serializers import BlogSerializer
from .site_content import blog_gallery, image_name


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

        payload = json.loads(DEFAULT_SOURCE.read_text(encoding='utf-8'))
        source_slugs = {item['slug'] for item in payload['MOCK_BLOG_POSTS']}
        self.assertTrue(PHOTO_SLUGS <= source_slugs)
        self.assertFalse(DELETE_SLUGS & source_slugs)
        self.assertEqual(len(payload['MOCK_BLOG_POSTS']), 720)

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
