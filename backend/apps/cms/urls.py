from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthorViewSet, BlogViewSet, FAQViewSet, BannerViewSet,
    PartnerViewSet, SettingsViewSet, PageViewSet, MenuViewSet
)

router = DefaultRouter()
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'blogs', BlogViewSet, basename='blog')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'banners', BannerViewSet, basename='banner')
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'settings', SettingsViewSet, basename='setting')
router.register(r'pages', PageViewSet, basename='page')
router.register(r'menus', MenuViewSet, basename='menu')

urlpatterns = [
    path('', include(router.urls)),
]
