from collections import Counter

from django.db import connection
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Author, Banner, Blog, FAQ, Menu, Page, Partner, Settings
from .serializers import (
    AuthorSerializer,
    BannerSerializer,
    BlogDetailSerializer,
    BlogSerializer,
    BlogSummarySerializer,
    FAQSerializer,
    MenuSerializer,
    PageSerializer,
    PartnerSerializer,
    SettingsSerializer,
)
from .site_content import build_site_content


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class BlogViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = Blog.objects.select_related('author').all().order_by(
        '-published_at', 'display_order', 'slug'
    )
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['author']
    search_fields = ['title', 'excerpt', 'content', 'tags']

    def get_serializer_class(self):
        if self.action in {'list', 'overview'}:
            return BlogSummarySerializer
        if self.action == 'retrieve':
            return BlogDetailSerializer
        return BlogSerializer

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        exclude_slug = self.request.query_params.get('exclude_slug', '').strip()
        if exclude_slug:
            queryset = queryset.exclude(slug=exclude_slug)
        tag = self.request.query_params.get('tag', '').strip()
        if not tag:
            return queryset
        if connection.vendor == 'postgresql':
            return queryset.filter(tags__contains=[tag])
        matching_ids = [pk for pk, tags in queryset.values_list('pk', 'tags') if tag in (tags or [])]
        return queryset.filter(pk__in=matching_ids)

    @action(detail=False, methods=['get'])
    def overview(self, request):
        queryset = self.get_queryset()
        featured = queryset.filter(featured=True).first() or queryset.first()
        tag_counts = Counter()
        for tags in queryset.values_list('tags', flat=True):
            tag_counts.update(tags or [])
        return Response({
            'featured': BlogSummarySerializer(featured, context={'request': request}).data if featured else None,
            'popular_tags': [tag for tag, _count in tag_counts.most_common(8)],
            'count': queryset.count(),
        })

    @action(detail=False, methods=['get'])
    def sitemap(self, request):
        items = self.get_queryset().values('slug', 'published_at', 'updated_at')
        return Response(list(items))

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'overview', 'sitemap']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.filter(is_active=True).order_by('order')
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(active=True).order_by('order')
    serializer_class = BannerSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.filter(active=True).order_by('order')
    serializer_class = PartnerSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class PageViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = Page.objects.filter(is_active=True)
    serializer_class = PageSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class SiteContentView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(build_site_content())


class MenuViewSet(viewsets.ModelViewSet):
    serializer_class = MenuSerializer

    def get_queryset(self):
        if self.action == 'list':
            return Menu.objects.filter(parent=None).order_by('order')
        return Menu.objects.all().order_by('order')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
