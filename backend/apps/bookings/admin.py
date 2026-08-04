from django.contrib import admin
from .models import Coupon, Booking, BookingItem, Traveler, Payment, Invoice

class BookingItemInline(admin.TabularInline):
    model = BookingItem
    extra = 0
    readonly_fields = ('item_type', 'tour_package', 'room', 'vehicle', 'start_date', 'end_date', 'quantity', 'unit_price', 'total_price')

class TravelerInline(admin.TabularInline):
    model = Traveler
    extra = 0

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ('transaction_id', 'payment_method', 'amount', 'status')

class InvoiceInline(admin.StackedInline):
    model = Invoice
    extra = 0
    readonly_fields = ('invoice_number', 'pdf_file')

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'value', 'active', 'start_date', 'expiry_date', 'uses_count', 'max_uses')
    list_filter = ('active', 'discount_type', 'start_date', 'expiry_date')
    search_fields = ('code',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'user', 'status', 'total_price', 'discount_amount', 'grand_total', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('booking_reference', 'user__email', 'user__first_name')
    inlines = [BookingItemInline, TravelerInline, PaymentInline, InvoiceInline]
    readonly_fields = ('booking_reference', 'total_price', 'tax_amount', 'discount_amount', 'grand_total')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'booking', 'payment_method', 'amount', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'booking', 'pdf_file', 'created_at')
