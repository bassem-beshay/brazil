from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Tour, Hotel, Vehicle, Review, Wishlist
from .serializers import (
    CategorySerializer, TourSerializer, TourListSerializer,
    HotelSerializer, VehicleSerializer, ReviewSerializer, WishlistSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class TourViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'difficulty', 'featured', 'is_active']
    search_fields = ['name', 'description', 'city__name']
    ordering_fields = ['base_price', 'duration_days', 'created_at']

    def get_queryset(self):
        if self.action in ['list']:
            return Tour.objects.filter(is_active=True).prefetch_related('images', 'reviews')
        return Tour.objects.all().prefetch_related('images', 'packages', 'reviews')

    def get_serializer_class(self):
        if self.action == 'list':
            return TourListSerializer
        return TourSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='wishlist-toggle')
    def wishlist_toggle(self, request, slug=None):
        tour = self.get_object()
        wish_item = Wishlist.objects.filter(user=request.user, tour=tour)
        if wish_item.exists():
            wish_item.delete()
            return Response({"detail": "Removed from wishlist."}, status=status.HTTP_200_OK)
        else:
            Wishlist.objects.create(user=request.user, tour=tour)
            return Response({"detail": "Added to wishlist."}, status=status.HTTP_201_CREATED)

class HotelViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = Hotel.objects.all().prefetch_related('images', 'rooms')
    serializer_class = HotelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['city', 'star_rating', 'featured']
    search_fields = ['name', 'description', 'address']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'capacity']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(approved=True).order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
