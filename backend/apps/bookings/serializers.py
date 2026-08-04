from rest_framework import serializers
from .models import Booking, BookingItem, Traveler, Payment, Coupon, Invoice
from apps.tours.serializers import TourPackageSerializer, RoomSerializer, VehicleSerializer

class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Coupon
        fields = ('id', 'code', 'discount_type', 'value', 'active', 'start_date', 'expiry_date', 'max_uses', 'uses_count', 'is_valid')

class TravelerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traveler
        fields = ('first_name', 'last_name', 'email', 'phone_number', 'passport_number', 'age')

class BookingItemSerializer(serializers.ModelSerializer):
    tour_package_detail = TourPackageSerializer(source='tour_package', read_only=True)
    room_detail = RoomSerializer(source='room', read_only=True)
    vehicle_detail = VehicleSerializer(source='vehicle', read_only=True)

    class Meta:
        model = BookingItem
        fields = (
            'id', 'item_type', 'tour_package', 'tour_package_detail', 'room', 'room_detail', 
            'vehicle', 'vehicle_detail', 'start_date', 'end_date', 'quantity', 'unit_price', 'total_price'
        )

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'transaction_id', 'payment_method', 'amount', 'status', 'created_at')

class InvoiceSerializer(serializers.ModelSerializer):
    pdf_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ('invoice_number', 'pdf_file_url', 'created_at')

    def get_pdf_file_url(self, obj):
        if obj.pdf_file:
            return obj.pdf_file.url
        return None

class BookingSerializer(serializers.ModelSerializer):
    items = BookingItemSerializer(many=True)
    travelers = TravelerSerializer(many=True)
    payments = PaymentSerializer(many=True, read_only=True)
    invoice = InvoiceSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id', 'booking_reference', 'user', 'coupon', 'status', 'total_price', 
            'tax_amount', 'discount_amount', 'grand_total', 'items', 'travelers', 
            'payments', 'invoice', 'notes', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'booking_reference', 'user', 'status', 'total_price', 'tax_amount', 'discount_amount', 'grand_total', 'created_at', 'updated_at')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        travelers_data = validated_data.pop('travelers')
        
        # Calculations will be validated at View level or within clean() before creating Stripe intent
        booking = Booking.objects.create(**validated_data)
        
        for item_data in items_data:
            BookingItem.objects.create(booking=booking, **item_data)
            
        for traveler_data in travelers_data:
            Traveler.objects.create(booking=booking, **traveler_data)
            
        return booking
