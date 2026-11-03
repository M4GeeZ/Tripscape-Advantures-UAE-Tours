import { Router } from 'express'
import mongoose from 'mongoose'
import Review from '../models/Review.js'

const router = Router()

function mediaSafeUrl(value) {
  return String(value || '').trim().slice(0, 1000)
}

function mapReview(review) {
  return {
    id: `db-${review._id}`,
    _id: review._id,
    name: review.name,
    rating: Number(review.rating) || 5,
    text: review.text,
    source: review.source || 'Website',
    sourceUrl: review.sourceUrl || '',
    reviewDate: review.reviewDate || review.createdAt,
    published: Boolean(review.published),
    sortOrder: Number(review.sortOrder) || 0,
  }
}

router.get('/', async (_req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([])

  try {
    const reviews = await Review.find({ published: true })
      .sort({ sortOrder: 1, reviewDate: -1, createdAt: -1 })
      .lean()
    res.json(reviews.map(mapReview))
  } catch (error) {
    console.error('Public reviews error:', error.message)
    res.json([])
  }
})

export default router
