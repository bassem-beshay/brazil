from rest_framework import serializers
from .models import Author, Blog, FAQ, Banner, Partner, Settings, Page, Menu
from .site_content import blog_gallery, image_name

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'name', 'avatar', 'bio')

class BlogSerializer(serializers.ModelSerializer):
    author_detail = AuthorSerializer(source='author', read_only=True)
    image_credit = serializers.CharField(
        source='main_image_credit', required=False, allow_blank=True
    )
    image_source_url = serializers.URLField(
        source='main_image_source_url', required=False, allow_blank=True
    )

    def validate_gallery(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Gallery must be a list of image objects.')

        normalized = []
        for index, image in enumerate(value):
            if isinstance(image, str):
                image = {'url': image, 'credit': '', 'source_url': ''}
            if not isinstance(image, dict):
                raise serializers.ValidationError(
                    f'Gallery item {index} must be an object or a legacy image URL.'
                )

            url = str(image.get('url') or '').strip()
            if not url:
                raise serializers.ValidationError(f'Gallery item {index} requires a URL.')

            source_url = str(image.get('source_url') or '').strip()
            if source_url:
                try:
                    serializers.URLField().run_validation(source_url)
                except serializers.ValidationError as exc:
                    raise serializers.ValidationError(
                        f'Gallery item {index} has an invalid source URL.'
                    ) from exc

            normalized_image = {
                'url': url,
                'credit': str(image.get('credit') or '').strip(),
                'source_url': source_url,
            }
            for optional_key in ('alt', 'caption'):
                optional_value = str(image.get(optional_key) or '').strip()
                if optional_value:
                    normalized_image[optional_key] = optional_value
            normalized.append(normalized_image)
        return normalized

    class Meta:
        model = Blog
        fields = (
            'id', 'author', 'author_detail', 'title', 'slug', 'content', 'excerpt',
            'category', 'main_image', 'image_credit', 'image_source_url',
            'gallery', 'published_at', 'published_label', 'read_time', 'featured',
            'tags', 'seo_title', 'seo_description',
        )


class BlogSummarySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    cover_image_alt = serializers.SerializerMethodField()
    image_credit = serializers.CharField(source='main_image_credit')
    image_source_url = serializers.CharField(source='main_image_source_url')
    author = serializers.SerializerMethodField()
    published_at = serializers.SerializerMethodField()
    published_at_iso = serializers.SerializerMethodField()

    def get_id(self, obj):
        return obj.source_id or str(obj.pk)

    def get_cover_image(self, obj):
        return image_name(obj.main_image)

    def get_cover_image_alt(self, obj):
        return obj.title

    def get_author(self, obj):
        return {
            'name': obj.author.name,
            'role': obj.author.bio or '',
            'avatar': image_name(obj.author.avatar),
        }

    def get_published_at(self, obj):
        if obj.published_label:
            return obj.published_label
        return obj.published_at.date().isoformat() if obj.published_at else ''

    def get_published_at_iso(self, obj):
        return obj.published_at.isoformat() if obj.published_at else None

    class Meta:
        model = Blog
        fields = (
            'id', 'title', 'slug', 'excerpt', 'cover_image', 'cover_image_alt',
            'image_credit', 'image_source_url', 'category', 'author',
            'published_at', 'published_at_iso', 'read_time', 'tags', 'featured', 'seo_title',
            'seo_description', 'updated_at',
        )


class BlogDetailSerializer(BlogSummarySerializer):
    gallery = serializers.SerializerMethodField()

    def get_gallery(self, obj):
        return blog_gallery(obj.gallery)

    class Meta(BlogSummarySerializer.Meta):
        fields = BlogSummarySerializer.Meta.fields + ('content', 'gallery')

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ('id', 'question', 'answer', 'category', 'is_active', 'order')

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'title', 'subtitle', 'image', 'link', 'active', 'order')

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ('id', 'name', 'logo', 'website', 'active', 'order')

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ('key', 'value', 'description')

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ('id', 'title', 'slug', 'content', 'is_active')

class MenuSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = ('id', 'title', 'url', 'parent', 'order', 'children')

    def get_children(self, obj):
        # Nested navigation tree
        children_queryset = obj.children.all().order_by('order')
        return MenuSerializer(children_queryset, many=True).data
