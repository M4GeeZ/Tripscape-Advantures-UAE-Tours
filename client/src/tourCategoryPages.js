import { helicopters, tourCatalog } from './data'

const byCategory = (category) => tourCatalog.filter((tour) => tour.category === category)

const aerialTours = helicopters.map((tour, index) => ({
  id: `aerial-${index + 1}`,
  category: 'Aerial Experiences',
  image: tour.image,
  title: tour.title,
  description: tour.copy,
  duration: tour.duration,
  location: 'Dubai, UAE',
  price: tour.price,
  unit: tour.unit ? `/${tour.unit.toLowerCase().replace('per ', '')}` : '',
  rating: '4.9',
  reviews: 0
}))

const cruiseTours = [
  ...byCategory('Cruises'),
  {
    id: 'cruise-marina-sunset',
    category: 'Cruises',
    image: '/images/heli-marina.webp',
    title: 'Dubai Marina Sunset Cruise',
    description: 'Relaxed sunset sailing through Dubai Marina with skyline views.',
    duration: '2 hours',
    location: 'Dubai Marina, UAE',
    price: 'Contact for price',
    unit: '',
    rating: '4.9',
    reviews: 0
  },
  {
    id: 'cruise-creek-dinner',
    category: 'Cruises',
    image: '/images/city-old-dubai.webp',
    title: 'Dubai Creek Dhow Cruise with Dinner',
    description: 'Traditional dhow cruise through Old Dubai with dinner and evening views.',
    duration: '2 hours',
    location: 'Dubai Creek, UAE',
    price: 'Contact for price',
    unit: '',
    rating: '4.9',
    reviews: 0
  },
  {
    id: 'cruise-yacht',
    category: 'Cruises',
    image: '/images/heli-palm.webp',
    title: 'Private Dubai Marina Yacht Cruise',
    description: 'Private yacht experience for couples, families and small groups.',
    duration: '2 hours',
    location: 'Dubai Marina, UAE',
    price: 'Contact for price',
    unit: '',
    rating: '4.9',
    reviews: 0
  }
]

const waterTours = [
  ...byCategory('Water Activities'),
  {
    id: 'water-parasailing',
    category: 'Water Activities',
    image: '/images/heli-palm.webp',
    title: 'Dubai Parasailing Experience',
    description: 'Take in the coastline from above on a guided parasailing session.',
    duration: '15 minutes',
    location: 'Dubai, UAE',
    price: 'Contact for price',
    unit: '',
    rating: '4.9',
    reviews: 0
  }
]

const packageTours = [
  {
    id: 'package-dubai-essentials',
    category: 'Packages',
    image: '/images/city-02-dubai-burj-khalifa.webp',
    title: 'Dubai Essentials Package',
    description: 'A curated Dubai combination covering city highlights and a desert experience.',
    duration: '2 days',
    location: 'Dubai, UAE',
    price: 'Contact for price',
    unit: '',
    rating: '4.9',
    reviews: 0
  },
  {
    id: 'package-desert-city',
    category: 'Packages',
    image: '/images/hero-camp.webp',
    title: 'Desert Safari + Dubai City Tour',
    description: 'Pair a guided Dubai city tour with an evening desert safari experience.',
    duration: '2 days',
    location: 'Dubai, UAE',
    price: 'Contact for price',
    unit: '',
    rating: '4.9',
    reviews: 0
  },
  {
    id: 'package-dubai-abudhabi',
    category: 'Packages',
    image: '/images/city-03-abu-dhabi.webp',
    title: 'Dubai + Abu Dhabi Highlights',
    description: 'Discover signature landmarks across Dubai and Abu Dhabi in one easy itinerary.',
    duration: '3 days',
    location: 'Dubai & Abu Dhabi, UAE',
    price: 'Contact for price',
    unit: '',
    rating: '4.9',
    reviews: 0
  },
  {
    id: 'package-family',
    category: 'Packages',
    image: '/images/attraction-card-06.jpg',
    title: 'Family UAE Experience Package',
    description: 'A flexible family-friendly mix of attractions, sightseeing and desert time.',
    duration: '3 days',
    location: 'UAE',
    price: 'Contact for price',
    unit: '',
    rating: '4.9',
    reviews: 0
  }
]

export const tourCategoryPages = {
  'desert-safari': {
    name: 'Desert Safari',
    eyebrow: 'Desert safari',
    heroTitle: 'Dubai desert safari experiences',
    heroCopy: 'Choose from morning, evening, VIP and overnight desert safari experiences across Dubai.',
    heroImage: '/images/hero-desert.webp',
    sectionTitle: 'Choose your desert safari',
    sectionCopy: 'Our most-booked desert experiences — verified guides, flexible scheduling and easy WhatsApp support.',
    tours: byCategory('Desert Safari')
  },
  'desert-adventures': {
    name: 'Desert Adventures',
    eyebrow: 'Desert adventures',
    heroTitle: 'Buggy and quad bike experiences',
    heroCopy: 'Choose from CAN-AM buggy, evening buggy and quad bike desert experiences.',
    heroImage: '/images/adv-buggy.webp',
    sectionTitle: 'Choose your desert adventures',
    sectionCopy: 'Our most-booked experiences this month — verified guides, instant confirmations, free WhatsApp re-scheduling.',
    tours: byCategory('Desert Adventures')
  },
  'city-tours': {
    name: 'City Tours',
    eyebrow: 'City tours',
    heroTitle: 'Dubai, Abu Dhabi and UAE city tours',
    heroCopy: 'Explore iconic landmarks, heritage districts and modern skylines with guided city experiences.',
    heroImage: '/images/city-02-dubai-burj-khalifa.webp',
    sectionTitle: 'Choose your city tour',
    sectionCopy: 'Explore Dubai, Abu Dhabi and more with comfortable transfers and knowledgeable local guides.',
    tours: byCategory('City Tours')
  },
  attractions: {
    name: 'Attractions',
    eyebrow: 'Attractions',
    heroTitle: 'The UAE’s must-see attractions',
    heroCopy: 'Book iconic Dubai and Abu Dhabi landmarks, immersive attractions and family favourites.',
    heroImage: '/images/attraction-card-01.jpg',
    sectionTitle: 'Choose your attraction',
    sectionCopy: 'Popular tickets and landmark experiences selected for easy planning and quick support.',
    tours: byCategory('Attractions')
  },
  cruises: {
    name: 'Cruises',
    eyebrow: 'Cruises',
    heroTitle: 'Dubai marina and dhow cruise experiences',
    heroCopy: 'Enjoy dinner cruises, skyline sailing and private yacht experiences along Dubai’s waterfront.',
    heroImage: '/images/heli-marina.webp',
    sectionTitle: 'Choose your cruise',
    sectionCopy: 'From classic dinner cruises to private yacht time, find the waterfront experience that fits your trip.',
    tours: cruiseTours
  },
  'water-activities': {
    name: 'Water Activities',
    eyebrow: 'Water activities',
    heroTitle: 'Dubai water and coastal adventures',
    heroCopy: 'Choose from yachts, jet ski sessions, scuba diving and exciting experiences on the water.',
    heroImage: '/images/heli-palm.webp',
    sectionTitle: 'Choose your water activity',
    sectionCopy: 'Easy-to-book coastal experiences for thrill seekers, couples, families and private groups.',
    tours: waterTours
  },
  'aerial-experiences': {
    name: 'Aerial Experiences',
    eyebrow: 'Aerial experiences',
    heroTitle: 'Dubai helicopter and skyline experiences',
    heroCopy: 'See Palm Jumeirah, Dubai Marina and the city skyline from unforgettable aerial perspectives.',
    heroImage: '/images/heli-card-02.jpg',
    sectionTitle: 'Choose your aerial experience',
    sectionCopy: 'Short scenic flights, extended skyline routes and premium private helicopter experiences.',
    tours: aerialTours
  },
  packages: {
    name: 'Packages',
    eyebrow: 'UAE packages',
    heroTitle: 'Curated UAE experiences made simple',
    heroCopy: 'Combine desert, city and attraction highlights into convenient multi-day itineraries.',
    heroImage: '/images/hero-camp.webp',
    sectionTitle: 'Choose your UAE package',
    sectionCopy: 'Flexible combinations designed to help you see more of the UAE with less planning.',
    tours: packageTours
  }
}

export const tourCategoryPaths = Object.fromEntries(
  Object.entries(tourCategoryPages).map(([slug, page]) => [page.name, `/tours/${slug}`])
)
