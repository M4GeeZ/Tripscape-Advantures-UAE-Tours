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


const categoryExcluded = {
  'desert-safari': [
    'Personal expenses and souvenirs',
    'Alcoholic beverages unless specifically stated',
    'Optional activities or upgrades not listed in the inclusions',
    'Gratuities for guides and drivers',
    'Anything not expressly mentioned under What’s included'
  ],
  'desert-adventures': [
    'Damage caused by unsafe or negligent driving',
    'Optional vehicle upgrades or extra riding time',
    'Personal photography packages and souvenirs',
    'Meals unless dinner is specifically included in the tour title or package',
    'Anything not expressly mentioned under What’s included'
  ],
  'city-tours': [
    'Attraction entry tickets unless specifically stated in the tour title or inclusions',
    'Meals and personal purchases',
    'Optional activities during free time',
    'Gratuities',
    'Anything not expressly mentioned under What’s included'
  ],
  attractions: [
    'Hotel transfers unless selected or stated in the booking',
    'Food, drinks and personal purchases',
    'Paid add-ons inside the attraction',
    'Fast-track or premium access unless specifically included',
    'Anything not expressly mentioned under What’s included'
  ],
  cruises: [
    'Hotel transfers unless specifically included',
    'Premium beverages or menu upgrades',
    'Personal purchases and gratuities',
    'Private seating upgrades unless selected',
    'Anything not expressly mentioned under What’s included'
  ],
  'water-activities': [
    'Hotel transfers unless specifically included',
    'Extra activity time beyond the selected package',
    'Personal photos, videos and souvenirs',
    'Food and drinks unless stated',
    'Anything not expressly mentioned under What’s included'
  ],
  'aerial-experiences': [
    'Hotel transfers unless specifically included',
    'Private-flight upgrades unless selected',
    'Professional photo or video packages',
    'Food, drinks and personal purchases',
    'Anything not expressly mentioned under What’s included'
  ],
  packages: [
    'International flights and visas',
    'Travel insurance',
    'Personal expenses and optional upgrades',
    'Meals or activities not listed in the confirmed itinerary',
    'Anything not expressly mentioned under What’s included'
  ]
}

function parseAedPrice(price = '') {
  const value = String(price)
  if (/contact\s+for\s+price/i.test(value)) return null
  const match = value.match(/AED\s*([\d,]+(?:\.\d+)?)/i)
  if (!match) return null
  const amount = Number(match[1].replace(/,/g, ''))
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

function getTourDescription(item, categorySlug) {
  if (bookableTours[item.title]?.description) return bookableTours[item.title].description

  const title = item.title || 'This experience'
  const value = title.toLowerCase()

  if (value.includes('burj khalifa')) {
    return `${title} gives you a convenient way to experience Dubai’s most famous skyline landmark. Your booking is arranged around the selected ticket or tour option, with clear visit instructions and support before arrival.`
  }
  if (value.includes('museum of the future')) {
    return `${title} is designed for visitors who want to explore one of Dubai’s most distinctive modern attractions with a simple, pre-arranged booking. Expect an easy visit flow, digital confirmation and support before your selected time.`
  }
  if (value.includes('aquarium') || value.includes('dolphin') || value.includes('green planet')) {
    return `${title} is a family-friendly attraction experience with straightforward admission and pre-visit guidance. It is ideal for guests who want an indoor activity that is easy to combine with the rest of a Dubai itinerary.`
  }
  if (value.includes('mosque') || value.includes('abu dhabi')) {
    return `${title} combines cultural sightseeing with comfortable travel and practical local guidance. The experience focuses on the key landmarks named in the tour while keeping the route simple and suitable for first-time UAE visitors.`
  }
  if (value.includes('dubai city') || value.includes('old dubai') || value.includes('emirates tour')) {
    return `${title} is a guided sightseeing experience built around the landmarks and neighbourhoods named in the tour. Travel in comfort, make useful photo stops and get local context without having to plan every transfer yourself.`
  }
  if (value.includes('buggy') || value.includes('quad')) {
    return `${title} is an action-focused desert experience for guests who want hands-on off-road fun with safety guidance and on-ground support. The session follows the selected duration and package, with the listed extras included in your booking.`
  }
  if (value.includes('desert') || value.includes('camel') || value.includes('falcon')) {
    return `${title} brings together Dubai desert scenery, guided activities and the specific experiences named in the package. It is arranged to keep transport, activity timing and guest support simple from start to finish.`
  }
  if (value.includes('helicopter') || value.includes('flight') || categorySlug === 'aerial-experiences') {
    return `${title} offers a scenic aerial perspective of Dubai with professional flight operations and a clear pre-flight process. The route and flight time follow the selected package, giving you a memorable view of the city and coastline.`
  }
  if (value.includes('yacht') || value.includes('cruise')) {
    return `${title} is a relaxed waterfront experience designed around Dubai’s skyline and marina scenery. Your confirmed package covers the listed cruise or yacht services, with booking support before departure.`
  }
  if (categorySlug === 'water-activities') {
    return `${title} is a professionally supported water experience with the required safety briefing and equipment for the selected activity. It is a simple option for adding active time on Dubai’s coast to your itinerary.`
  }
  if (categorySlug === 'attractions') {
    return `${title} can be booked as a convenient UAE attraction visit with digital confirmation and practical entry guidance. The experience is designed to make planning easier while keeping the selected ticket or admission details clear.`
  }

  const existing = item.description || ''
  if (existing && !/ experience in the UAE\.?$/i.test(existing)) return existing
  return `${title} is a carefully arranged UAE experience with clear booking support, practical guest guidance and the services listed below. Review the inclusions and exclusions before confirming so you know exactly what your package covers.`
}

function getTourExcluded(title, categorySlug) {
  const value = title.toLowerCase()
  const items = [...(categoryExcluded[categorySlug] || categoryExcluded['desert-safari'])]

  if (value.includes('dinner') || value.includes('bbq')) {
    const mealIndex = items.findIndex((item) => /meal/i.test(item))
    if (mealIndex >= 0) items.splice(mealIndex, 1)
  }
  if (value.includes('burj khalifa') || value.includes('entry ticket') || categorySlug === 'attractions') {
    const ticketIndex = items.findIndex((item) => /entry tickets/i.test(item))
    if (ticketIndex >= 0) items.splice(ticketIndex, 1)
  }

  return [...new Set(items)]
}

function getTourFaqs(item, categorySlug) {
  const title = item.title
  const value = title.toLowerCase()
  const faqs = []

  if (categorySlug === 'desert-safari' || categorySlug === 'desert-adventures') {
    faqs.push(
      { question: `What should I wear for ${title}?`, answer: 'Wear comfortable clothes and closed shoes. Light clothing is suitable in warmer months, while a light jacket can be useful for winter evenings in the desert.' },
      { question: 'Is the experience suitable for children?', answer: 'Suitability depends on the activity and age of the child. Children are free in the on-page price calculator, but age, height and safety restrictions may still apply to dune bashing, quad bikes or buggies.' },
      { question: 'Do I need previous riding experience?', answer: value.includes('buggy') || value.includes('quad') ? 'No previous experience is normally required. A safety briefing is provided before the activity, and guests must follow the guide’s instructions throughout the session.' : 'No special experience is needed. Your guide will explain the activity flow and any safety instructions before the tour begins.' }
    )
  } else if (categorySlug === 'city-tours') {
    faqs.push(
      { question: `How long does ${title} take?`, answer: 'The exact duration depends on the confirmed route, traffic and selected stops. Your booking confirmation will show the planned pickup and approximate return timing.' },
      { question: 'Are attraction tickets included?', answer: value.includes('burj khalifa') ? 'The Burj Khalifa visit is part of this tour as described in the selected package. Any other paid attraction tickets are included only when they are specifically listed in your confirmation.' : 'Paid attraction tickets are included only when they are specifically mentioned in the tour title, inclusions or booking confirmation.' },
      { question: 'What should I wear for mosque visits?', answer: 'Modest clothing is required for mosque visits. Shoulders and knees should be covered, and women may need to cover their hair. Follow the latest venue instructions provided before the tour.' }
    )
  } else if (categorySlug === 'attractions') {
    faqs.push(
      { question: `How will I receive my ${title} booking?`, answer: 'Your booking details and entry instructions are provided digitally. Keep the confirmation available on your phone when you arrive.' },
      { question: 'Can I change my visit time?', answer: 'Changes depend on ticket availability and the rules of the selected attraction. Contact the booking team as early as possible if you need to request a change.' },
      { question: 'Are children charged on this page?', answer: 'The calculator on this website treats children as free. Venue-specific child age, height or ticket rules can still apply and will be confirmed before booking.' }
    )
  } else if (categorySlug === 'aerial-experiences') {
    faqs.push(
      { question: `What happens before the ${title}?`, answer: 'Arrive with enough time for check-in, passenger verification and the mandatory safety briefing before boarding.' },
      { question: 'Can flight times change?', answer: 'Yes. Aerial activities can be affected by weather, visibility, operational requirements or air-traffic restrictions. Any confirmed change will be communicated to you.' },
      { question: 'Are there passenger restrictions?', answer: 'Weight, age, identification and seating restrictions can apply for safety reasons. Final requirements are confirmed for the selected flight before booking.' }
    )
  } else if (categorySlug === 'cruises' || categorySlug === 'water-activities') {
    faqs.push(
      { question: `What should I bring for ${title}?`, answer: 'Bring your booking confirmation, valid identification when required, and comfortable clothing. For water activities, quick-dry clothing and sun protection are recommended.' },
      { question: 'Can the activity be affected by weather?', answer: 'Yes. Marine and water activities can be rescheduled or adjusted when conditions are unsafe. The team will advise you if an operational change is required.' },
      { question: 'Are transfers included?', answer: 'Transfers are included only when they are specifically listed in the package or booking confirmation.' }
    )
  } else {
    faqs.push(
      { question: `What is included with ${title}?`, answer: 'The services shown in the What’s included section are part of the standard package. Any upgrade or optional extra will be confirmed separately.' },
      { question: 'How do I confirm availability?', answer: 'Use the booking or WhatsApp option on this page. The team will confirm the date, timing and any package-specific requirements.' },
      { question: 'Can I change my booking?', answer: 'Change requests depend on availability and supplier rules. Contact the team as early as possible for the best chance of rescheduling.' }
    )
  }

  faqs.push(
    { question: 'What is not included in the price?', answer: 'Items listed in the Excluded section are not part of the standard package unless your final booking confirmation says otherwise.' },
    { question: 'How do I get help before the experience?', answer: 'You can contact Tripscape through WhatsApp using the button on this page for availability, pickup details and booking questions.' }
  )

  return faqs
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

const serviceOnlyItems = [
  { category: 'Desert Safari', title: 'VIP Premium Desert Safari with BBQ', image: '/images/services/01-vip-premium-safari.webp', price: 'Contact for price', duration: 'Premium safari', location: 'Dubai, UAE' },
  { category: 'Desert Safari', title: 'Morning Safari with Quad Bike', image: '/images/services/03-morning-quad-bike.webp', price: 'Contact for price', duration: 'Morning', location: 'Dubai, UAE' },
  { category: 'Desert Safari', title: 'Sunrise View Safari with Camel Ride', image: '/images/services/06-sunrise-camel-ride.webp', price: 'Contact for price', duration: 'Sunrise', location: 'Dubai, UAE' },
  { category: 'Desert Safari', title: 'VIP Desert Safari with BBQ (Table Service)', image: '/images/services/07-vip-table-service.webp', price: 'Contact for price', duration: 'VIP', location: 'Dubai, UAE' },
  { category: 'Desert Adventures', title: 'Single and Double Quad bike', image: '/images/services/09-single-double-quad.webp', price: 'Contact for price', duration: 'Adventure', location: 'Dubai, UAE' },
  { category: 'Cruises', title: 'Dubai Marina Cruise with Royal Dinner', image: '/images/services/12-marina-royal-cruise.webp', price: 'Contact for price', duration: 'Evening cruise', location: 'Dubai Marina, UAE' },
  { category: 'City Tours', title: 'City Tours', image: '/images/services/13-city-tours.webp', price: 'Contact for price', duration: 'Guided tour', location: 'UAE' },
  { category: 'Aerial Experiences', title: 'Helicopter Sightseeing Tour', image: '/images/services/14-helicopter-sightseeing.webp', price: 'Contact for price', duration: 'Scenic flight', location: 'Dubai, UAE' },
  { category: 'Aerial Experiences', title: 'Extreme Hot Air Balloon Ride', image: '/images/services/15-hot-air-balloon-landscape.webp', price: 'Contact for price', duration: 'Sunrise flight', location: 'Dubai, UAE' },
  { category: 'Water Activities', title: 'Scuba Diving Experience', image: '/images/services/17-scuba-diving.webp', price: 'Contact for price', duration: 'Water activity', location: 'Dubai, UAE' },
  { category: 'Packages', title: 'Private Airport Transfer', image: '/images/services/18-airport-transfer.webp', price: 'Contact for price', duration: 'Private transfer', location: 'Dubai, UAE' },
  { category: 'Attractions', title: 'Attraction and Excursion Tickets and many more...', image: '/images/services/19-attraction-tickets.webp', price: 'Contact for price', duration: 'Tickets & excursions', location: 'UAE' }
]

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
  ...serviceOnlyItems,
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
  const basePrice = bookableTours[item.title]?.basePrice || parseAedPrice(item.price)

  return {
    ...item,
    image: primaryImage,
    gallery,
    included: [...new Set(included)],
    excluded: getTourExcluded(item.title, categorySlug),
    faqs: getTourFaqs(item, categorySlug),
    categorySlug,
    slug: slugify(item.title),
    categoryLabel: item.category,
    duration: item.duration || item.meta || 'Tour experience',
    location: item.location || 'Dubai, UAE',
    price: item.price || 'Contact for price',
    rating: item.rating || '4.9',
    reviews: item.reviews ?? 0,
    isBookable: Boolean(basePrice),
    basePrice: basePrice || null,
    description: getTourDescription(item, categorySlug)
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
