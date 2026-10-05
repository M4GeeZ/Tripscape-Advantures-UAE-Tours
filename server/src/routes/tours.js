import { Router } from 'express'
import Tour from '../models/Tour.js'
import { fallbackTours } from '../data/fallbackTours.js'

const router = Router()

function mapTour(tour) {
  return {
    ...tour,
    id: `db-${tour._id}`,
    location: `${tour.destination || 'Dubai'}, UAE`,
    categoryLabel: tour.category,
    categorySlug: tour.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
  }
}

router.get('/', async (_req, res) => {
  try {
    const connected = Tour.db.readyState === 1
    if (!connected) return res.json(fallbackTours)
    const tours = await Tour.find({ published: true }).sort({ sortOrder: 1, createdAt: 1 }).lean()
    const dynamic = tours.map(mapTour)
    const seen = new Set(dynamic.map((tour) => String(tour.title || '').toLowerCase()))
    const fallback = fallbackTours.filter((tour) => !seen.has(String(tour.title || '').toLowerCase()))
    res.json([...dynamic, ...fallback])
  } catch {
    res.status(200).json(fallbackTours)
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
