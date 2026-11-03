import crypto from 'crypto'
import { Router } from 'express'
import mongoose from 'mongoose'
import PromoCode from '../models/PromoCode.js'
import Tour from '../models/Tour.js'
import { normalizeTourTitle, publishedRateTours, withTourRate } from '../utils/tourPricing.js'

const router = Router()

// Discount options for the offer popup. Every issued code is unique and single-use.
const PROMO_PERCENTS = [10, 15, 20]
const ISSUED_TTL_MS = 60 * 60 * 1000 // popup code nobody copied
const CLAIMED_TTL_MS = 7 * 24 * 60 * 60 * 1000 // copied code: valid for a week
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const OFFERS_PER_IP_PER_HOUR = 240

const tourCodes = [
  [/quad/i, 'QUAD'],
  [/buggy|can-am/i, 'BUGGY'],
  [/private|family|sahara|seating/i, 'PRIVATE'],
  [/vip|premium/i, 'VIP'],
  [/safari/i, 'SAFARI'],
  [/city|tour/i, 'TOUR'],
]

const dbReady = () => mongoose.connection.readyState === 1
const pick = (items) => items[crypto.randomInt(items.length)]
const slugify = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function parseAed(price) {
  const match = String(price || '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : 0
}

function randomCode(title, percent) {
  const prefix = tourCodes.find(([pattern]) => pattern.test(title))?.[1] || 'TRIP'
  const suffix = Array.from({ length: 5 }, () => CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)]).join('')
  return `${prefix}${percent}-${suffix}`
}

export const normalizePromoCode = (value) => String(value || '').trim().toUpperCase().replace(/\s+/g, '')

export function promoSummary(promo) {
  const discountedPrice = Math.round(promo.basePrice * (1 - promo.percent / 100))
  return {
    code: promo.code,
    percent: promo.percent,
    title: promo.tourTitle,
    category: promo.category,
    slug: promo.slug,
    categorySlug: promo.categorySlug,
    image: promo.image,
    basePrice: promo.basePrice,
    discountedPrice,
    unit: promo.unit,
    expiresAt: promo.expiresAt,
  }
}

// Fixed-rate website tours plus any tour priced in AED from the admin panel.
let candidateCache = { at: 0, tours: [] }
async function promoCandidates() {
  if (Date.now() - candidateCache.at < 60 * 1000) return candidateCache.tours

  const tours = new Map()
  publishedRateTours.forEach((tour) => {
    tours.set(normalizeTourTitle(tour.title), {
      title: tour.title, category: tour.category, basePrice: tour.amount, unit: tour.unit, slug: '', categorySlug: '', image: '',
    })
  })

  const dbTours = await Tour.find({ published: true }).select('title category slug image price unit').lean().catch(() => [])
  dbTours.map(withTourRate).forEach((tour) => {
    const key = normalizeTourTitle(tour.title)
    const basePrice = parseAed(tour.price)
    if (!tour.title || !basePrice || tours.has(key)) return
    tours.set(key, {
      title: tour.title,
      category: tour.category || '',
      basePrice,
      unit: tour.unit || '',
      slug: tour.slug || '',
      categorySlug: slugify(tour.category),
      image: tour.image || '',
    })
  })

  candidateCache = { at: Date.now(), tours: [...tours.values()] }
  return candidateCache.tours
}

const offerHits = new Map()
function overOfferLimit(ip) {
  const now = Date.now()
  const recent = (offerHits.get(ip) || []).filter((time) => now - time < 60 * 60 * 1000)
  recent.push(now)
  offerHits.set(ip, recent)
  if (offerHits.size > 5000) offerHits.clear()
  return recent.length > OFFERS_PER_IP_PER_HOUR
}

// New random offer with a fresh, never-before-issued code.
router.post('/offer', async (req, res) => {
  if (!dbReady()) return res.status(503).json({ message: 'Offers are unavailable right now.' })
  if (overOfferLimit(req.ip)) return res.status(429).json({ message: 'Too many offers requested.' })

  try {
    const excludeKey = normalizeTourTitle(req.body?.excludeTitle)
    const candidates = (await promoCandidates()).filter((tour) => normalizeTourTitle(tour.title) !== excludeKey)
    if (!candidates.length) return res.status(404).json({ message: 'No tours available for offers.' })

    const tour = pick(candidates)
    const percent = pick(PROMO_PERCENTS)

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const promo = await PromoCode.create({
          code: randomCode(tour.title, percent),
          tourTitle: tour.title,
          tourKey: normalizeTourTitle(tour.title),
          category: tour.category,
          slug: tour.slug,
          categorySlug: tour.categorySlug,
          image: tour.image,
          percent,
          basePrice: tour.basePrice,
          unit: tour.unit,
          expiresAt: new Date(Date.now() + ISSUED_TTL_MS),
        })
        return res.status(201).json(promoSummary(promo))
      } catch (error) {
        if (error?.code !== 11000) throw error
      }
    }
    return res.status(500).json({ message: 'Could not create an offer.' })
  } catch (error) {
    console.error('Promo offer error:', error.message)
    return res.status(500).json({ message: 'Could not create an offer.' })
  }
})

// Visitor copied the code: keep it valid for a week.
router.post('/claim', async (req, res) => {
  if (!dbReady()) return res.status(503).json({ message: 'Promo codes are unavailable right now.' })
  const code = normalizePromoCode(req.body?.code)
  const promo = await PromoCode.findOneAndUpdate(
    { code, status: { $in: ['issued', 'claimed'] }, expiresAt: { $gt: new Date() } },
    { $set: { status: 'claimed', claimedAt: new Date(), expiresAt: new Date(Date.now() + CLAIMED_TTL_MS) } },
    { new: true },
  ).lean().catch(() => null)
  if (!promo) return res.status(404).json({ message: 'This promo code has expired or was already used.' })
  return res.json(promoSummary(promo))
})

// Check a code against the tour being booked (does not use it up).
router.get('/validate', async (req, res) => {
  if (!dbReady()) return res.status(503).json({ message: 'Promo codes are unavailable right now.' })
  const code = normalizePromoCode(req.query.code)
  if (!code) return res.status(400).json({ message: 'Enter a promo code.' })

  const promo = await PromoCode.findOne({ code }).lean().catch(() => null)
  if (!promo || (promo.status !== 'redeemed' && promo.expiresAt && promo.expiresAt <= new Date())) {
    return res.status(404).json({ message: 'This promo code is not valid or has expired.' })
  }
  if (promo.status === 'redeemed') return res.status(409).json({ message: 'This promo code has already been used.' })
  if (req.query.tour && promo.tourKey !== normalizeTourTitle(req.query.tour)) {
    return res.status(422).json({ message: `This code is only valid for ${promo.tourTitle}.` })
  }
  return res.json(promoSummary(promo))
})

// Used by the booking route: atomically marks a valid code as used.
export async function redeemPromoCode(rawCode, tourTitle, bookingReference) {
  const code = normalizePromoCode(rawCode)
  return PromoCode.findOneAndUpdate(
    {
      code,
      tourKey: normalizeTourTitle(tourTitle),
      status: { $in: ['issued', 'claimed'] },
      expiresAt: { $gt: new Date() },
    },
    { $set: { status: 'redeemed', redeemedAt: new Date(), bookingReference, expiresAt: null } },
    { new: true },
  ).lean()
}

// Puts a code back if the booking that used it could not be stored.
export async function releasePromoCode(code) {
  await PromoCode.updateOne(
    { code, status: 'redeemed' },
    { $set: { status: 'claimed', redeemedAt: null, bookingReference: '', expiresAt: new Date(Date.now() + CLAIMED_TTL_MS) } },
  ).catch(() => {})
}

export default router
