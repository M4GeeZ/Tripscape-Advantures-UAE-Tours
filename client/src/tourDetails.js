import {
  adventures,
  attractions,
  cities,
  helicopters,
  tourCatalog,
  tours
} from './data'
import { tourCategoryPages } from './tourCategoryPages'

export function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const CATEGORY_SLUGS = {
  'desert safari': 'desert-safari',
  'desert adventures': 'desert-adventures',
  'desert adventure': 'desert-adventures',
  'city tours': 'city-tours',
  'city tour': 'city-tours',
  attractions: 'attractions',
  cruises: 'cruises',
  'water activities': 'water-activities',
  'aerial experiences': 'aerial-experiences',
  'helicopter package': 'aerial-experiences',
  packages: 'packages'
}

export function categoryToSlug(category = '') {
  const normalized = category.trim().toLowerCase()
  return CATEGORY_SLUGS[normalized] || slugify(category)
}

const featuredTopImages = {
  'Morning Desert Safari with Quad Bike': '/images/top-experiences/morning-desert-safari-quad-bike.png',
  'Evening Desert Safari with BBQ Dinner': '/images/top-experiences/evening-desert-safari-bbq-dinner.png',
  'Desert Safari with VIP Setup': '/images/top-experiences/desert-safari-vip-setup.png',
  'VIP Desert Safari with Private Seating': '/images/top-experiences/vip-desert-safari-private-seating.png',
  'VIP Premium Desert Safari with BBQ Dinner': '/images/top-experiences/vip-premium-desert-safari-bbq-dinner.png',
  'Sunrise Camel Trekking': '/images/top-experiences/sunrise-camel-trekking.png',
  'Desert Safari with Dinner at Caravanserai': '/images/top-experiences/desert-safari-dinner-caravanserai.png',
  'Family Desert Safari & Quad Experience': '/images/top-experiences/family-desert-safari-quad-experience.png'
}

const bookableTours = {
  'CAN-AM Buggy Tour – 1 Hour': {
    basePrice: 1249,
    description: 'Get ready for an adrenaline-pumping ride with our 1-Hour CAN-AM Buggy Tour! Perfect for adventure seekers and thrill lovers, this exciting off-road experience will take you through challenging terrains, all while enjoying the power and speed of a state-of-the-art CAN-AM Buggy. Whether you’re a seasoned rider or a first-time adventurer, this tour promises an unforgettable experience!'
  },
  'CAN-AM Buggy Tour with Dinner': {
    basePrice: 1649,
    description: 'Combine a powerful CAN-AM buggy ride with a relaxed desert evening. Take on the dunes with professional guidance, enjoy sunset views, then finish the experience at the desert camp with dinner and live entertainment.'
  },
  'Evening Buggy Tour with Dinner': {
    basePrice: 800,
    description: 'Enjoy an evening buggy adventure across the Dubai desert followed by a comfortable camp experience. Ride through the dunes, stop for sunset photos, and end the evening with dinner and live entertainment.'
  },
  'Evening Quad Bike with Dinner': {
    basePrice: 450,
    description: 'Ride a quad bike across the evening desert before settling into a traditional camp experience. The tour combines a guided riding session, desert views, dinner and evening entertainment in one easy booking.'
  }
}

const exactIncluded = {
  'CAN-AM Buggy Tour – 1 Hour': [
    '1 hour duration',
    'New CAN-AM Maverick X3 Buggy',
    'Self-drive Desert Tour',
    '100% Security, Helmet, Gloves, Goggles',
    'Professional Tour Guides'
  ],
  'CAN-AM Buggy Tour with Dinner': [
    '1 hour CAN-AM buggy experience',
    'Professional safety briefing',
    'Helmet, gloves and required safety equipment',
    'Guided desert riding route',
    'Sunset desert photo stop',
    'BBQ dinner at the desert camp',
    'Live cultural entertainment'
  ],
  'Evening Buggy Tour with Dinner': [
    'Evening dune buggy experience',
    'Safety briefing and required equipment',
    'Professional desert activity guide',
    'Sunset photo opportunity',
    'Desert camp access',
    'BBQ dinner',
    'Live evening entertainment'
  ],
  'Evening Quad Bike with Dinner': [
    '30 minute quad bike experience',
    'Safety briefing and helmet',
    'Guided quad bike riding area',
    'Evening desert photo stop',
    'Desert camp access',
    'BBQ dinner',
    'Live cultural entertainment'
  ],
  'Morning Desert Safari with Quad Bike': [
    'Pick Up by 4×4 (SIC Basis)',
    'Desert Dune Bashing by Land Cruiser (Air-Conditioned Vehicle).',
    'Camel Riding.',
    'Sand Skiing Session.',
    'Stunning Quad Biking Experience.',
    'Refreshment like Water & Soft drinks.',
    'Photo Stops.',
    '220CC Quad Bike',
    'Drop back to Residence/Hotel.',
    'Hotel pickup and drop-off by 4×4 SUV',
    'Pick by: 4×4 SUV for the desert safari',
    'DTCM Approve License Desert Safari Guide.',
    '30 minutes Thrilling dune bashing.',
    '30 Minutes Quad Biking Experience',
    'Cold Drink, Water Bottle.'
  ],
  'Evening Desert Safari with BBQ Dinner': [
    'Hotel pickup by 4×4 SUV',
    'Sunset dune bashing experience',
    'Camel ride and desert photo stop',
    'Arabic welcome at the desert camp',
    'BBQ buffet dinner with vegetarian options',
    'Live cultural entertainment',
    'Henna painting and traditional costumes',
    'Soft drinks, water, tea and coffee',
    'Return transfer to your hotel'
  ],
  'Desert Safari with VIP Setup': [
    'Private 4×4 hotel transfer',
    'Premium dune bashing session',
    'Reserved VIP seating at camp',
    'Table service throughout dinner',
    'Premium BBQ buffet dinner',
    'Camel ride and sandboarding',
    'Live entertainment program',
    'Unlimited soft drinks and water',
    'Return transfer to your hotel'
  ],
  'VIP Desert Safari with Private Seating': [
    'Private hotel pickup and drop-off',
    'Private desert safari vehicle',
    'Dedicated majlis seating area',
    'Personal table service team',
    'Premium dinner experience',
    'Dune bashing and sunset photo stop',
    'Camel ride and camp activities',
    'Live entertainment program'
  ],
  'Sunrise Camel Trekking': [
    'Early morning hotel pickup',
    'Guided camel trekking experience',
    'Sunrise desert photo stops',
    'Traditional Arabic refreshments',
    'Professional desert guide',
    'Safety briefing before the experience',
    'Return transfer to your hotel'
  ]
}

const categoryIncluded = {
  'desert-safari': [
    'Hotel pickup and drop-off options',
    'Licensed UAE desert safari guide',
    'Dune drive with scenic photo stops',
    'Camel riding experience',
    'Sandboarding session',
    'Camp refreshments',
    'Professional guest support throughout the tour'
  ],
  'desert-adventures': [
    'Professional safety briefing',
    'Helmet and required safety equipment',
    'Guided desert riding route',
    'Experienced activity marshal',
    'Desert photo opportunities',
    'Water and refreshments',
    'On-ground Tripscape support'
  ],
  'city-tours': [
    'Comfortable air-conditioned transport',
    'Professional local tour guide',
    'Major landmark photo stops',
    'Hotel pickup and drop-off options',
    'Flexible sightseeing schedule',
    'Guest assistance throughout the tour'
  ],
  attractions: [
    'Official attraction admission',
    'Digital booking confirmation',
    'Instant WhatsApp booking support',
    'Entry instructions before your visit',
    'Guest assistance for schedule changes'
  ],
  cruises: [
    'Cruise admission',
    'Welcome refreshments',
    'Scenic waterfront route',
    'Guest assistance before departure',
    'Booking confirmation by WhatsApp'
  ],
  'water-activities': [
    'Activity safety briefing',
    'Required safety equipment',
    'Professional activity crew',
    'Guest assistance throughout the experience',
    'Booking confirmation and support'
  ],
  'aerial-experiences': [
    'Pre-flight safety briefing',
    'Professional licensed flight crew',
    'Scenic Dubai aerial route',
    'Passenger assistance before boarding',
    'Booking confirmation and schedule support'
  ],
  packages: [
    'Curated UAE itinerary',
    'Booking coordination',
    'Tour and attraction planning',
    'WhatsApp support throughout your trip',
    'Flexible itinerary assistance'
  ]
}

function uniqueByTitle(items) {
  const map = new Map()
  items.forEach((item) => {
    const key = `${categoryToSlug(item.category)}::${item.title}`
    if (!map.has(key)) map.set(key, item)
  })
  return [...map.values()]
}

const familyTour = {
  category: 'Desert Safari',
  image: featuredTopImages['Family Desert Safari & Quad Experience'],
  title: 'Family Desert Safari & Quad Experience',
  duration: 'Family',
  location: 'Dubai, UAE',
  price: 'Contact for price',
  rating: '4.9',
  reviews: 0
}

const homepageTours = [
  ...tours.map((item) => ({
    ...item,
    category: 'Desert Safari',
    duration: item.meta,
    location: 'Dubai, UAE',
    rating: '4.9',
    reviews: 0,
    image: featuredTopImages[item.title] || item.image
  })),
  familyTour,
  ...cities.map((item) => ({
    ...item,
    category: 'City Tours',
    duration: 'Guided tour',
    location: item.title.includes('Abu Dhabi') ? 'Abu Dhabi, UAE' : 'Dubai, UAE',
    rating: '4.9',
    reviews: 0
  })),
  ...adventures.map((item) => ({
    ...item,
    category: 'Desert Adventures',
    duration: item.title.toLowerCase().includes('1 hour') ? '1 hour' : 'Adventure',
    location: 'Dubai, UAE',
    rating: '4.9',
    reviews: 0
  })),
  ...helicopters.map((item) => ({
    ...item,
    category: 'Aerial Experiences',
    location: 'Dubai, UAE',
    rating: '4.9',
    reviews: 0
  })),
  ...attractions.map((item) => ({
    ...item,
    category: 'Attractions',
    duration: 'Entry ticket',
    location: item.title.includes('Mosque') ? 'Abu Dhabi, UAE' : 'Dubai, UAE',
    rating: '4.9',
    reviews: 0
  }))
]

const normalizedCatalog = tourCatalog.map((item) => ({
  ...item,
  duration: item.duration || 'Tour experience'
}))

const categoryPageTours = Object.values(tourCategoryPages).flatMap((page) =>
  page.tours.map((tour) => ({ ...tour, category: page.name }))
)

const allBaseItems = uniqueByTitle([
  ...homepageTours,
  ...normalizedCatalog,
  ...categoryPageTours
])

function titleSpecificExtras(title = '') {
  const value = title.toLowerCase()
  const extras = []

  if (value.includes('bbq') || value.includes('dinner')) extras.push('Dinner service included as described in your booking')
  if (value.includes('quad')) extras.push('Quad bike experience with safety briefing')
  if (value.includes('buggy')) extras.push('Buggy session with required safety equipment')
  if (value.includes('burj khalifa')) extras.push('Burj Khalifa visit or admission as selected')
  if (value.includes('mosque')) extras.push('Mosque visit guidance and dress-code support')
  if (value.includes('yacht') || value.includes('cruise')) extras.push('Waterfront sightseeing experience')
  if (value.includes('helicopter') || value.includes('flight') || value.includes('tour')) {
    if (value.includes('flight')) extras.push('Scenic flight experience for the selected duration')
  }

  return extras
}

const categoryImages = allBaseItems.reduce((acc, item) => {
  const slug = categoryToSlug(item.category)
  if (!acc[slug]) acc[slug] = []
  if (item.image && !acc[slug].includes(item.image)) acc[slug].push(item.image)
  return acc
}, {})

export const tourDetailPages = allBaseItems.map((item) => {
  const categorySlug = categoryToSlug(item.category)
  const primaryImage = featuredTopImages[item.title] || item.image
  const relatedImages = categoryImages[categorySlug] || []
  const gallery = [primaryImage, ...relatedImages.filter((image) => image !== primaryImage)].slice(0, 4)
  const included = exactIncluded[item.title] || [
    ...(categoryIncluded[categorySlug] || categoryIncluded['desert-safari']),
    ...titleSpecificExtras(item.title)
  ]

  return {
    ...item,
    image: primaryImage,
    gallery,
    included: [...new Set(included)],
    categorySlug,
    slug: slugify(item.title),
    categoryLabel: item.category,
    duration: item.duration || item.meta || 'Tour experience',
    location: item.location || 'Dubai, UAE',
    price: item.price || 'Contact for price',
    rating: item.rating || '4.9',
    reviews: item.reviews ?? 0,
    isBookable: Boolean(bookableTours[item.title]),
    basePrice: bookableTours[item.title]?.basePrice || null,
    description: bookableTours[item.title]?.description || item.description || ''
  }
})

export function getTourDetail(categorySlug, tourSlug) {
  return tourDetailPages.find(
    (item) => item.categorySlug === categorySlug && item.slug === tourSlug
  )
}

export function getTourDetailHref(category, title) {
  return `/tours/${categoryToSlug(category)}/${slugify(title)}`
}
