import json
from django.utils.deprecation import MiddlewareMixin
from .models import AuditLog

class AuditLogMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # We only log modifications (POST, PUT, PATCH, DELETE) and avoid logging logging in/out pages to prevent noise, 
        # but you can log anything. Let's restrict it to non-safe methods or admin routes.
        if request.method not in ('GET', 'HEAD', 'OPTIONS', 'TRACE'):
            # Don't log stripe webhook responses or raw binary uploads in details to keep db clean
            if '/webhook/' in request.path or '/media/' in request.path:
                details = {"path": request.path, "status_code": response.status_code}
            else:
                details = {
                    "path": request.path,
                    "method": request.method,
                    "status_code": response.status_code,
                    "query_params": dict(request.GET.items()),
                }

            user = request.user if request.user.is_authenticated else None
            
            # Fetch remote IP address
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0].strip()
            else:
                ip = request.META.get('REMOTE_ADDR')

            AuditLog.objects.create(
                user=user,
                action=f"{request.method} {request.path}",
                details=details,
                ip_address=ip
            )

        return response
