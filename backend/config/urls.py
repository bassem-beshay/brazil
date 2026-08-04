from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.core.admin_views import admin_analytics_view, export_bookings_excel, export_financial_pdf

urlpatterns = [
    path('admin/analytics/', admin_analytics_view, name='admin_analytics'),
    path('admin/analytics/export/excel/', export_bookings_excel, name='admin_analytics_export_excel'),
    path('admin/analytics/export/pdf/', export_financial_pdf, name='admin_analytics_export_pdf'),
    path('admin/', admin.site.urls),
    
    # OpenAPI Swagger Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # App API routes
    path('api/auth/', include('apps.users.urls')),
    path('api/destinations/', include('apps.destinations.urls')),
    path('api/tours/', include('apps.tours.urls')),
    path('api/bookings/', include('apps.bookings.urls')),
    path('api/cms/', include('apps.cms.urls')),
    path('api/ai/', include('apps.ai.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
