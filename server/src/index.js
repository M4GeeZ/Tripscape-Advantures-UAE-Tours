import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import toursRouter from './routes/tours.js'

const app = express()
const port = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({ origin: process.env.CLIENT_URL || true }))
app.use(express.json({ limit: '1mb' }))
app.use('/api/tours', toursRouter)
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
    } catch (error) {
      console.warn('MongoDB unavailable; using fallback data.')
    }
  }
  app.listen(port, () => console.log(`Tripscape API running on http://localhost:${port}`))
}

start()
