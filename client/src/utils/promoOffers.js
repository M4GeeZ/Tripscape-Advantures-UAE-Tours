import { useSyncExternalStore } from 'react'
import { tourCatalog } from '../data'
import { applyTourPricing } from './tourPricing'
import { getTourDetailHref } from '../tourDetails'
import { apiUrl, mediaUrl } from './apiBaseUrl'

/*
  Promo offers shown in the bottom-right popup.
  Codes are issued by the server (/api/promos): every code is random, unique,
  tied to one tour and can be used on one booking only.
  When a visitor copies a code it is "claimed" (valid for 7 days), saved in their
  browser, and that tour's card prices show the discount. The booking form fills
  the code in automatically and the server applies it when the booking is sent.
*/
const STORAGE_KEY = 'tripscape-active-promos-v2'
const CLAIMED_TTL_MS = 7 * 24 * 60 * 60 * 1000

const normalize = (text) => String(text || '').normalize('NFKC').toLowerCase()
  .replace(/[–—−]/g, '-').replace(/[^a-z0-9]+/g, ' ').trim()

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

/* ---- Active promo store (localStorage + subscribers) ---- */

const listeners = new Set()

function readStore() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
    const now = Date.now()
    return Object.fromEntries(Object.entries(raw).filter(([, promo]) => promo?.code && promo?.expires > now))
  } catch {
    return {}
  }
}

let activePromos = typeof window === 'undefined' ? {} : readStore()

function saveStore(next) {
  activePromos = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activePromos))
  } catch {
    // Storage blocked: the discount still applies for this page view.
  }
  listeners.forEach((listener) => listener())
}

// Claims the code on the server (extends it to 7 days) and applies it to the tour's prices.
export async function claimPromo(offer) {
  if (!offer) return null
  try {
    const claimed = await postJson('/api/promos/claim', { code: offer.code })
    saveStore({
      ...activePromos,
      [normalize(claimed.title)]: {
        code: claimed.code,
        percent: claimed.percent,
        expires: claimed.expiresAt ? new Date(claimed.expiresAt).getTime() : Date.now() + CLAIMED_TTL_MS,
      },
    })
    return claimed
  } catch {
    return null
  }
}

// Stores a code that was validated in the booking form.
export function rememberPromo(promo) {
  if (!promo?.code || !promo?.title) return
  saveStore({
    ...activePromos,
    [normalize(promo.title)]: {
      code: promo.code,
      percent: promo.percent,
      expires: promo.expiresAt ? new Date(promo.expiresAt).getTime() : Date.now() + CLAIMED_TTL_MS,
    },
  })
}

// Removes a code once it has been used or turned out to be invalid.
export function forgetPromo(title) {
  const key = normalize(title)
  if (!activePromos[key]) return
  const { [key]: _removed, ...rest } = activePromos
  saveStore(rest)
}

export async function validatePromo(code, tourTitle) {
  const params = new URLSearchParams({ code: String(code || '').trim(), tour: tourTitle || '' })
  const response = await fetch(apiUrl(`/api/promos/validate?${params}`))
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'This promo code is not valid.')
  return data
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getActivePromo(title) {
  return activePromos[normalize(title)] || null
}

export function usePromo(title) {
  return useSyncExternalStore(subscribe, () => getActivePromo(title), () => null)
}

const parseAed = (price) => {
  const match = String(price || '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : 0
}

export const formatAed = (amount) => `AED ${Math.round(amount).toLocaleString('en-US')}`

// Returns { price, oldPrice, percent, code } when a promo applies, otherwise null.
export function applyPromoToPrice(price, promo) {
  const amount = parseAed(price)
  if (!promo || !amount) return null
  return {
    price: formatAed(amount * (1 - promo.percent / 100)),
    oldPrice: formatAed(amount),
    percent: promo.percent,
    code: promo.code,
  }
}
