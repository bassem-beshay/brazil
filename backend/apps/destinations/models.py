from django.db import models
from apps.core.models import BaseModel

class Country(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='countries/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    
    # SEO configurations
    seo_title = models.CharField(max_length=150, blank=True, null=True)
    seo_description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Countries"
        ordering = ['name']

    def __str__(self):
        return self.name

class City(BaseModel):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='cities/', blank=True, null=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    featured = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Cities"
        ordering = ['name']

    def __str__(self):
        return f"{self.name}, {self.country.name}"

class Destination(BaseModel):
    source_id = models.CharField(max_length=100, blank=True, default='')
    display_order = models.PositiveIntegerField(default=0)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='destinations')
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=255, unique=True)
    region = models.CharField(max_length=100, blank=True, default='')
    tagline = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField()
    main_image = models.ImageField(upload_to='destinations/')
    gallery = models.JSONField(default=list, blank=True)
    best_time_to_visit = models.CharField(max_length=150, blank=True, default='')
    ideal_duration = models.CharField(max_length=100, blank=True, default='')
    language = models.CharField(max_length=150, blank=True, default='')
    currency = models.CharField(max_length=100, blank=True, default='')
    highlights = models.JSONField(default=list, blank=True)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.city.name})"
