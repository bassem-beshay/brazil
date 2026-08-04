from django.urls import path
from .views import AIRecommendationView, AIChatView

urlpatterns = [
    path('recommend/', AIRecommendationView.as_view(), name='ai_recommend'),
    path('chat/', AIChatView.as_view(), name='ai_chat'),
]
