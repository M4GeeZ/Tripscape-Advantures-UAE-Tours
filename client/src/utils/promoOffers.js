import { tourCatalog } from '../data'
import { applyTourPricing } from './tourPricing'
import { getTourDetailHref } from '../tourDetails'
import { apiUrl, mediaUrl } from './apiBaseUrl'

/*
  Promo offers shown in the bottom-right popup.
  Codes are issued by the server (/api/promos): every code is random, unique,
  tied to ONE tour and can be used on one booking only.

  Nothing is applied automatically. The visitor copies the code and pastes it into
  the "Promo code" box of that tour's booking form, where it is checked by the server.
*/

const normalize = (text) => String(text || '').normalize('NFKC').toLowerCase()
  .replace(/[–—−]/g, '-').replace(/[^a-z0-9]+/g, ' ').trim()

export { normalize as normalizeTourName }

// Card images for the fixed-price website tours (admin tours send their own image).
let catalogByTitle = null
function catalogTour(title) {
  if (!catalogByTitle) {
    catalogByTitle = new Map(tourCatalog.map(applyTourPricing).map((tour) => [normalize(tour.title), tour]))
  }
  return catalogByTitle.get(normalize(title))
}

function toOffer(promo) {
  const local = catalogTour(promo.title)
  return {
    ...promo,
    image: promo.image ? mediaUrl(promo.image) : local?.image || '',
    href: promo.slug && promo.categorySlug
      ? `/tours/${promo.categorySlug}/${promo.slug}`
      : getTourDetailHref(promo.category || local?.category || 'Desert Safari', promo.title),
  }
}

async function postJson(path, body) {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

// Fresh random offer with a never-used code, or null when offers are unavailable.
export async function fetchOffer(excludeTitle = '') {
  try {
    return toOffer(await postJson('/api/promos/offer', { excludeTitle }))
  } catch {
    return null
  }
}

// Keeps a copied code valid for 7 days on the server. Does not change any price on the site.
export async function claimPromo(offer) {
  if (!offer) return null
  try {
    return await postJson('/api/promos/claim', { code: offer.code })
  } catch {
    return null
  }
}

// Server check used by the booking form: the code must belong to this tour and package.
export async function validatePromo(code, tourTitle, service = '') {
  const params = new URLSearchParams({ code: String(code || '').trim(), tour: tourTitle || '', service: service || '' })
  const response = await fetch(apiUrl(`/api/promos/validate?${params}`))
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'This promo code is not valid.')
  return data
}

export const formatAed = (amount) => `AED ${Math.round(amount).toLocaleString('en-US')}`
