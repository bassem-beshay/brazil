from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, CouponViewSet, StripeWebhookView

router = DefaultRouter()
router.register(r'coupons', CouponViewSet, basename='coupon')
router.register(r'checkout', BookingViewSet, basename='checkout')

urlpatterns = [
    path('webhook/stripe/', StripeWebhookView.as_view(), name='stripe_webhook'),
    path('', include(router.urls)),
]
