import './config/env.js'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import toursRouter from './routes/tours.js'
import bookingsRouter, { startBookingNotificationWorker } from './routes/bookings.js'
import googleReviewsRouter from './routes/googleReviews.js'
import reviewsRouter from './routes/reviews.js'
import blogsRouter from './routes/blogs.js'
import adminAuthRouter from './routes/adminAuth.js'
import adminRouter from './routes/admin.js'
import seoRouter from './routes/seo.js'
import promosRouter from './routes/promos.js'
import { securityHeaders } from './middleware/security.js'
import { seedInitialBlogs, seedInitialTours } from './data/seedCms.js'

const app = express()
app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(securityHeaders)
const port = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (configuredOrigins.includes(origin)) return true
  try {
    const hostname = new URL(origin).hostname.toLowerCase()
    return hostname === 'tripscapetourism.com'
      || hostname === 'www.tripscapetourism.com'
      || hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

app.use(cors({
  origin(origin, callback) {
    const allowed = isAllowedOrigin(origin)
    callback(allowed ? null : new Error('Origin not allowed by CORS'), allowed)
  },
  credentials: true,
}))
app.use('/api/admin/upload', express.json({ limit: '12mb' }))
app.use(express.json({ limit: '1mb' }))
app.use('/api/tours', toursRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/google-reviews', googleReviewsRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/seo', seoRouter)
app.use('/api/promos', promosRouter)
app.use('/api/admin/auth', adminAuthRouter)
app.use('/api/admin', adminRouter)
app.use('/api/uploads', express.static(path.resolve(__dirname, '../uploads'), { maxAge: '7d', immutable: true }))
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads'), { maxAge: '7d', immutable: true }))
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'tripscape-api' }))
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).json({ message: 'Name, email and message are required.' })
  res.status(201).json({ message: 'Thanks! Your enquiry has been received.' })
})

const clientDist = path.resolve(__dirname, '../../client/dist')
app.use(express.static(clientDist))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(clientDist, 'index.html'), (error) => error && next())
})

async function start() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('MongoDB connected')
      try {
        await seedInitialTours()
        await seedInitialBlogs()
        console.log('CMS seed check complete')
      } catch (error) {
        console.warn('CMS seed skipped:', error.message)
      }
    } catch (error) {
      console.warn('MongoDB unavailable; using fallback data.')
    }
  }
  startBookingNotificationWorker()

  const server = app.listen(port, () => {
    console.log(`Tripscape API running on http://localhost:${port}`)
  })

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the running process or set PORT to another value.`)
      process.exit(1)
    }

    console.error('Server startup failed:', error)
    process.exit(1)
  })
}

start()
