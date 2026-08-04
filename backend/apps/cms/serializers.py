from rest_framework import serializers
from .models import Author, Blog, FAQ, Banner, Partner, Settings, Page, Menu

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'name', 'avatar', 'bio')

class BlogSerializer(serializers.ModelSerializer):
    author_detail = AuthorSerializer(source='author', read_only=True)

    class Meta:
        model = Blog
        fields = ('id', 'author', 'author_detail', 'title', 'slug', 'content', 'main_image', 'published_at', 'tags', 'seo_title', 'seo_description')

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
