// The rates below are the published Tripscape price list (AED). Keep this as the
// single frontend source for the nine approved packages.
const rates = [
  { keys: ['Evening Desert Safari with BBQ Dinner'], amount: 99, unit: '/person' },
  { keys: ['VIP Premium Desert Safari with BBQ Dinner'], amount: 149, unit: '/person' },
  { keys: ['VIP Private Desert Safari Family Package', 'Private Car Family Package Up to 6 People', 'VIP Private Desert Safari - Family Package'], amount: 749, unit: '/car' },
  { keys: ['VIP Desert Safari with Private Seating'], amount: 1249, unit: '/car' },
  { keys: ['Private Desert Safari with Sahara Fortress Dinner'], amount: 2949, unit: '/car', image: '/images/private-desert-setup/private-sahara-fortress-dinner.jpg' },
  { keys: ['Single and Double Quad Bike', 'Single and Double Quad bike'], amount: 249, unit: '/bike' },
  { keys: ['Evening Quad Bike with Dinner'], amount: 299, unit: '/person' },
  { keys: ['Morning Desert Safari with Quad Bike', 'Morning Safari with Quad Bike'], amount: 255, unit: '/person' },
  { keys: ['CAN-AM Buggy Tour with Dinner'], amount: 1249, unit: '/person' },
]
const normalize = (text) => String(text || '').normalize('NFKC').toLowerCase()
  .replace(/[–—−]/g, '-').replace(/[^a-z0-9]+/g, ' ').trim()

export function getTourRate(tourOrTitle) {
  const tour = typeof tourOrTitle === 'string' ? { title: tourOrTitle } : tourOrTitle || {}
  const names = [tour.sourceTitle, tour.title].filter(Boolean).map(normalize)
  const match = rates.find(({ keys }) => keys.some((key) => names.includes(normalize(key))))
  return match ? { ...match, price: `AED ${match.amount.toLocaleString('en-US')}` } : null
}

export function applyTourPricing(tour) {
  if (!tour) return tour
  const rate = getTourRate(tour)
  if (!rate) return tour
  return {
    ...tour,
    price: rate.price,
    unit: rate.unit,
    basePrice: rate.amount,
    isBookable: true,
    ...(rate.image ? { image: rate.image, featuredImage: rate.image,
      gallery: Array.isArray(tour.gallery) ? [rate.image, ...tour.gallery.filter(x => x !== rate.image)] : [rate.image] } : {}),
  }
}
