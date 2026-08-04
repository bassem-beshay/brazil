from django.contrib import admin
from .models import Author, Blog, FAQ, Banner, Partner, Settings, Page, Menu

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published_at', 'created_at')
    list_filter = ('author', 'published_at')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active', 'order')
    list_filter = ('category', 'is_active')

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'active', 'order')
    list_filter = ('active',)

@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'active', 'order')
    list_filter = ('active',)

@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ('key', 'description')

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('title', 'url', 'parent', 'order')
    list_filter = ('parent',)
