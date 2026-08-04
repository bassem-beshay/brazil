from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from apps.tours.models import Tour
from apps.tours.serializers import TourListSerializer
from apps.destinations.models import City
import random

class AIRecommendationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Receives interests (list), max_budget (decimal), duration_days (int), difficulty (str), city_id (int)
        and queries matching tours to recommend a custom trip package.
        """
        interests = request.data.get('interests', []) # e.g. ['adventure', 'nature', 'luxury']
        max_budget = request.data.get('max_budget')
        duration_days = request.data.get('duration_days')
        difficulty = request.data.get('difficulty')
        city_id = request.data.get('city_id')

        tours = Tour.objects.filter(is_active=True)

        if city_id:
            tours = tours.filter(city_id=city_id)
        if difficulty:
            tours = tours.filter(difficulty=difficulty)
        if duration_days:
            tours = tours.filter(duration_days__lte=int(duration_days))
        if max_budget:
            tours = tours.filter(base_price__lte=float(max_budget))

        # Filter by interests (category name matching or text matching)
        if interests:
            # Simple matching: check if name/description contains interests
            matched_tours = []
            for tour in tours:
                tour_text = f"{tour.name} {tour.description} {tour.category.name if tour.category else ''}".lower()
                if any(interest.lower() in tour_text for interest in interests):
                    matched_tours.append(tour)
            # Fallback to general list if no matches
            if len(matched_tours) > 0:
                tours = matched_tours
            else:
                tours = list(tours)
        else:
            tours = list(tours)

        # Randomize slightly for dynamic feel
        recommended_tours = random.sample(tours, min(3, len(tours)))

        serialized = TourListSerializer(recommended_tours, many=True)
        
        # Calculate summary values
        total_days = sum(t.duration_days for t in recommended_tours)
        total_price = sum(t.base_price for t in recommended_tours)

        return Response({
            "recommendations": serialized.data,
            "itinerary_summary": {
                "total_estimated_price": total_price,
                "total_duration_days": total_days,
                "travel_style": "Custom AI Curated Package",
                "custom_notes": "We've combined these tours to make the ultimate holiday package based on your preferences. Inclusions: local guide guides, transportation transfers, and base hotels access."
            }
        }, status=status.HTTP_200_OK)

class AIChatView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Contextual AI Chat assistant responding about Brazilian travel.
        """
        message = request.data.get('message', '').strip().lower()
        if not message:
            return Response({"response": "Please enter a message. How can I help you plan your South American luxury tour today?"}, status=status.HTTP_400_BAD_REQUEST)

        # Build responses based on database content dynamically
        response_text = ""
        cities = list(City.objects.all())
        tours = list(Tour.objects.filter(featured=True))

        if "rio" in message:
            response_text = "Rio de Janeiro is famous for Copacabana, Christ the Redeemer, and Sugarloaf Mountain. "
            rio_tours = [t for t in tours if "rio" in t.name.lower() or "rio" in t.city.name.lower()]
            if rio_tours:
                response_text += f"We highly recommend booking our featured tour: '{rio_tours[0].name}' starting from ${rio_tours[0].base_price}."
            else:
                response_text += "Check out our featured tours page to see active packages in Rio!"
                
        elif "amazon" in message or "jungle" in message or "forest" in message:
            response_text = "The Amazon rainforest offers incredible biodiversity. You can stay in luxury jungle lodges, take riverboat tours, and spot pink river dolphins. "
            amazon_tours = [t for t in tours if "amazon" in t.name.lower()]
            if amazon_tours:
                response_text += f"Take a look at '{amazon_tours[0].name}' (Base Price: ${amazon_tours[0].base_price}) for an unforgettable experience."
            else:
                response_text += "We offer premium guided jungle safaris and river cruise packages."

        elif "booking" in message or "payment" in message or "cancel" in message:
            response_text = "Booking is easy: simply add your desired tours, hotels, and airport transfers to your cart, and complete our secure Stripe checkout. You'll receive a detailed PDF invoice via email instantly. For cancellations, check your customer dashboard or contact support."

        else:
            city_list = ", ".join([c.name for c in cities]) if cities else "Rio, Amazon, Salvador, and Iguazu Falls"
            response_text = f"Welcome to Girasol Luxury Tours! I am your AI Travel Assistant. I can recommend destinations like {city_list}, detail our pricing structure, or compile a custom package. What would you like to explore?"

        return Response({
            "response": response_text,
            "suggested_questions": [
                "Suggest a tour in Rio de Janeiro",
                "Tell me about Amazon jungle packages",
                "How do payments and invoices work?"
            ]
        }, status=status.HTTP_200_OK)
