from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Notification

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Fields', {'fields': ('phone_number', 'avatar', 'role', 'preferences')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Fields', {
            'classes': ('wide',),
            'fields': ('email', 'phone_number', 'role', 'first_name', 'last_name'),
        }),
    )
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Notification)
