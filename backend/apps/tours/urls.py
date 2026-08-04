from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TourViewSet, HotelViewSet, VehicleViewSet, ReviewViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tours', TourViewSet, basename='tour')
router.register(r'hotels', HotelViewSet, basename='hotel')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
]
