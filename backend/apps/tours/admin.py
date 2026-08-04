from django.contrib import admin
from .models import Category, Tour, TourImage, TourPackage, Hotel, HotelImage, Room, Vehicle, Review, Wishlist

class TourImageInline(admin.TabularInline):
    model = TourImage
    extra = 2

class TourPackageInline(admin.TabularInline):
    model = TourPackage
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'city', 'base_price', 'difficulty', 'featured', 'is_active')
    list_filter = ('category', 'city', 'difficulty', 'featured', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [TourImageInline, TourPackageInline]

@admin.register(TourPackage)
class TourPackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'tour', 'start_date', 'end_date', 'price_per_person', 'available_spots', 'status')
    list_filter = ('status', 'start_date', 'tour')

class HotelImageInline(admin.TabularInline):
    model = HotelImage
    extra = 2

class RoomInline(admin.TabularInline):
    model = Room
    extra = 2

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'star_rating', 'featured')
    list_filter = ('city', 'star_rating', 'featured')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [HotelImageInline, RoomInline]

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'hotel', 'price_per_night', 'capacity', 'quantity_available')
    list_filter = ('hotel', 'capacity')

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'price_per_day', 'capacity')
    list_filter = ('type', 'capacity')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'rating', 'approved', 'tour', 'hotel', 'created_at')
    list_filter = ('rating', 'approved', 'created_at')
    actions = ['approve_reviews']

    def approve_reviews(self, request, queryset):
        queryset.update(approved=True)

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'tour', 'created_at')
