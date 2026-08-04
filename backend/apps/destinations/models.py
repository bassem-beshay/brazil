from django.db import models
from apps.core.models import BaseModel

class Country(BaseModel):
    name = models.CharField(max_value=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='countries/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    
    # SEO configurations
    seo_title = models.CharField(max_value=150, blank=True, null=True)
    seo_description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Countries"
        ordering = ['name']

    def __str__(self):
        return self.name

class City(BaseModel):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')
    name = models.CharField(max_value=100)
    slug = models.SlugField(unique=True)
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
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='destinations')
    name = models.CharField(max_value=150)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    main_image = models.ImageField(upload_to='destinations/')
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.city.name})"
