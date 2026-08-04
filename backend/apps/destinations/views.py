from rest_framework import viewsets, permissions
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Country, City, Destination
from .serializers import CountrySerializer, CitySerializer, DestinationSerializer

class CountryViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    serializer_class = CountrySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['featured']

    def get_queryset(self):
        return Country.objects.annotate(cities_count=Count('cities'))

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class CityViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['featured', 'country']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class DestinationViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['featured', 'city']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
