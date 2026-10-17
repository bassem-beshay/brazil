from django.contrib import admin

from .models import (
    Author,
    Banner,
    Blog,
    FAQ,
    Menu,
    Office,
    Page,
    Partner,
    Settings,
    SiteProfile,
    TeamMember,
    Testimonial,
)


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'featured', 'published_at', 'display_order')
    list_filter = ('category', 'author', 'featured', 'published_at')
    search_fields = ('title', 'content', 'excerpt')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'source_category', 'is_active', 'order')
    list_filter = ('source_category', 'category', 'is_active')
    search_fields = ('question', 'answer')


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
    list_display = ('title', 'slug', 'is_active')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Office)
class OfficeAdmin(admin.ModelAdmin):
    list_display = ('city', 'country', 'phone', 'email', 'is_headquarters', 'is_active', 'order')
    list_filter = ('country', 'is_headquarters', 'is_active')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'is_active', 'order')
    list_filter = ('is_active',)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author', 'title', 'rating', 'tour_name', 'is_active', 'order')
    list_filter = ('rating', 'is_active')
    search_fields = ('author', 'title', 'comment', 'tour_name')


@admin.register(SiteProfile)
class SiteProfileAdmin(admin.ModelAdmin):
    list_display = ('blogname', 'siteurl', 'tour_count', 'blog_count', 'page_count')

    def has_add_permission(self, request):
        return not SiteProfile.objects.exists()


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('title', 'url', 'parent', 'order')
    list_filter = ('parent',)
