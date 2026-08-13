import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.destinations.models import Country, City, Destination
from apps.tours.models import Category, Tour, TourPackage, Hotel, Room, Vehicle
from apps.bookings.models import Coupon

def seed_db():
    print("Seeding database...")
    
    # 1. Admin Superuser
    if not User.objects.filter(email='admin@girasol.com').exists():
        User.objects.create_superuser(
            email='admin@girasol.com',
            password='adminsecurepassword',
            first_name='Girasol',
            last_name='Admin'
        )
        print("Created Superuser: admin@girasol.com / adminsecurepassword")

    # 2. Coupon
    coupon, _ = Coupon.objects.get_or_create(
        code='BRAZIL2026',
        defaults={
            'discount_type': 'percentage',
            'value': 15.00,
            'active': True,
            'start_date': date.today() - timedelta(days=1),
            'expiry_date': date.today() + timedelta(days=365),
            'max_uses': 100,
            'uses_count': 0
        }
    )
    print("Created Coupon: BRAZIL2026")

    # 3. Country & Cities
    country, _ = Country.objects.get_or_create(
        slug='brazil',
        defaults={
            'name': 'Brazil',
            'description': 'A vibrant tropical paradise of rainforests, beaches, and rich cultural traditions.',
            'featured': True
        }
    )
    
    rio, _ = City.objects.get_or_create(
        slug='rio-de-janeiro',
        defaults={
            'country': country,
            'name': 'Rio de Janeiro',
            'description': 'The Marvelous City, famed for its beaches, mountains, and samba rhythms.',
            'featured': True,
            'lat': -22.9068,
            'lng': -43.1729
        }
    )

    amazon, _ = City.objects.get_or_create(
        slug='amazonas',
        defaults={
            'country': country,
            'name': 'Amazonas',
            'description': 'The heart of the green planet, offering untamed wildlife and river boat excursions.',
            'featured': True,
            'lat': -3.1190,
            'lng': -60.0217
        }
    )
    print("Created Destinations: Brazil, Rio de Janeiro, Amazonas")

    # 4. Categories
    adventure, _ = Category.objects.get_or_create(
        slug='adventure-safaris',
        defaults={
            'name': 'Adventure & Safaris',
            'icon': 'fa-hiking',
            'description': 'Active trekking, river navigation, and wildlife encounters.'
        }
    )

    beach, _ = Category.objects.get_or_create(
        slug='beach-retreats',
        defaults={
            'name': 'Beach & Leisure',
            'icon': 'fa-umbrella-beach',
            'description': 'Luxury resort stays, yacht cruises, and gold sand retreats.'
        }
    )
    print("Created Categories")

    # 5. Tours
    rio_tour, _ = Tour.objects.get_or_create(
        slug='private-rio-helicopter-beach',
        defaults={
            'category': beach,
            'city': rio,
            'name': 'Private Rio Helicopter & Beach Escape',
            'description': 'Take a private helicopter flight over Christ the Redeemer, cruise Copacabana on a catamaran, and relax at a luxurious beachside restaurant.',
            'duration_days': 5,
            'difficulty': 'easy',
            'max_group_size': 8,
            'inclusions': ['Private Helicopter Tour', 'Catamaran Cruise', 'Daily 5-Star Lunch', 'Bilingual Private Guide'],
            'exclusions': ['International Flights', 'Travel Insurance', 'Personal Alcohol Purchases'],
            'itinerary': [
                {'day': 1, 'title': 'Arrival & VIP Transfer', 'description': 'Welcome to Rio. VIP Mercedes transfer to Copacabana Palace hotel.'},
                {'day': 2, 'title': 'Helicopter Ride & Sugarloaf Tour', 'description': 'Private 30-min helicopter flight followed by gourmet mountain lunch.'},
                {'day': 3, 'title': 'Catamaran Sailing & Secret Beaches', 'description': 'Private yacht charter across Guanabara Bay with champagne.'}
            ],
            'base_price': 2490.00,
            'featured': True
        }
    )

    amazon_tour, _ = Tour.objects.get_or_create(
        slug='luxury-amazon-jungle-lodge',
        defaults={
            'category': adventure,
            'city': amazon,
            'name': 'Luxury Amazon Jungle Lodge Expedition',
            'description': 'Stay in custom treehouses with high-end amenities, navigate the black waters of Rio Negro, and discover jaguar habitats alongside local rangers.',
            'duration_days': 7,
            'difficulty': 'medium',
            'max_group_size': 12,
            'inclusions': ['Treehouse Lodge Stay', 'All Jungle Meals', 'River Boat Navigation', 'Indigenous Guided Trekking'],
            'exclusions': ['Bar expenses', 'Tips for rangers'],
            'itinerary': [
                {'day': 1, 'title': 'Deep Forest Cruise', 'description': 'Speedboat transit into the heart of the reserve.'},
                {'day': 2, 'title': 'Nocturnal Alligator Spotting', 'description': 'Search for caimans and tree frogs with expert rangers.'}
            ],
            'base_price': 3800.00,
            'featured': True
        }
    )
    print("Created Tours catalog")

    # 6. Packages (Dates)
    TourPackage.objects.get_or_create(
        tour=rio_tour,
        title='Spring Premium Departure',
        defaults={
            'start_date': date.today() + timedelta(days=30),
            'end_date': date.today() + timedelta(days=35),
            'price_per_person': 2490.00,
            'available_spots': 8,
            'status': 'active'
        }
    )

    TourPackage.objects.get_or_create(
        tour=amazon_tour,
        title='Dry Season Explorer',
        defaults={
            'start_date': date.today() + timedelta(days=60),
            'end_date': date.today() + timedelta(days=67),
            'price_per_person': 3800.00,
            'available_spots': 12,
            'status': 'active'
        }
    )
    print("Created Departure Packages")

    # 7. Hotel & Rooms
    hotel, _ = Hotel.objects.get_or_create(
        slug='copacabana-palace-resort',
        defaults={
            'city': rio,
            'name': 'Belmond Copacabana Palace Resort',
            'description': 'The historic legendary hotel of Rio, defining luxury and elegance on the seafront.',
            'address': 'Av. Atlântica, 1702 - Copacabana',
            'star_rating': 5.0,
            'amenities': ['Pool', 'Spa', 'WiFi', 'Beach Service', 'Michelin Star Dining'],
            'featured': True
        }
    )

    Room.objects.get_or_create(
        hotel=hotel,
        name='Deluxe Oceanfront Suite',
        defaults={
            'description': 'Spacious suite overlooking Copacabana Beach, decorated with classical furnishings and artworks.',
            'price_per_night': 450.00,
            'capacity': 2,
            'quantity_available': 4,
            'amenities': ['King Bed', 'Balcony', 'Ocean View', '24h Butler Service']
        }
    )
    print("Created Luxury Hotel & Room units")
    print("Seeding completed successfully!")

if __name__ == '__main__':
    seed_db()
