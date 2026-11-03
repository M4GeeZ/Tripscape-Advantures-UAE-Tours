import { Router } from 'express'
import Tour from '../models/Tour.js'
import { fallbackTours } from '../data/fallbackTours.js'
import { withTourRate } from '../utils/tourPricing.js'

const router = Router()

function mediaUrl(value) {
  const source = String(value || '')
  if (source.startsWith('/uploads/')) return `/api${source}`
  return source
}

function mapTour(tour) {
  return withTourRate({
    ...tour,
    image: mediaUrl(tour.image),
    gallery: Array.isArray(tour.gallery) ? tour.gallery.map(mediaUrl) : [],
    id: `db-${tour._id}`,
    location: `${tour.destination || 'Dubai'}, UAE`,
    categoryLabel: tour.category,
    categorySlug: tour.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    placements: {
      home: Boolean(tour.placements?.home),
      allTours: tour.placements?.allTours !== false,
      services: Boolean(tour.placements?.services),
      paths: Array.isArray(tour.placements?.paths) ? tour.placements.paths : [],
    },
  })
}

router.get('/', async (_req, res) => {
  try {
    const connected = Tour.db.readyState === 1
    if (!connected) return res.json(fallbackTours.map(withTourRate))
    const tours = await Tour.find({ published: true }).sort({ sortOrder: 1, createdAt: 1 }).lean()
    const dynamic = tours.map(mapTour)
    const seen = new Set(dynamic.map((tour) => String(tour.title || '').toLowerCase()))
    const fallback = fallbackTours.filter((tour) => !seen.has(String(tour.title || '').toLowerCase()))
    res.json([...dynamic, ...fallback.map(withTourRate)])
  } catch {
    res.status(200).json(fallbackTours.map(withTourRate))
  }
})

router.get('/:category/:slug', async (req, res) => {
  try {
    if (Tour.db.readyState !== 1) return res.status(404).json({ message: 'Tour not found.' })
    const tour = await Tour.findOne({ slug: req.params.slug, published: true }).lean()
    if (!tour) return res.status(404).json({ message: 'Tour not found.' })
    res.json(mapTour(tour))
  } catch {
    res.status(404).json({ message: 'Tour not found.' })
  }
})

export default router
