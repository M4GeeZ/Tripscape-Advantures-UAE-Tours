import { Router } from 'express'
import mongoose from 'mongoose'
import SeoPage from '../models/SeoPage.js'
import { normalizeSeoPath } from '../utils/seoPath.js'
const router = Router()
router.get('/', async (req, res) => {
  const path = normalizeSeoPath(req.query.path)
  if (!path) return res.status(400).json({ message: 'Invalid page URL.' })
  if (mongoose.connection.readyState !== 1) return res.json(null)
  try {
    const record = await SeoPage.findOne({ path, published: true }).lean()
    res.json(record || null)
  } catch { res.json(null) }
})
export default router
