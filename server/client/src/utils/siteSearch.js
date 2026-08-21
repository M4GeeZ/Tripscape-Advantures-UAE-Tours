import { blogs, tourCatalog } from '../data'
import { images } from '../generatedImages'

export const destinationOptions = [
  'All',
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ras Al Khaimah',
  'Fujairah'
]

const serviceEntries = [
  {
    id: 'service-vip-safari',
    kind: 'Service',
    category: 'Desert Safari',
    title: 'VIP Premium Desert Safari with BBQ',
    description: 'Premium desert safari, private seating, BBQ dinner and dedicated service.',
    destination: 'Dubai',
    image: images.tourPrivate,
    href: '/services#services-list',
    keywords: 'vip premium private bbq dinner table service luxury desert camp family couple evening'
  },
  {
    id: 'service-camel',
    kind: 'Service',
    category: 'Desert Safari',
    title: 'Sunrise Camel Trekking',
    description: 'Guided camel ride with sunrise views and calm Arabian desert moments.',
    destination: 'Dubai',
    image: images.tourCamel,
    href: '/services#services-list',
    keywords: 'camel trekking ride sunrise morning desert tradition peaceful family kids'
  },
  {
    id: 'service-buggy',
    kind: 'Service',
    category: 'Desert Adventures',
    title: 'Dune Buggy and Quad Bike Experiences',
    description: 'Private buggy drives, quad bikes and guided high-adrenaline dune experiences.',
    destination: 'Dubai',
    image: images.adventureBuggy,
    href: '/services#services-list',
    keywords: 'can am buggy quad bike atv adventure dune drive off road thrill sport'
  },
  {
    id: 'service-city',
    kind: 'Service',
    category: 'City Tours',
    title: 'Dubai and Abu Dhabi City Tours',
    description: 'Guided sightseeing across Dubai, Abu Dhabi and the UAE.',
    destination: 'UAE',
    image: images.cityBurj,
    href: '/services#services-list',
    keywords: 'city sightseeing dubai abu dhabi sharjah mosque burj khalifa emirates landmark culture'
  },
  {
    id: 'service-helicopter',
    kind: 'Service',
    category: 'Aerial Experiences',
    title: 'Helicopter Sightseeing Tour',
    description: 'Scenic helicopter flights over Palm Jumeirah, Marina and Dubai landmarks.',
    destination: 'Dubai',
    image: images.heliPalm,
    href: '/services#services-list',
    keywords: 'helicopter aerial flight skyline palm marina private luxury sky'
  },
  {
    id: 'service-cruise',
    kind: 'Service',
    category: 'Cruises',
    title: 'Dubai Marina Dinner Cruise',
    description: 'Evening dhow and marina cruises with dinner and skyline views.',
    destination: 'Dubai',
    image: images.heliMarina,
    href: '/services#services-list',
    keywords: 'dhow cruise marina yacht dinner boat royal sunset evening water'
  },
  {
    id: 'service-transfer',
    kind: 'Service',
    category: 'Services',
    title: 'Private Airport Transfer',
    description: 'Comfortable private transfers for airport arrivals, hotels and tours.',
    destination: 'Dubai',
    image: images.heroCity,
    href: '/services#services-list',
    keywords: 'airport transfer transport private car pickup dropoff taxi hotel'
  }
]

const pageEntries = [
  {
    id: 'page-tours',
    kind: 'Page',
    category: 'Tours',
    title: 'Explore All UAE Tours',
    description: 'Browse desert safaris, city tours, attractions, cruises and packages.',
    destination: 'UAE',
    image: images.heroDesert,
    href: '/tours',
    keywords: 'all tours packages experiences book uae holiday trip activities'
  },
  {
    id: 'page-services',
    kind: 'Page',
    category: 'Services',
    title: 'Travel Services Across the UAE',
    description: 'Tailor-made travel, adventure tourism, luxury travel and transportation.',
    destination: 'UAE',
    image: images.tourCamp,
    href: '/services',
    keywords: 'services travel planning luxury transportation group tours custom itinerary'
  },
  {
    id: 'page-about',
    kind: 'Page',
    category: 'Company',
    title: 'About Tripscape Adventures',
    description: 'Learn about our travel expertise, quality standards and UAE experiences.',
    destination: 'UAE',
    image: images.aboutPrimary,
    href: '/about',
    keywords: 'about company story expertise quality tripscape operator trusted'
  },
  {
    id: 'page-contact',
    kind: 'Page',
    category: 'Contact',
    title: 'Contact and Booking Support',
    description: 'Speak with our team through WhatsApp, phone or the booking form.',
    destination: 'Dubai',
    image: images.aboutSecondary,
    href: '/contact',
    keywords: 'contact whatsapp phone email booking support enquiry help call message'
  },
  {
    id: 'page-blog',
    kind: 'Page',
    category: 'Guides',
    title: 'UAE Travel Guides and Tips',
    description: 'Read destination guides, traveller reviews and practical UAE tips.',
    destination: 'UAE',
    image: images.blogOne,
    href: '/blog',
    keywords: 'blog guide tips reviews news destinations information advice'
  }
]

const CATEGORY_KEYWORDS = {
  'Desert Safari': 'safari desert dune camp bbq camel dinner sunset sunrise evening morning family traditional sand',
  'Desert Adventures': 'buggy quad bike atv can am off road adventure thrill sport dune driving',
  'City Tours': 'city sightseeing landmark culture mosque heritage dubai abu dhabi sharjah tour',
  Attractions: 'attraction ticket entry burj khalifa museum aquarium mosque park landmark',
  Cruises: 'cruise dhow boat yacht marina dinner sunset water waterfront',
  'Water Activities': 'water aqua aquaventure jet ski beach swimming family sea ocean',
  'Aerial Experiences': 'helicopter flight aerial skyline sky private luxury palm marina',
  Packages: 'package holiday itinerary bundle deal days trip family couple hotel transfer'
}

const SYNONYM_GROUPS = [
  ['safari', 'desert', 'dune', 'sand', 'camp', 'bbq', 'camel'],
  ['buggy', 'quad', 'bike', 'atv', 'canam', 'offroad', 'adventure'],
  ['city', 'sightseeing', 'landmark', 'culture', 'heritage', 'tour'],
  ['attraction', 'ticket', 'entry', 'burj', 'museum', 'aquarium', 'mosque'],
  ['cruise', 'dhow', 'boat', 'yacht', 'marina', 'water'],
  ['helicopter', 'flight', 'aerial', 'skyline', 'sky'],
  ['package', 'holiday', 'itinerary', 'bundle', 'deal', 'trip'],
  ['premium', 'luxury', 'vip', 'private', 'exclusive'],
  ['cheap', 'budget', 'affordable', 'price', 'deal', 'value'],
  ['family', 'kids', 'children', 'group'],
  ['couple', 'romantic', 'honeymoon', 'private'],
  ['evening', 'night', 'sunset', 'dinner'],
  ['morning', 'sunrise', 'early'],
  ['contact', 'booking', 'support', 'whatsapp', 'phone', 'call', 'message'],
  ['dubai', 'downtown', 'jumeirah', 'marina', 'lahbab'],
  ['abudhabi', 'abu', 'dhabi', 'capital', 'mosque'],
  ['sharjah', 'culture', 'heritage'],
  ['rak', 'rasalkhaimah', 'mountain'],
  ['fujairah', 'beach', 'coast']
]

function getDestination(location = '') {
  const value = normalize(location)
  if (value.includes('abu dhabi')) return 'Abu Dhabi'
  if (value.includes('sharjah')) return 'Sharjah'
  if (value.includes('ras al khaimah') || value.includes('rak')) return 'Ras Al Khaimah'
  if (value.includes('fujairah')) return 'Fujairah'
  if (value === 'uae') return 'UAE'
  return 'Dubai'
}

const tourEntries = tourCatalog.map((tour) => ({
  ...tour,
  id: `tour-${tour.id}`,
  kind: tour.category === 'Packages' ? 'Package' : 'Tour',
  destination: getDestination(tour.location),
  href: `/tours?query=${encodeURIComponent(tour.title)}&category=${encodeURIComponent(tour.category)}`,
  keywords: [
    CATEGORY_KEYWORDS[tour.category],
    tour.category,
    tour.location,
    tour.duration,
    tour.description,
    tour.featured ? 'popular recommended best seller top rated' : ''
  ].filter(Boolean).join(' ')
}))

const blogEntries = blogs.map((article, index) => ({
  id: `blog-${index + 1}`,
  kind: 'Guide',
  category: article.tag,
  title: article.title,
  description: 'Travel advice, local knowledge and practical guidance from the Tripscape team.',
  destination: article.title.toLowerCase().includes('abu dhabi') ? 'Abu Dhabi' : 'Dubai',
  image: article.image,
  href: '/blog',
  keywords: `${article.tag} blog article guide travel tips family information advice`
}))

export const siteSearchCatalog = [
  ...tourEntries,
  ...serviceEntries,
  ...blogEntries,
  ...pageEntries
]

function normalize(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/can[\s-]?am/g, 'canam')
    .replace(/abu[\s-]?dhabi/g, 'abudhabi')
    .replace(/ras[\s-]?al[\s-]?khaimah/g, 'rasalkhaimah')
    .replace(/[–—-]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(value = '') {
  return normalize(value).split(' ').filter(Boolean)
}

function levenshtein(a, b) {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  const current = new Array(b.length + 1)

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      )
    }
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j]
  }

  return previous[b.length]
}

function tokenSimilarity(queryToken, itemToken) {
  if (!queryToken || !itemToken) return 0
  if (queryToken === itemToken) return 1
  if (itemToken.startsWith(queryToken) || queryToken.startsWith(itemToken)) return 0.88
  if (itemToken.includes(queryToken) || queryToken.includes(itemToken)) return 0.78

  const longest = Math.max(queryToken.length, itemToken.length)
  if (longest < 4) return 0

  const distance = levenshtein(queryToken, itemToken)
  if (distance === 1) return 0.72
  if (distance === 2 && longest >= 6) return 0.52
  return 0
}

function expandedTokens(query) {
  const original = tokenize(query)
  const expanded = new Set(original)

  original.forEach((token) => {
    SYNONYM_GROUPS.forEach((group) => {
      if (group.includes(token)) group.forEach((word) => expanded.add(word))
    })
  })

  return { original, expanded: [...expanded] }
}

function itemSearchData(item) {
  const title = normalize(item.title)
  const category = normalize(item.category)
  const destination = normalize(item.destination)
  const description = normalize(item.description)
  const keywords = normalize(item.keywords)
  const all = `${title} ${category} ${destination} ${description} ${keywords}`

  return {
    title,
    category,
    destination,
    description,
    keywords,
    all,
    tokens: tokenize(all)
  }
}

function categoryMatches(item, category) {
  if (!category || category === 'All') return true
  const selected = normalize(category)
  const itemCategory = normalize(item.category)
  return itemCategory === selected || itemCategory.includes(selected) || selected.includes(itemCategory)
}

function destinationMatches(item, destination) {
  if (!destination || destination === 'All') return true
  if (item.destination === 'UAE') return true
  return normalize(item.destination) === normalize(destination)
}

function scoreItem(item, query, category, destination) {
  const data = itemSearchData(item)
  const normalizedQuery = normalize(query)
  const { original, expanded } = expandedTokens(query)

  let score = 0
  let strongestMatch = 0

  if (item.featured) score += 14
  if (item.kind === 'Tour' || item.kind === 'Package') score += 7
  if (item.rating) score += Number(item.rating) || 0

  if (category && category !== 'All') {
    score += categoryMatches(item, category) ? 72 : -5
  }

  if (destination && destination !== 'All') {
    score += destinationMatches(item, destination) ? 58 : -4
  }

  if (!normalizedQuery) {
    return { score, matchStrength: 1 }
  }

  if (data.title === normalizedQuery) score += 180
  if (data.title.startsWith(normalizedQuery)) score += 115
  if (data.title.includes(normalizedQuery)) score += 90
  if (data.category.includes(normalizedQuery)) score += 62
  if (data.destination.includes(normalizedQuery)) score += 52
  if (data.keywords.includes(normalizedQuery)) score += 44
  if (data.description.includes(normalizedQuery)) score += 30

  original.forEach((queryToken) => {
    let best = 0
    data.tokens.forEach((itemToken) => {
      best = Math.max(best, tokenSimilarity(queryToken, itemToken))
    })
    strongestMatch = Math.max(strongestMatch, best)
    score += best * 38
  })

  expanded.forEach((queryToken) => {
    if (original.includes(queryToken)) return
    let best = 0
    data.tokens.forEach((itemToken) => {
      best = Math.max(best, tokenSimilarity(queryToken, itemToken))
    })
    score += best * 5
  })

  return { score, matchStrength: strongestMatch }
}

function rankItems(items, query, options = {}) {
  const { category = 'All', destination = 'All' } = options
  return items
    .map((item) => {
      const scored = scoreItem(item, query, category, destination)
      return { ...item, searchScore: scored.score, matchStrength: scored.matchStrength }
    })
    .sort((a, b) => {
      if (b.searchScore !== a.searchScore) return b.searchScore - a.searchScore
      if ((b.featured ? 1 : 0) !== (a.featured ? 1 : 0)) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return a.title.localeCompare(b.title)
    })
}

function uniqueById(items) {
  const seen = new Set()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export function searchSiteContent(
  query,
  { category = 'All', destination = 'All', limit = 8 } = {}
) {
  const ranked = rankItems(siteSearchCatalog, query, { category, destination })
  const hasQuery = Boolean(normalize(query))

  const directMatches = ranked.filter((item) => {
    const categoryOkay = categoryMatches(item, category)
    const destinationOkay = destinationMatches(item, destination)
    const queryOkay = !hasQuery || item.matchStrength >= 0.5
    return categoryOkay && destinationOkay && queryOkay
  })

  if (directMatches.length) {
    return directMatches.slice(0, limit).map((item) => ({ ...item, searchMode: 'matched' }))
  }

  const closest = uniqueById([
    ...ranked.filter((item) => categoryMatches(item, category)),
    ...ranked.filter((item) => destinationMatches(item, destination)),
    ...ranked
  ])

  return closest.slice(0, limit).map((item) => ({
    ...item,
    searchMode: 'recommended',
    recommendationLabel: hasQuery ? 'Closest recommendation' : 'Popular recommendation'
  }))
}

export function searchTourCatalog(
  tours,
  query,
  { category = 'All', destination = 'All', limit } = {}
) {
  const normalizedTours = tours.map((tour) => ({
    ...tour,
    kind: tour.category === 'Packages' ? 'Package' : 'Tour',
    destination: getDestination(tour.location),
    keywords: [CATEGORY_KEYWORDS[tour.category], tour.description, tour.duration, tour.location].filter(Boolean).join(' ')
  }))

  const ranked = rankItems(normalizedTours, query, { category, destination })
  const hasQuery = Boolean(normalize(query))
  const directMatches = ranked.filter((item) => {
    const categoryOkay = categoryMatches(item, category)
    const destinationOkay = destinationMatches(item, destination)
    const queryOkay = !hasQuery || item.matchStrength >= 0.5
    return categoryOkay && destinationOkay && queryOkay
  })

  const selected = directMatches.length
    ? directMatches.map((item) => ({ ...item, searchMode: 'matched' }))
    : uniqueById([
      ...ranked.filter((item) => categoryMatches(item, category)),
      ...ranked.filter((item) => destinationMatches(item, destination)),
      ...ranked
    ]).map((item) => ({ ...item, searchMode: 'recommended' }))

  return typeof limit === 'number' ? selected.slice(0, limit) : selected
}

export function buildToursSearchUrl({ query = '', category = 'All', destination = 'All', date = '' } = {}) {
  const params = new URLSearchParams()
  if (query.trim()) params.set('query', query.trim())
  if (category && category !== 'All') params.set('category', category)
  if (destination && destination !== 'All') params.set('destination', destination)
  if (date) params.set('date', date)
  const search = params.toString()
  return search ? `/tours?${search}` : '/tours'
}
