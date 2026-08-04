from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
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
