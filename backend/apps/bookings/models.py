import uuid
from django.db import models
from django.conf import settings
from apps.core.models import BaseModel
from apps.tours.models import TourPackage, Room, Vehicle

class Coupon(BaseModel):
    DISCOUNT_TYPE_CHOICES = (
        ('percentage', 'Percentage (%)'),
        ('fixed', 'Fixed Amount ($)'),
    )
    
    code = models.CharField(max_value=50, unique=True)
    discount_type = models.CharField(max_value=15, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    active = models.BooleanField(default=True)
    start_date = models.DateField()
    expiry_date = models.DateField()
    max_uses = models.PositiveIntegerField(default=100)
    uses_count = models.PositiveIntegerField(default=0)

    def is_valid(self):
        from django.utils import timezone
        today = timezone.localdate()
        return self.active and self.start_date <= today <= self.expiry_date and self.uses_count < self.max_uses

    def __str__(self):
        return f"{self.code} - {self.value} ({self.discount_type})"

class Booking(BaseModel):
    STATUS_CHOICES = (
        ('pending', 'Pending Payment'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )
    
    booking_reference = models.CharField(max_value=50, unique=True, default=uuid.uuid4)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    status = models.CharField(max_value=15, choices=STATUS_CHOICES, default='pending')
    
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking {self.booking_reference} ({self.get_status_display()})"

class BookingItem(models.Model):
    ITEM_TYPE_CHOICES = (
        ('tour_package', 'Tour Package'),
        ('room', 'Hotel Room'),
        ('vehicle', 'Vehicle Rental'),
    )
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='items')
    item_type = models.CharField(max_value=15, choices=ITEM_TYPE_CHOICES)
    
    # FKs (Nullable, depending on what type of item is added)
    tour_package = models.ForeignKey(TourPackage, on_delete=models.SET_NULL, null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    
    start_date = models.DateField()
    end_date = models.DateField()
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item {self.item_type} for Booking {self.booking.booking_reference}"

class Traveler(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='travelers')
    first_name = models.CharField(max_value=100)
    last_name = models.CharField(max_value=100)
    email = models.EmailField()
    phone_number = models.CharField(max_value=30, blank=True, null=True)
    passport_number = models.CharField(max_value=50, blank=True, null=True)
    age = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.booking.booking_reference})"

class Payment(BaseModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    transaction_id = models.CharField(max_value=100, unique=True)
    payment_method = models.CharField(max_value=30, default='stripe')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_value=15, choices=STATUS_CHOICES, default='pending')
    response_data = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Payment {self.transaction_id} ({self.get_status_display()})"

class Invoice(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='invoice')
    invoice_number = models.CharField(max_value=100, unique=True)
    pdf_file = models.FileField(upload_to='invoices/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number
