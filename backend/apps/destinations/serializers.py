from rest_framework import serializers
from .models import Country, City, Destination

class CountrySerializer(serializers.ModelSerializer):
    cities_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Country
        fields = ('id', 'name', 'slug', 'description', 'image', 'featured', 'cities_count', 'seo_title', 'seo_description')

class CitySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)

    class Meta:
        model = City
        fields = ('id', 'country', 'country_name', 'name', 'slug', 'description', 'image', 'lat', 'lng', 'featured')

class DestinationSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    country_name = serializers.CharField(source='city.country.name', read_only=True)

    class Meta:
        model = Destination
        fields = ('id', 'city', 'city_name', 'country_name', 'name', 'slug', 'description', 'main_image', 'lat', 'lng', 'featured')
