from django.db import models
from django.conf import settings
from apps.core.models import BaseModel
from apps.destinations.models import City

class Category(BaseModel):
    name = models.CharField(max_value=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_value=50, help_name="FontAwesome icon class name e.g. fa-hiking")
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Tour(BaseModel):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )
    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='tours')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='tours')
    name = models.CharField(max_value=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    duration_days = models.PositiveIntegerField(default=1)
    duration_hours = models.PositiveIntegerField(default=0)
    difficulty = models.CharField(max_value=10, choices=DIFFICULTY_CHOICES, default='easy')
    max_group_size = models.PositiveIntegerField(default=15)
    
    inclusions = models.JSONField(default=list, blank=True, help_text="List of items included in the tour")
    exclusions = models.JSONField(default=list, blank=True, help_text="List of items excluded from the tour")
    itinerary = models.JSONField(default=list, blank=True, help_text="List of itinerary days: [{'day': 1, 'title': '...', 'description': '...'}]")
    
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # SEO configs
    seo_title = models.CharField(max_value=150, blank=True, null=True)
    seo_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class TourImage(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='tours/')
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.tour.name}"

class TourPackage(BaseModel):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('full', 'Full'),
        ('cancelled', 'Cancelled'),
    )
    
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='packages')
    title = models.CharField(max_value=150)
    start_date = models.DateField()
    end_date = models.DateField()
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2)
    available_spots = models.PositiveIntegerField()
    status = models.CharField(max_value=15, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.title} ({self.start_date} to {self.end_date})"

class Hotel(BaseModel):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='hotels')
    name = models.CharField(max_value=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    address = models.CharField(max_value=255)
    star_rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.0)
    amenities = models.JSONField(default=list, blank=True, help_text="List of amenities: ['Pool', 'WiFi', 'Spa']")
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class HotelImage(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='hotels/')
    is_primary = models.BooleanField(default=False)

class Room(BaseModel):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_value=150)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.PositiveIntegerField(default=2)
    quantity_available = models.PositiveIntegerField(default=5)
    amenities = models.JSONField(default=list, blank=True)
    images = models.JSONField(default=list, blank=True, help_text="List of image URLs or upload references")

    def __str__(self):
        return f"{self.name} - {self.hotel.name}"

class Vehicle(BaseModel):
    TYPE_CHOICES = (
        ('sedan', 'Luxury Sedan'),
        ('van', 'Passenger Van'),
        ('bus', 'Mini Bus'),
        ('boat', 'Speed Boat/Catamaran'),
    )
    
    name = models.CharField(max_value=100)
    type = models.CharField(max_value=15, choices=TYPE_CHOICES, default='sedan')
    description = models.TextField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.PositiveIntegerField(default=4)
    images = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

class Review(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField()
    approved = models.BooleanField(default=True)
    
    # Explicit FKs (Clean & fast indexing)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')

    def __str__(self):
        return f"Review by {self.user.email} - Rating: {self.rating}"

class Wishlist(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='wished_by')

    class Meta:
        unique_together = ('user', 'tour')

    def __str__(self):
        return f"{self.user.email} wants {self.tour.name}"
