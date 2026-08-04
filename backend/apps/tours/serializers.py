from rest_framework import serializers
from django.db.models import Avg
from django.contrib.auth import get_user_model
from .models import Category, Tour, TourImage, TourPackage, Hotel, HotelImage, Room, Vehicle, Review, Wishlist
from apps.destinations.serializers import CitySerializer

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'icon', 'description')

class TourImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourImage
        fields = ('id', 'image', 'is_primary')

class TourPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourPackage
        fields = ('id', 'title', 'start_date', 'end_date', 'price_per_person', 'available_spots', 'status')

class ReviewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'avatar')

class ReviewSerializer(serializers.ModelSerializer):
    user = ReviewUserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'rating', 'comment', 'approved', 'tour', 'hotel', 'created_at')
        read_only_fields = ('id', 'user', 'approved', 'created_at')

class TourSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    city_detail = CitySerializer(source='city', read_only=True)
    images = TourImageSerializer(many=True, read_only=True)
    packages = TourPackageSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Tour
        fields = (
            'id', 'category', 'category_name', 'city', 'city_detail', 'name', 'slug', 
            'description', 'duration_days', 'duration_hours', 'difficulty', 
            'max_group_size', 'inclusions', 'exclusions', 'itinerary', 
            'base_price', 'featured', 'is_active', 'images', 'packages', 
            'average_rating', 'reviews', 'seo_title', 'seo_description'
        )

    def get_average_rating(self, obj):
        result = obj.reviews.filter(approved=True).aggregate(Avg('rating'))
        return result['rating__avg'] or 5.0

class TourListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = (
            'id', 'category_name', 'city_name', 'name', 'slug', 'duration_days', 
            'difficulty', 'base_price', 'featured', 'primary_image', 'average_rating'
        )

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return primary.image.url
        first = obj.images.first()
        return first.image.url if first else None

    def get_average_rating(self, obj):
        result = obj.reviews.filter(approved=True).aggregate(Avg('rating'))
        return result['rating__avg'] or 5.0

class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = ('id', 'image', 'is_primary')

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'name', 'description', 'price_per_night', 'capacity', 'quantity_available', 'amenities', 'images')

class HotelSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    images = HotelImageSerializer(many=True, read_only=True)
    rooms = RoomSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = ('id', 'city', 'city_name', 'name', 'slug', 'description', 'address', 'star_rating', 'amenities', 'featured', 'images', 'rooms', 'average_rating')

    def get_average_rating(self, obj):
        result = obj.reviews.filter(approved=True).aggregate(Avg('rating'))
        return result['rating__avg'] or obj.star_rating

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ('id', 'name', 'type', 'description', 'price_per_day', 'capacity', 'images')

class WishlistSerializer(serializers.ModelSerializer):
    tour_detail = TourListSerializer(source='tour', read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'tour', 'tour_detail', 'created_at')
        read_only_fields = ('id', 'created_at')
