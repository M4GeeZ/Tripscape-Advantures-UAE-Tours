import { Router } from 'express'
import Tour from '../models/Tour.js'
import { fallbackTours } from '../data/fallbackTours.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const connected = Tour.db.readyState === 1
    if (!connected) return res.json(fallbackTours)
    const tours = await Tour.find().sort({ featured: -1, createdAt: -1 }).lean()
    res.json(tours.length ? tours : fallbackTours)
  } catch (error) {
    res.status(200).json(fallbackTours)
  }
})

export default router
