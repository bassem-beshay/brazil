import json

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Author, Blog, FAQ, Banner, Partner, Settings, Page, Menu
from .serializers import (
    AuthorSerializer, BlogSerializer, FAQSerializer, BannerSerializer,
    PartnerSerializer, SettingsSerializer, PageSerializer, MenuSerializer
)


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class BlogViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = Blog.objects.all().order_by('-published_at', '-created_at')
    serializer_class = BlogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['author', 'tags']
    search_fields = ['title', 'content']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
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
        snapshot = Settings.objects.filter(key='site_content_snapshot').first()
        if not snapshot:
            return Response({"detail": "Site content snapshot is not available."}, status=status.HTTP_404_NOT_FOUND)
        try:
            return Response(json.loads(snapshot.value))
        except Exception:
            return Response({"detail": "Stored snapshot is invalid."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MenuViewSet(viewsets.ModelViewSet):
    serializer_class = MenuSerializer

    def get_queryset(self):
        # Fetch only root menus (parent is None) to start building trees
        if self.action == 'list':
            return Menu.objects.filter(parent=None).order_by('order')
        return Menu.objects.all().order_by('order')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
