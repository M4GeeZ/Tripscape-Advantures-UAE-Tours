import { categoryToSlug, getTourDetail, slugify } from '../tourDetails'

const categoryEndings = {
  'desert-safari': 'It is a practical choice for travellers who want the desert atmosphere, organised transport and reliable local support in one easy booking.',
  'desert-adventures': 'It suits guests who want more active desert time, with clear safety guidance and support before and during the experience.',
  'city-tours': 'It is ideal for first-time visitors who want to see key landmarks comfortably without planning every stop and transfer themselves.',
  attractions: 'It works well as a simple add-on to a Dubai itinerary, with digital booking support and clear visit instructions before arrival.',
  cruises: 'It is a relaxed way to enjoy Dubai from the water while keeping timing, departure details and guest support easy to manage.',
  'water-activities': 'It is designed for guests who want a straightforward coastal activity with safety guidance and booking support included.',
  'aerial-experiences': 'It is a memorable option for couples, families and visitors who want a premium view of Dubai with a clear check-in process.',
  packages: 'It is arranged to reduce planning time while keeping transport, timing and guest support simple throughout the experience.'
}

export function getCardDescription(category, title, fallback = '') {
  const categorySlug = categoryToSlug(category)
  const detail = getTourDetail(categorySlug, slugify(title))
  let description = detail?.description || fallback || ''

  if (!description || / experience in the UAE\.?$/i.test(description)) {
    description = `${title} is a carefully arranged UAE experience with clear booking support and practical guest guidance.`
  }

  const ending = categoryEndings[categorySlug]
  if (ending && description.length < 310 && !description.includes(ending)) {
    description = `${description} ${ending}`
  }

  return description
}

const categoryFallbackPoints = {
  'desert-safari': [
    'Hotel pickup and drop-off support',
    'Dune bashing and desert driving experience',
    'Camel ride and desert photo opportunities',
    'Sandboarding or selected desert activities',
    'Refreshments during the experience',
    'Professional desert safari guide',
    'WhatsApp booking and timing assistance'
  ],
  'desert-adventures': [
    'Safety briefing before the activity',
    'Required helmet and safety equipment',
    'Guided desert riding experience',
    'Professional activity support',
    'Desert photo opportunities',
    'Selected riding duration or package',
    'WhatsApp booking and timing assistance'
  ],
  'city-tours': [
    'Comfortable air-conditioned transport',
    'Professional local tour guide',
    'Major landmark photo stops',
    'Planned sightseeing route and timings',
    'Pickup support on selected packages',
    'Local guidance throughout the tour',
    'WhatsApp booking and timing assistance'
  ],
  attractions: [
    'Digital booking confirmation',
    'Clear attraction entry instructions',
    'Selected attraction admission or ticket',
    'Visit timing and access guidance',
    'Mobile-friendly booking details',
    'Guest support before your visit',
    'WhatsApp booking assistance'
  ],
  cruises: [
    'Scenic waterfront cruise route',
    'Clear departure and boarding details',
    'Guest support before boarding',
    'Comfortable sightseeing experience',
    'Selected meal service when included',
    'Booking and timing assistance',
    'WhatsApp guest support'
  ],
  'water-activities': [
    'Professional safety briefing',
    'Required activity equipment',
    'On-site guest assistance',
    'Selected water activity session',
    'Clear check-in and timing guidance',
    'Safety support throughout the activity',
    'WhatsApp booking assistance'
  ],
  'aerial-experiences': [
    'Pre-flight safety briefing',
    'Scenic aerial sightseeing route',
    'Professional boarding assistance',
    'Selected flight duration or package',
    'Clear check-in instructions',
    'Guest support before departure',
    'WhatsApp booking and timing assistance'
  ],
  packages: [
    'Curated UAE travel experience',
    'Clear pickup and timing details',
    'Guest assistance throughout the package',
    'Selected service or activity arrangement',
    'Practical booking guidance',
    'Simple confirmation process',
    'WhatsApp booking assistance'
  ]
}

function cleanPoint(value = '') {
  return String(value)
    .replace(/^[•✓✔\-–—]+\s*/, '')
    .replace(/\s+/g, ' ')
    .replace(/[.;,:]+$/, '')
    .trim()
}

function pointsFromText(text = '') {
  return String(text)
    .split(/(?<=[.!?])\s+|\s+[–—]\s+|;\s+/)
    .map(cleanPoint)
    .filter((point) => point.length >= 18)
}

export function getCardPoints(category, title, fallback = '', limit = 7) {
  const categorySlug = categoryToSlug(category)
  const detail = getTourDetail(categorySlug, slugify(title))

  const detailPoints = Array.isArray(detail?.included)
    ? detail.included.map(cleanPoint).filter(Boolean)
    : []

  const fallbackPoints = pointsFromText(fallback)
  const categoryPoints = categoryFallbackPoints[categorySlug] || categoryFallbackPoints.packages
  const pointLimit = Math.max(5, Math.min(Number(limit) || 7, 7))

  return [...new Set([...detailPoints, ...fallbackPoints, ...categoryPoints])].slice(0, pointLimit)
}
