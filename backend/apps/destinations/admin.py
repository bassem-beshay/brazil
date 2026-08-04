from django.contrib import admin
from .models import Country, City, Destination

class CityInline(admin.TabularInline):
    model = City
    prepopulated_fields = {'slug': ('name',)}
    extra = 1

class DestinationInline(admin.TabularInline):
    model = Destination
    prepopulated_fields = {'slug': ('name',)}
    extra = 1

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'featured', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [CityInline]

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'featured')
    list_filter = ('country', 'featured')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [DestinationInline]

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'featured')
    list_filter = ('city__country', 'city', 'featured')
    prepopulated_fields = {'slug': ('name',)}
