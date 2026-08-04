from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet, CityViewSet, DestinationViewSet

router = DefaultRouter()
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'landmarks', DestinationViewSet, basename='landmark')

urlpatterns = [
    path('', include(router.urls)),
]
