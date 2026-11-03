const priceMap = new Map([
  ['evening desert safari with bbq dinner', [99, '/person']],
  ['vip premium desert safari with bbq dinner', [149, '/person']],
  ['vip private desert safari family package', [749, '/car']],
  ['vip desert safari with private seating', [1249, '/car']],
  ['private desert safari with sahara fortress dinner', [2949, '/car']],
  ['single and double quad bike', [249, '/bike']],
  ['evening quad bike with dinner', [299, '/person']],
  ['morning desert safari with quad bike', [255, '/person']],
  ['can am buggy tour with dinner', [1249, '/person']],
])
const normalize = v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

// Published fixed-price tours that appear as cards on the website (title + category as shown there).
export const publishedRateTours = [
  ['Evening Desert Safari with BBQ Dinner', 'Desert Safari'],
  ['VIP Premium Desert Safari with BBQ Dinner', 'Desert Safari'],
  ['VIP Desert Safari with Private Seating', 'Desert Safari'],
  ['Private Desert Safari with Sahara Fortress Dinner', 'Desert Safari'],
  ['Morning Desert Safari with Quad Bike', 'Desert Safari'],
  ['Single and Double Quad Bike', 'Desert Adventures'],
  ['Evening Quad Bike with Dinner', 'Desert Adventures'],
  ['CAN-AM Buggy Tour with Dinner', 'Desert Adventures'],
].map(([title, category]) => {
  const [amount, unit] = priceMap.get(normalize(title))
  return { title, category, amount, unit }
})

export { normalize as normalizeTourTitle }
export function withTourRate(tour) {
  const key = normalize(tour.title)
  const alias = key.includes('family package') && key.includes('desert safari') ? 'vip private desert safari family package' : key
  const rate = priceMap.get(alias)
  if (!rate) return tour
  const [amount, unit] = rate
  const img = alias === 'private desert safari with sahara fortress dinner' ? '/images/private-desert-setup/private-sahara-fortress-dinner.jpg' : null
  return { ...tour, price: `AED ${amount.toLocaleString('en-US')}`, unit, ...(img ? {image:img, gallery:[img,...(tour.gallery||[]).filter(x => x!==img)]}: {}) }
}
